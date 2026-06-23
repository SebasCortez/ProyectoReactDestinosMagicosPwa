import { useLang } from '../context/LangContext';

export default function Hero() {
  const { t } = useLang();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <span className="badge badge--light">{t('hero.badge')}</span>
        <h1 className="hero__title"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <div className="hero__actions">
          <button className="btn btn--primary" onClick={() => scrollTo('packages')}>
            {t('hero.btn1')}
          </button>
          <button className="btn btn--outline-light" onClick={() => scrollTo('packages')}>
            {t('hero.btn2')}
          </button>
        </div>
      </div>
    </section>
  );
}
