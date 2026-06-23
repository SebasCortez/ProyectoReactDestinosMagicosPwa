import { useLang } from '../context/LangContext';

const ACTIVITY_KEYS = [
  'cooking','pachamama','coca','toros','choco','community',
  'bakery','chicha','crafts','rafting','quads','biking',
  'ayahuasca','horses','llama','morada','cemetery','festivals','waterfalls',
];

const ICONS = {
  cooking:'🍳', pachamama:'🌿', coca:'🍃', toros:'🎨', choco:'🍫',
  community:'🌾', bakery:'🥐', chicha:'🏺', crafts:'🧶', rafting:'🚣',
  quads:'🏍', biking:'🚵', ayahuasca:'🌀', horses:'🐎', llama:'🦙',
  morada:'⛰️', cemetery:'⚱️', festivals:'🎉', waterfalls:'💧',
};

export default function Activities() {
  const { t } = useLang();
  const WA_NUMBER = '51999999999'; // cambiar en producción

  return (
    <section id="activities" className="activities section">
      <div className="container">
        <div className="section__header">
          <span className="badge">{t('activities.badge')}</span>
          <h2>{t('activities.title')}</h2>
          <p>{t('activities.subtitle')}</p>
        </div>

        <div className="activities__grid">
          {ACTIVITY_KEYS.map(key => (
            <div key={key} className="activity-chip">
              <span className="activity-chip__icon">{ICONS[key]}</span>
              <span>{t(`activities.${key}`)}</span>
            </div>
          ))}
        </div>

        <div className="activities__cta">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t('activities.whatsapp'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--whatsapp"
          >
            💬 {t('activities.whatsapp')}
          </a>
        </div>
      </div>
    </section>
  );
}
