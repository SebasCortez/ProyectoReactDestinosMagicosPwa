import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';

export default function CheckoutModal({ open, onClose }) {
  const { t } = useLang();
  const { items, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', notas:'' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  if (!open) return null;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...form,
      items: items.map(i => ({
        tour_id: i.tour.id,
        adultos: i.adultos,
        ninos:   i.ninos,
      })),
    };

    try {
      const result = await ordersApi.create(payload);
      clearCart();
      onClose();
      // Redirigir a WhatsApp DESPUÉS de que el servidor confirmó el pedido
      window.open(result.whatsapp_url, '_blank');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{t('checkout.title')}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          <h4>{t('checkout.contactTitle')}</h4>

          <div className="form-group">
            <label>{t('checkout.name')}</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Elena García"
            />
          </div>
          <div className="form-group">
            <label>{t('checkout.email')}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="elena@email.com"
            />
          </div>
          <div className="form-group">
            <label>{t('checkout.phone')}</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              placeholder="+51 999 999 999"
            />
          </div>
          <div className="form-group">
            <label>{t('checkout.notes')}</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="checkout__summary">
            {items.map(item => (
              <div key={item.tour.id} className="checkout__item">
                <span>{item.tour.titulo}</span>
                <span>{item.adultos + item.ninos} pers.</span>
              </div>
            ))}
            <div className="checkout__total">
              <span>{t('checkout.totalLabel')}</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
          </div>

          {error && <p className="form-error">⚠️ {error}</p>}

          <button
            type="submit"
            className="btn btn--whatsapp btn--full"
            disabled={loading}
          >
            {loading ? '⏳ Procesando...' : `💬 ${t('checkout.whatsapp')}`}
          </button>
        </form>
      </div>
    </div>
  );
}
