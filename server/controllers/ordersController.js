const pool = require('../db/pool');

// POST /api/orders
async function createOrder(req, res) {
  const { nombre, email, telefono, notas, items } = req.body;

  // Validación básica
  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'nombre, email y telefono son requeridos' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'El carrito no puede estar vacío' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Obtener precios actuales desde la BD (nunca confiar en el cliente)
    const tourIds = items.map(i => i.tour_id);
    const { rows: tours } = await client.query(
      'SELECT id, precio_desde FROM tours WHERE id = ANY($1) AND activo = TRUE',
      [tourIds]
    );

    if (tours.length !== tourIds.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Uno o más tours no están disponibles' });
    }

    const priceMap = Object.fromEntries(tours.map(t => [t.id, Number(t.precio_desde)]));

    // Calcular total en el servidor
    let total = 0;
    const enrichedItems = items.map(item => {
      const precio_unit = priceMap[item.tour_id];
      const personas    = (item.adultos || 0) + (item.ninos || 0);
      if (personas < 1) throw new Error(`El tour ${item.tour_id} requiere al menos 1 persona`);
      total += precio_unit * personas;
      return { ...item, precio_unit };
    });

    // Crear el pedido
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (nombre, email, telefono, notas, total)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, email, telefono, notas || null, total]
    );

    // Insertar los items
    for (const item of enrichedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, tour_id, adultos, ninos, precio_unit)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.tour_id, item.adultos || 0, item.ninos || 0, item.precio_unit]
      );
    }

    await client.query('COMMIT');

    // Armar mensaje y link de WhatsApp
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '51999999999';
    const tourLines = enrichedItems.map(item => {
      const tour  = tours.find(t => t.id === item.tour_id);
      const pers  = (item.adultos || 0) + (item.ninos || 0);
      return `- Tour #${item.tour_id} × ${pers} persona(s): $${(item.precio_unit * pers).toFixed(2)}`;
    }).join('\n');

    const message = encodeURIComponent(
      `🌟 *Nueva Reserva - Destinos Mágicos*\n` +
      `📋 Pedido #${order.id}\n\n` +
      `👤 *Cliente:* ${nombre}\n` +
      `📧 Email: ${email}\n` +
      `📞 Teléfono: ${telefono}\n\n` +
      `🗺️ *Tours reservados:*\n${tourLines}\n\n` +
      `💰 *Total: $${total.toFixed(2)}*\n` +
      (notas ? `📝 Notas: ${notas}` : '')
    );

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    res.status(201).json({
      order_id:     order.id,
      total:        total,
      whatsapp_url: whatsappUrl,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message || 'Error al procesar el pedido' });
  } finally {
    client.release();
  }
}

// GET /api/orders/:id  (protegido)
async function getOrder(req, res) {
  const { id } = req.params;
  try {
    const { rows: [order] } = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    const { rows: items } = await pool.query(
      `SELECT oi.*, t.titulo
       FROM order_items oi
       JOIN tours t ON t.id = oi.tour_id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({ ...order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
}

module.exports = { createOrder, getOrder };
