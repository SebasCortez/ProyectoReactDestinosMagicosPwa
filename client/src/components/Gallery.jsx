import { useState } from 'react';
import { useLang } from '../context/LangContext';

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop', titleKey: 'Machu Picchu', descKey: null },
  { src: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/e9/1a/cb.jpg', titleKey: 'Montaña de Colores', descKey: null },
  { src: 'https://www.boletomachupicchu.com/gutblt/wp-content/uploads/2018/03/valle-sagrado-tips-viaje.jpg', titleKey: 'Valle Sagrado', descKey: null },
  { src: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/60/32/e0/20171102-080128-largejpg.jpg?w=900&h=500&s=1', titleKey: 'Cusco', descKey: null },
  { src: 'https://cuscoperu.b-cdn.net/wp-content/uploads/2024/04/Portada-Sacsayhuaman.jpg', titleKey: 'Sacsayhuamán', descKey: null },
  { src: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/ac/07/7b.jpg', titleKey: 'Laguna Humantay', descKey: null},
];

export default function Gallery() {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="gallery section">
      <div className="container">
        <div className="section__header">
          <span className="badge">{t('gallery.badge')}</span>
          <h2>{t('gallery.title')}</h2>
          <p>{t('gallery.subtitle')}</p>
        </div>

        <div className="gallery__grid">
          {GALLERY_ITEMS.map((item, i) => (
            <button
              key={i}
              className="gallery__item"
              onClick={() => setLightbox(item)}
            >
              <img src={item.src} alt={t(item.titleKey)} loading="lazy" />
              <div className="gallery__caption">
                <strong>{t(item.titleKey)}</strong>
                {item.descKey && <span>{t(item.descKey)}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox.src} alt={t(lightbox.titleKey)} />
        </div>
      )}
    </section>
  );
}
