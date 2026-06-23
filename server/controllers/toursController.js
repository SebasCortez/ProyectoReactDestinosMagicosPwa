const pool = require('../db/pool');

// GET /api/tours
async function listTours(req, res) {
  const { sort, duration } = req.query;

  let query  = 'SELECT * FROM tours WHERE activo = TRUE';
  const params = [];

  if (duration && ['halfday', 'fullday', 'multiday'].includes(duration)) {
    params.push(duration);
    query += ` AND data_duration = $${params.length}`;
  }

  if (sort === 'asc')  query += ' ORDER BY precio_desde ASC';
  else if (sort === 'desc') query += ' ORDER BY precio_desde DESC';
  else query += ' ORDER BY id ASC';

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tours' });
  }
}

// GET /api/tours/:id
async function getTour(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tours WHERE id = $1 AND activo = TRUE',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Tour no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tour' });
  }
}

// POST /api/tours  (protegido)
async function createTour(req, res) {
  const {
    titulo, descripcion, detalle, duracion, tamano_grupo,
    nivel_dificultad, precio_desde, badge, alimentacion,
    incluye, imagen_url, data_duration
  } = req.body;

  if (!titulo || !descripcion || precio_desde == null) {
    return res.status(400).json({ error: 'titulo, descripcion y precio_desde son requeridos' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO tours
         (titulo, descripcion, detalle, duracion, tamano_grupo,
          nivel_dificultad, precio_desde, badge, alimentacion,
          incluye, imagen_url, data_duration)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [titulo, descripcion, detalle, duracion, tamano_grupo,
       nivel_dificultad, precio_desde, badge, alimentacion,
       incluye, imagen_url, data_duration]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear tour' });
  }
}

// PUT /api/tours/:id  (protegido)
async function updateTour(req, res) {
  const { id } = req.params;
  const {
    titulo, descripcion, detalle, duracion, tamano_grupo,
    nivel_dificultad, precio_desde, badge, alimentacion,
    incluye, imagen_url, data_duration, activo
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE tours SET
         titulo=$1, descripcion=$2, detalle=$3, duracion=$4, tamano_grupo=$5,
         nivel_dificultad=$6, precio_desde=$7, badge=$8, alimentacion=$9,
         incluye=$10, imagen_url=$11, data_duration=$12, activo=$13
       WHERE id=$14
       RETURNING *`,
      [titulo, descripcion, detalle, duracion, tamano_grupo,
       nivel_dificultad, precio_desde, badge, alimentacion,
       incluye, imagen_url, data_duration, activo ?? true, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Tour no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar tour' });
  }
}

// DELETE /api/tours/:id  (soft-delete, protegido)
async function deleteTour(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'UPDATE tours SET activo = FALSE WHERE id = $1 RETURNING id',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Tour no encontrado' });
    res.json({ message: 'Tour desactivado', id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tour' });
  }
}

module.exports = { listTours, getTour, createTour, updateTour, deleteTour };
