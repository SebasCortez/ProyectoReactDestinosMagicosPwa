import { useState } from 'react';
import { useLang } from '../context/LangContext';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop',
    caption: 'Machu Picchu',
  },
  {
    img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
    caption: 'Salineras de Maras',
  },
  {
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
    caption: 'Montaña Palccoyo',
  },
  {
    img: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&h=600&fit=crop',
    caption: 'Lago Titicaca',
  },
];

export default function About() {
  const { t } = useLang();
  const [slide, setSlide] = useState(0);

  const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide(s => (s + 1) % SLIDES.length);

  return (
    <section id="about" className="about section">
      <div className="container about__grid">

        {/* Carrusel */}
        <div className="carousel">
          <img
            src={SLIDES[slide].img}
            alt={SLIDES[slide].caption}
            className="carousel__img"
          />
          <div className="carousel__controls">
            <button onClick={prev} aria-label="Anterior">‹</button>
            <span>{SLIDES[slide].caption}</span>
            <button onClick={next} aria-label="Siguiente">›</button>
          </div>
          <div className="carousel__dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`dot${i === slide ? ' dot--active' : ''}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>

        {/* Texto */}
        <div className="about__text">
          <div className="about__card">
            <span className="badge">{t('about.mission.badge')}</span>
            <h3>{t('about.mission.title')}</h3>
            <p>{t('about.mission.text')}</p>
          </div>
          <div className="about__card">
            <span className="badge">{t('about.vision.badge')}</span>
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.text')}</p>
          </div>
          <div className="about__card about__card--highlight">
            <span className="badge">{t('about.founder.badge')}</span>
            <h3>{t('about.founder.title')}</h3>
            <p dangerouslySetInnerHTML={{ __html: t('about.founder.text') }} />
          </div>
        </div>
      </div>
    </section>
  );
}
