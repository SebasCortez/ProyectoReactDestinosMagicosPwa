const BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('dm_admin_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

// ── Tours ─────────────────────────────────────────────────────
export const toursApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/tours${qs ? '?' + qs : ''}`);
  },
  get:    (id)   => request(`/tours/${id}`),
  create: (body) => request('/tours', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/tours/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id)   => request(`/tours/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────
export const ordersApi = {
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  get:    (id)   => request(`/orders/${id}`),
};

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};
