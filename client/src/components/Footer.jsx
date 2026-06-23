import { useLang } from '../context/LangContext';

export default function Footer({ onTerms, onPrivacy, onFaq }) {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer__grid">

        <div className="footer__brand">
          <span className="footer__logo">✦ Destinos<strong>Mágicos</strong></span>
          <p>{t('footer.desc')}</p>
          <div className="footer__social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
            <a href="https://facebook.com"  target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
            <a href="https://tiktok.com"    target="_blank" rel="noopener noreferrer" aria-label="TikTok">🎵</a>
          </div>
        </div>

        <div className="footer__col">
          <h5>{t('footer.quickLinks')}</h5>
          <ul>
            {['hero','about','packages','gallery','contact'].map((id, i) => {
              const keys = ['nav.home','nav.about','nav.packages','nav.gallery','nav.contact'];
              return (
                <li key={id}>
                  <button onClick={() =>
                    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
                  }>
                    {t(keys[i])}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="footer__col">
          <h5>{t('footer.info')}</h5>
          <ul>
            <li><button onClick={onTerms}>{t('footer.terms')}</button></li>
            <li><button onClick={onPrivacy}>{t('footer.privacy')}</button></li>
            <li><button onClick={onFaq}>{t('footer.faq')}</button></li>
          </ul>
        </div>

        <div className="footer__col">
          <h5>{t('footer.hours')}</h5>
          <p>{t('footer.weekdays')}</p>
          <p>{t('footer.saturday')}</p>
          <p>{t('footer.sunday')}</p>
          <p className="footer__payment-label">{t('footer.payment')}</p>
          <div className="footer__payments">
            <span>💳</span><span>💵</span><span>🏦</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>{t('footer.rights')}</p>
        <p>{t('footer.madeIn')}</p>
      </div>
    </footer>
  );
}
