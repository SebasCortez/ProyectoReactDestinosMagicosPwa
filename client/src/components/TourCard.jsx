import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';

export default function TourCard({ tour, onDetails }) {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [adultos, setAdultos] = useState(1);
  const [ninos,   setNinos]   = useState(0);
  const [added,   setAdded]   = useState(false);

  function handleAdd() {
    addToCart(tour, adultos, ninos);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="tour-card">
      {tour.badge && <span className="tour-card__badge">{tour.badge}</span>}

      <img
        src={tour.imagen_url}
        alt={tour.titulo}
        className="tour-card__img"
        loading="lazy"
      />

      <div className="tour-card__body">
        <h3 className="tour-card__title">{tour.titulo}</h3>
        <p className="tour-card__desc">{tour.descripcion}</p>

        <ul className="tour-card__meta">
          <li>⏱ {tour.duracion}</li>
          <li>👥 {tour.tamano_grupo}</li>
          <li>🥾 {tour.nivel_dificultad}</li>
          {tour.alimentacion && <li>🍽 {tour.alimentacion}</li>}
        </ul>

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

        <div className="tour-card__footer">
          <div className="tour-card__price">
            <span className="tour-card__from">{t('package.from')}</span>
            <span className="tour-card__amount">${Number(tour.precio_desde).toFixed(0)}</span>
            <span className="tour-card__per">{t('package.perPerson')}</span>
          </div>
          <div className="tour-card__actions">
            <button className="btn btn--outline btn--sm" onClick={() => onDetails(tour)}>
              {t('package.details')}
            </button>
            <button
              className={`btn btn--primary btn--sm${added ? ' btn--added' : ''}`}
              onClick={handleAdd}
              disabled={adultos + ninos === 0}
            >
              {added ? '✓' : t('package.add')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
