/**
 * validators.js
 * Funciones de validación reutilizables para formularios del cliente.
 * Cada validador devuelve `null` si el campo es válido, o un mensaje
 * de error en español si no lo es.
 */

export function validateNombre(value) {
  const v = (value || '').trim();
  if (!v) return 'El nombre es obligatorio.';
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  if (v.length > 100) return 'El nombre es demasiado largo.';
  if (!/^[a-zA-ZÀ-ÿñÑ\s'.-]+$/.test(v)) return 'El nombre solo puede contener letras y espacios.';
  return null;
}

export function validateEmail(value) {
  const v = (value || '').trim();
  if (!v) return 'El email es obligatorio.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(v)) return 'Ingresa un email válido (ej: nombre@correo.com).';
  if (v.length > 254) return 'El email es demasiado largo.';
  return null;
}

export function validateTelefono(value) {
  const v = (value || '').trim();
  if (!v) return 'El teléfono es obligatorio.';
  const digits = v.replace(/[^\d]/g, '');
  if (digits.length < 7)  return 'El teléfono es demasiado corto.';
  if (digits.length > 15) return 'El teléfono es demasiado largo.';
  if (!/^[\d\s+()-]+$/.test(v)) return 'El teléfono contiene caracteres no válidos.';
  return null;
}

export function validateNotas(value) {
  const v = (value || '').trim();
  if (v.length > 500) return 'Las notas no pueden superar los 500 caracteres.';
  return null;
}

export function validatePrecio(value) {
  const n = Number(value);
  if (value === '' || value === null || value === undefined) return 'El precio es obligatorio.';
  if (Number.isNaN(n)) return 'El precio debe ser un número.';
  if (n <= 0) return 'El precio debe ser mayor a 0.';
  if (n > 99999) return 'El precio parece demasiado alto, revísalo.';
  return null;
}

export function validateRequiredText(value, label, max = 255) {
  const v = (value || '').trim();
  if (!v) return `${label} es obligatorio.`;
  if (v.length > max) return `${label} no puede superar los ${max} caracteres.`;
  return null;
}

export function validateUrl(value, required = false) {
  const v = (value || '').trim();
  if (!v) return required ? 'La URL es obligatoria.' : null;
  try {
    new URL(v);
    return null;
  } catch {
    return 'Ingresa una URL válida (debe empezar con http:// o https://).';
  }
}

export function validateUsername(value) {
  const v = (value || '').trim();
  if (!v) return 'El usuario es obligatorio.';
  if (v.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
  return null;
}

export function validatePassword(value) {
  if (!value) return 'La contraseña es obligatoria.';
  if (value.length < 4) return 'La contraseña debe tener al menos 4 caracteres.';
  return null;
}

export function validateForm(values, validatorsMap) {
  const errors = {};
  let isValid = true;
  for (const field in validatorsMap) {
    const error = validatorsMap[field](values[field]);
    errors[field] = error;
    if (error) isValid = false;
  }
  return { errors, isValid };
}