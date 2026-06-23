export function TermsModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--info" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Términos y Condiciones</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body modal__body--scroll">
          <h4>1. Reservas y Pagos</h4>
          <p>Las reservas se confirman con el pago del 50% del total. El saldo restante se abona el día del tour.</p>
          <h4>2. Cancelaciones</h4>
          <p>Cancelaciones con más de 48h de anticipación: reembolso completo. Entre 24-48h: 50%. Menos de 24h: sin reembolso.</p>
          <h4>3. Responsabilidad</h4>
          <p>Destinos Mágicos no se responsabiliza por condiciones climáticas adversas que afecten el itinerario.</p>
          <h4>4. Seguros</h4>
          <p>Recomendamos a todos los viajeros contratar un seguro de viaje que cubra emergencias médicas y cancelaciones.</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--info" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Política de Privacidad</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body modal__body--scroll">
          <h4>Datos que recopilamos</h4>
          <p>Recopilamos nombre, email y teléfono únicamente para gestionar tu reserva y contactarte.</p>
          <h4>Uso de datos</h4>
          <p>No compartimos tu información con terceros. Los datos se usan exclusivamente para la gestión de reservas.</p>
          <h4>Contacto</h4>
          <p>Para ejercer tus derechos ARCO escríbenos a info@destinosmagicos.com.</p>
        </div>
      </div>
    </div>
  );
}

export function FaqModal({ onClose }) {
  const FAQS = [
    { q: '¿Cuál es la mejor época para visitar Cusco?', a: 'La temporada seca (abril-octubre) es ideal. Junio-agosto son los meses más populares.' },
    { q: '¿Qué incluyen los precios mostrados?', a: 'Los precios son por persona e incluyen lo listado en cada tour. El transporte desde tu hotel en Cusco generalmente está incluido.' },
    { q: '¿Se puede pagar en dólares?', a: 'Sí, aceptamos soles peruanos (PEN) y dólares americanos (USD).' },
    { q: '¿Los tours son en grupo o privados?', a: 'Ofrecemos ambas opciones. Los precios mostrados son para grupos. Consúltanos por tours privados.' },
    { q: '¿Qué pasa si me mareo por la altitud?', a: 'Recomendamos 2 días de aclimatación en Cusco. Nuestros guías llevan oxígeno y conocen la ruta perfectamente.' },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--info" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Preguntas Frecuentes</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body modal__body--scroll">
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
