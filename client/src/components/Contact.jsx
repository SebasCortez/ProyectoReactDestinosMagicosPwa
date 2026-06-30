import { useLang } from '../context/LangContext';

const PHONE    = '+51 984 556 834';
const EMAIL    = 'elenatour98@hotmail.com';
const WA_NUM   = '51984556834';

export default function Contact() {
  const { t } = useLang();

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section__header">
          <span className="badge">{t('contact.badge')}</span>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
        </div>

        <div className="contact__cards">
          <div className="contact__card">
            <span className="contact__icon">📞</span>
            <h4>{t('contact.phone')}</h4>
            <p>{PHONE}</p>
            <a href={`tel:${PHONE.replace(/\s/g,'')}`} className="btn btn--outline btn--sm">
              {t('contact.callNow')}
            </a>
          </div>

          <div className="contact__card contact__card--whatsapp">
            <span className="contact__icon">💬</span>
            <h4>WhatsApp</h4>
            <p>{PHONE}</p>
            <a
              href={`https://wa.me/${WA_NUM}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--sm"
            >
              {t('contact.chat')}
            </a>
          </div>

          <div className="contact__card">
            <span className="contact__icon">✉️</span>
            <h4>Email</h4>
            <p>{EMAIL}</p>
            <a href={`mailto:${EMAIL}`} className="btn btn--outline btn--sm">
              {t('contact.sendEmail')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
