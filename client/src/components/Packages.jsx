import { useState, useEffect, useCallback } from 'react';
import { useLang } from '../context/LangContext';
import { toursApi } from '../services/api';
import TourCard from './TourCard';

export default function Packages({ onDetails }) {
  const { t } = useLang();
  const [tours,    setTours]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [sort,     setSort]     = useState('');
  const [duration, setDuration] = useState('');

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (sort)     params.sort     = sort;
      if (duration) params.duration = duration;
      const data = await toursApi.list(params);
      setTours(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [sort, duration]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  function reset() {
    setSort('');
    setDuration('');
  }

  return (
    <section id="packages" className="packages section">
      <div className="container">
        <div className="section__header">
          <span className="badge">{t('packages.badge')}</span>
          <h2>{t('packages.title')}</h2>
          <p>{t('packages.subtitle')}</p>
        </div>

        {/* Filtros */}
        <div className="filters">
          <div className="filters__group">
            <label>{t('filters.sort')}</label>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="">{t('filters.select')}</option>
              <option value="asc">{t('filters.lowToHigh')}</option>
              <option value="desc">{t('filters.highToLow')}</option>
            </select>
          </div>
          <div className="filters__group">
            <label>{t('filters.duration')}</label>
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="">{t('filters.allDurations')}</option>
              <option value="halfday">{t('filters.halfDay')}</option>
              <option value="fullday">{t('filters.fullDay')}</option>
              <option value="multiday">{t('filters.multiDay')}</option>
            </select>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={reset}>
            {t('filters.reset')}
          </button>
        </div>

        {/* Grid */}
        {loading && (
          <div className="tours-loading">
            {[1,2,3].map(i => <div key={i} className="tour-skeleton" />)}
          </div>
        )}
        {error && (
          <div className="error-banner">
            ⚠️ {error} — <button onClick={fetchTours}>Reintentar</button>
          </div>
        )}
        {!loading && !error && (
          <div className="tours-grid">
            {tours.map(tour => (
              <TourCard key={tour.id} tour={tour} onDetails={onDetails} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
