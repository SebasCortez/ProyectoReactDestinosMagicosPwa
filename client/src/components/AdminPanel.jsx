import { useState, useEffect } from 'react';
import { toursApi, authApi } from '../services/api';
import {
  validateUsername, validatePassword,
  validateRequiredText, validatePrecio, validateUrl, validateForm
} from '../utils/validators';

/* ── Login form ─────────────────────────────────────────────── */
function LoginForm({ onLogin }) {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const LOGIN_VALIDATORS = { username: validateUsername, password: validatePassword };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: LOGIN_VALIDATORS[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: LOGIN_VALIDATORS[name](value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const { errors, isValid } = validateForm(form, LOGIN_VALIDATORS);
    setFieldErrors(errors);
    setTouched({ username: true, password: true });
    if (!isValid) return;

    setLoading(true);
    try {
      const { token } = await authApi.login(form);
      localStorage.setItem('dm_admin_token', token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>✦ Admin</h1>
        <p>Destinos Mágicos — Panel de gestión</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Usuario</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.username ? (fieldErrors.username ? 'input--error' : 'input--valid') : ''}
              autoFocus
            />
            {touched.username && fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password ? (fieldErrors.password ? 'input--error' : 'input--valid') : ''}
            />
            {touched.password && fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Tour form ───────────────────────────────────────────────── */
const EMPTY_TOUR = {
  titulo: '', descripcion: '', detalle: '', duracion: '',
  tamano_grupo: '', nivel_dificultad: 'Fácil', precio_desde: '',
  badge: '', alimentacion: '', incluye: '', imagen_url: '',
  data_duration: 'fullday', activo: true,
};

const TOUR_VALIDATORS = {
  titulo:       v => validateRequiredText(v, 'El título', 150),
  descripcion:  v => validateRequiredText(v, 'La descripción', 500),
  precio_desde: validatePrecio,
  imagen_url:   v => validateUrl(v, false),
};

function TourForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_TOUR);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initial?.id;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm(f => ({ ...f, [name]: newValue }));
    if (touched[name] && TOUR_VALIDATORS[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: TOUR_VALIDATORS[name](newValue) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    if (!TOUR_VALIDATORS[name]) return;
    setTouched(t => ({ ...t, [name]: true }));
    setFieldErrors(prev => ({ ...prev, [name]: TOUR_VALIDATORS[name](value) }));
  }

  function inputClass(name) {
    if (!touched[name]) return '';
    return fieldErrors[name] ? 'input--error' : 'input--valid';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const { errors, isValid } = validateForm(form, TOUR_VALIDATORS);
    setFieldErrors(errors);
    setTouched(t => ({ ...t, titulo: true, descripcion: true, precio_desde: true, imagen_url: true }));

    if (!isValid) {
      setError('Revisa los campos marcados antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await toursApi.update(initial.id, form);
      } else {
        await toursApi.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{isEdit ? `Editar: ${initial.titulo}` : 'Nuevo Tour'}</h2>
          <button className="icon-btn" onClick={onCancel}>✕</button>
        </div>
        <form className="modal__body admin-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-form__grid">
            <div className="form-group admin-form__full">
              <label>Título *</label>
              <input
                name="titulo" value={form.titulo}
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('titulo')}
              />
              {touched.titulo && fieldErrors.titulo && <span className="field-error">{fieldErrors.titulo}</span>}
            </div>
            <div className="form-group admin-form__full">
              <label>Descripción corta *</label>
              <textarea
                name="descripcion" value={form.descripcion}
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('descripcion')}
                rows={2} maxLength={500}
              />
              <span className="char-counter">{form.descripcion.length}/500</span>
              {touched.descripcion && fieldErrors.descripcion && <span className="field-error">{fieldErrors.descripcion}</span>}
            </div>
            <div className="form-group admin-form__full">
              <label>Detalle / Itinerario</label>
              <textarea name="detalle" value={form.detalle} onChange={handleChange} rows={4} />
            </div>

            <div className="form-group">
              <label>Precio desde (USD) *</label>
              <input
                type="number" name="precio_desde" value={form.precio_desde}
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('precio_desde')}
                min="0" step="0.01"
              />
              {touched.precio_desde && fieldErrors.precio_desde && <span className="field-error">{fieldErrors.precio_desde}</span>}
            </div>
            <div className="form-group">
              <label>Duración</label>
              <input name="duracion" value={form.duracion} onChange={handleChange} placeholder="Día completo (10h)" />
            </div>
            <div className="form-group">
              <label>Duración (filtro)</label>
              <select name="data_duration" value={form.data_duration} onChange={handleChange}>
                <option value="halfday">Medio día</option>
                <option value="fullday">Día completo</option>
                <option value="multiday">Más de un día</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tamaño del grupo</label>
              <input name="tamano_grupo" value={form.tamano_grupo} onChange={handleChange} placeholder="Grupos de 2-12" />
            </div>
            <div className="form-group">
              <label>Nivel de dificultad</label>
              <select name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange}>
                <option>Fácil</option>
                <option>Moderado</option>
                <option>Difícil</option>
              </select>
            </div>
            <div className="form-group">
              <label>Badge (etiqueta)</label>
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="Más Popular" />
            </div>
            <div className="form-group">
              <label>Alimentación</label>
              <input name="alimentacion" value={form.alimentacion} onChange={handleChange} placeholder="Almuerzo incluido" />
            </div>
            <div className="form-group admin-form__full">
              <label>Incluye (separado por comas)</label>
              <input name="incluye" value={form.incluye} onChange={handleChange} placeholder="Transporte,Guía,Entrada al sitio" />
            </div>
            <div className="form-group admin-form__full">
              <label>URL de imagen</label>
              <input
                name="imagen_url" value={form.imagen_url}
                onChange={handleChange} onBlur={handleBlur}
                className={inputClass('imagen_url')}
                placeholder="https://…"
              />
              {touched.imagen_url && fieldErrors.imagen_url && <span className="field-error">{fieldErrors.imagen_url}</span>}
            </div>
            {isEdit && (
              <div className="form-group">
                <label className="admin-checkbox">
                  <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                  Tour activo (visible en el catálogo)
                </label>
              </div>
            )}
          </div>

          {form.imagen_url && !fieldErrors.imagen_url && (
            <img
              src={form.imagen_url}
              alt="Preview"
              className="admin-form__preview"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="admin-form__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main panel ──────────────────────────────────────────────── */
export default function AdminPanel() {
  const [authed, setAuthed]       = useState(!!localStorage.getItem('dm_admin_token'));
  const [tours, setTours]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [editTour, setEditTour]   = useState(null);  // null | {} (nuevo) | tour object
  const [confirmDel, setConfirm]  = useState(null);

  async function fetchTours() {
    setLoading(true);
    try {
      // Admin ve todos (incluyendo inactivos) — llamada directa sin filtro de activo
      const data = await toursApi.list();
      setTours(data);
    } catch {
      /* silencioso */ 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) fetchTours();
  }, [authed]);

  function logout() {
    localStorage.removeItem('dm_admin_token');
    setAuthed(false);
  }

  async function handleDelete(id) {
    try {
      await toursApi.remove(id);
      setConfirm(null);
      fetchTours();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  return (
    <div className="admin">
      {/* Header */}
      <header className="admin__header">
        <span className="admin__logo">✦ Destinos Mágicos — Admin</span>
        <div className="admin__header-actions">
          <button className="btn btn--primary btn--sm" onClick={() => setEditTour({})}>
            + Nuevo tour
          </button>
          <button className="btn btn--ghost btn--sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Tours table */}
      <main className="admin__main container">
        <h2>Tours ({tours.length})</h2>

        {loading ? (
          <p className="admin__loading">Cargando…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Precio</th>
                  <th>Duración</th>
                  <th>Dificultad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tours.map(tour => (
                  <tr key={tour.id} className={tour.activo ? '' : 'admin-table__row--inactive'}>
                    <td className="admin-table__id">#{tour.id}</td>
                    <td>
                      <img
                        src={tour.imagen_url}
                        alt={tour.titulo}
                        className="admin-table__thumb"
                      />
                    </td>
                    <td>
                      <strong>{tour.titulo}</strong>
                      {tour.badge && (
                        <span className="admin-badge">{tour.badge}</span>
                      )}
                    </td>
                    <td className="admin-table__price">${Number(tour.precio_desde).toFixed(0)}</td>
                    <td>{tour.duracion}</td>
                    <td>{tour.nivel_dificultad}</td>
                    <td>
                      <span className={`status-pill ${tour.activo ? 'status-pill--on' : 'status-pill--off'}`}>
                        {tour.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <button
                        className="btn btn--outline btn--sm"
                        onClick={() => setEditTour(tour)}
                      >
                        Editar
                      </button>
                      {tour.activo && (
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => setConfirm(tour)}
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Tour form modal */}
      {editTour !== null && (
        <TourForm
          initial={editTour?.id ? editTour : null}
          onSave={() => { setEditTour(null); fetchTours(); }}
          onCancel={() => setEditTour(null)}
        />
      )}

      {/* Confirm deactivate */}
      {confirmDel && (
        <div className="modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>¿Desactivar tour?</h2>
              <button className="icon-btn" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <div className="modal__body">
              <p>El tour <strong>{confirmDel.titulo}</strong> dejará de aparecer en el catálogo. Podrás reactivarlo editándolo.</p>
              <div style={{ display:'flex', gap:'1rem', justifyContent:'flex-end', marginTop:'1rem' }}>
                <button className="btn btn--ghost" onClick={() => setConfirm(null)}>Cancelar</button>
                <button className="btn btn--danger" onClick={() => handleDelete(confirmDel.id)}>Sí, desactivar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
