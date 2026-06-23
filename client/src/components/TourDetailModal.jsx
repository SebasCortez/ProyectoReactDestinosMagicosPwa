import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function TourDetailModal({ tour, onClose }) {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [adultos, setAdultos] = useState(1);
  const [ninos,   setNinos]   = useState(0);
  const [added,   setAdded]   = useState(false);

  if (!tour) return null;

  const includes = tour.incluye ? tour.incluye.split(',') : [];

  function handleAdd() {
    addToCart(tour, adultos, ninos);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <button className="icon-btn modal__close" onClick={onClose}>✕</button>

        <img src={tour.imagen_url} alt={tour.titulo} className="modal__hero-img" />

        <div className="modal__body">
          {tour.badge && <span className="badge badge--accent">{tour.badge}</span>}
          <h2>{tour.titulo}</h2>
          <p className="modal__desc">{tour.descripcion}</p>

          <div className="modal__meta">
            <span>⏱ {tour.duracion}</span>
            <span>👥 {tour.tamano_grupo}</span>
            <span>🥾 {tour.nivel_dificultad}</span>
            {tour.alimentacion && <span>🍽 {tour.alimentacion}</span>}
          </div>

          <div className="modal__itinerary">
            <h4>Itinerario</h4>
            <p>{tour.detalle}</p>
          </div>

          {includes.length > 0 && (
            <div className="modal__includes">
              <h4>Incluye</h4>
              <ul>
                {includes.map((item, i) => (
                  <li key={i}>✓ {item.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal__footer">
            <div className="tour-card__counters">
              <div className="counter">
                <span>Adultos</span>
                <div className="counter__controls">
                  <button onClick={() => setAdultos(v => Math.max(0, v-1))}>−</button>
                  <span>{adultos}</span>
                  <button onClick={() => setAdultos(v => v+1)}>+</button>
                </div>
              </div>
              <div className="counter">
                <span>Niños</span>
                <div className="counter__controls">
                  <button onClick={() => setNinos(v => Math.max(0, v-1))}>−</button>
                  <span>{ninos}</span>
                  <button onClick={() => setNinos(v => v+1)}>+</button>
                </div>
              </div>
            </div>
            <div className="modal__price-action">
              <div className="tour-card__price">
                <span className="tour-card__from">{t('package.from')}</span>
                <span className="tour-card__amount">${Number(tour.precio_desde).toFixed(0)}</span>
                <span className="tour-card__per">{t('package.perPerson')}</span>
              </div>
              <button
                className={`btn btn--primary${added ? ' btn--added' : ''}`}
                onClick={handleAdd}
                disabled={adultos + ninos === 0}
              >
                {added ? '✓ Agregado' : t('package.add')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
