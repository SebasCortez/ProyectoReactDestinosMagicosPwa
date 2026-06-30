import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import {
  validateNombre, validateEmail, validateTelefono, validateNotas, validateForm
} from '../utils/validators';

const VALIDATORS = {
  nombre:   validateNombre,
  email:    validateEmail,
  telefono: validateTelefono,
  notas:    validateNotas,
};

export default function CheckoutModal({ open, onClose }) {
  // ── TODOS los hooks van primero, sin returns antes de ellos ──
  const { t } = useLang();
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', notas:'' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Early return DESPUÉS de declarar todos los hooks ─────────
  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: VALIDATORS[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: VALIDATORS[name](value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Tu carrito está vacío. Agrega al menos un tour antes de continuar.');
      return;
    }

    const { errors, isValid } = validateForm(form, VALIDATORS);
    setFieldErrors(errors);
    setTouched({ nombre: true, email: true, telefono: true, notas: true });

    if (!isValid) {
      setError('Revisa los campos marcados antes de continuar.');
      return;
    }

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
      window.open(result.whatsapp_url, '_blank');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function inputClass(name) {
    if (!touched[name]) return '';
    return fieldErrors[name] ? 'input--error' : 'input--valid';
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{t('checkout.title')}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit} noValidate>
          <h4>{t('checkout.contactTitle')}</h4>

          <div className="form-group">
            <label>{t('checkout.name')}</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('nombre')}
              placeholder="Elena García"
            />
            {touched.nombre && fieldErrors.nombre && (
              <span className="field-error">{fieldErrors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label>{t('checkout.email')}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('email')}
              placeholder="elena@email.com"
            />
            {touched.email && fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>{t('checkout.phone')}</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('telefono')}
              placeholder="+51 999 999 999"
            />
            {touched.telefono && fieldErrors.telefono && (
              <span className="field-error">{fieldErrors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label>{t('checkout.notes')}</label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass('notas')}
              rows={3}
              maxLength={500}
            />
            <span className="char-counter">{form.notas.length}/500</span>
            {touched.notas && fieldErrors.notas && (
              <span className="field-error">{fieldErrors.notas}</span>
            )}
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