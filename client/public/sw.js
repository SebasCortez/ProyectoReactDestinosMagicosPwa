// ============================================================
// SERVICE WORKER — Destinos Mágicos PWA
// Estrategia híbrida:
//   · Cache-First  → assets estáticos (shell, imágenes, fuentes)
//   · Network-First → /api/* (tours, pedidos, auth)
//   · Offline fallback → offline.html
// ============================================================

const STATIC_CACHE  = 'shell-static-v1';
const IMAGES_CACHE  = 'shell-images-v1';
const ALL_CACHES    = [STATIC_CACHE, IMAGES_CACHE];

// Recursos del App Shell que se precachean en el install
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── INSTALL: precachear App Shell ─────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Install — precacheando App Shell');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())  // activa el nuevo SW de inmediato
  );
});

// ── ACTIVATE: limpiar caches viejos ──────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activate — limpiando caches antiguos');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !ALL_CACHES.includes(key))
          .map(key => {
            console.log('[SW] Eliminando cache obsoleto:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())  // toma control de todas las pestañas abiertas
  );
});

// ── FETCH: interceptar peticiones ────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Ignorar peticiones que no son GET (POST /api/orders, etc.)
  if (request.method !== 'GET') return;

  // 2. Ignorar extensiones de desarrollo de Vite
  if (url.pathname.startsWith('/@') || url.pathname.includes('hot-update')) return;

  // 3. API → Network-First con fallback a offline.html
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // 4. Imágenes externas (Unsplash, TripAdvisor) → Stale-While-Revalidate
  if (
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('tripadvisor.com') ||
    url.hostname.includes('boletomachupicchu.com') ||
    url.hostname.includes('peru.travel')
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGES_CACHE));
    return;
  }

  // 5. Todo lo demás (shell, CSS, JS, fuentes) → Cache-First
  event.respondWith(cacheFirst(request));
});

// ── Estrategias ───────────────────────────────────────────────

/**
 * Cache-First: sirve desde caché; si no existe, descarga y guarda.
 * Uso: assets estáticos (HTML, CSS, JS compilado, fuentes, íconos).
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Si es navegación (HTML), devolver página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return new Response('Sin conexión', { status: 503 });
  }
}

/**
 * Network-First: intenta red; si falla, muestra offline.html.
 * Uso: /api/* — datos que deben estar siempre actualizados.
 */
async function networkFirstAPI(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    // Para peticiones de navegación → offline.html
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    // Para peticiones API → JSON de error amigable
    return new Response(
      JSON.stringify({ error: 'Sin conexión. Verifica tu internet e intenta de nuevo.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Stale-While-Revalidate: sirve caché inmediatamente y actualiza en segundo plano.
 * Uso: imágenes de tours (no críticas, pueden ser ligeramente desactualizadas).
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Actualizar en segundo plano sin bloquear
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}
