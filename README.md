# ✦ Destinos Mágicos — Monorepo

Agencia de turismo en Cusco, Perú. Arquitectura cliente-servidor con React + Vite (cliente) y Node.js + Express + PostgreSQL (servidor).

```
destinos-magicos/
├── client/          React + Vite
│   ├── src/
│   │   ├── components/   Navbar, Hero, About, Packages, Cart, Modals…
│   │   ├── context/      LangContext, CartContext
│   │   ├── services/     api.js (capa HTTP)
│   │   ├── styles/       index.css
│   │   ├── i18n.js       Traducciones ES / EN / PT
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/          Node.js + Express + PostgreSQL
    ├── controllers/  toursController, ordersController, authController
    ├── routes/       tours.js, orders.js, auth.js
    ├── middleware/   auth.js (JWT)
    ├── db/
    │   ├── pool.js        Conexión pg
    │   ├── schema.sql     Tablas + seed de 9 tours
    │   └── seedAdmin.js   Crea usuario admin
    ├── index.js
    └── package.json
```

---

## 1. Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ |

---

## 2. Base de datos

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE destinos_magicos;"

# Crear tablas + seed de los 9 tours
psql -U postgres -d destinos_magicos -f server/db/schema.sql
```

---

## 3. Servidor (Node + Express)

```bash
cd server
npm install

# Copiar y editar variables de entorno
cp .env.example .env
# → Editar .env con tu DATABASE_URL, JWT_SECRET, WHATSAPP_NUMBER, etc.

# Crear usuario admin (solo la primera vez)
npm run db:seed-admin

# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor corre en **http://localhost:4000**

### Variables de entorno (`server/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgres://user:pass@localhost:5432/destinos_magicos` |
| `JWT_SECRET` | Secreto para firmar JWT (largo y aleatorio) | `s3cr3t0_l4rg0_y_4l3at0r10` |
| `JWT_EXPIRES_IN` | Duración del token | `8h` |
| `PORT` | Puerto del servidor | `4000` |
| `CLIENT_URL` | URL del frontend (para CORS) | `http://localhost:5173` |
| `WHATSAPP_NUMBER` | Número WhatsApp con código de país | `51999999999` |
| `ADMIN_USERNAME` | Username del admin (para seed) | `admin` |
| `ADMIN_PASSWORD` | Password del admin (para seed) | `MiPasswordSeguro!` |

---

## 4. Cliente (React + Vite)

```bash
cd client
npm install

# (Opcional) copiar .env
cp .env.example .env

# Desarrollo
npm run dev

# Build para producción
npm run build
npm run preview
```

El cliente corre en **http://localhost:5173**

> El proxy de Vite redirige `/api/*` → `http://localhost:4000` automáticamente en desarrollo.

---

## 5. Endpoints de la API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/tours` | ✗ | Lista tours (`?sort=asc\|desc`, `?duration=halfday\|fullday\|multiday`) |
| GET | `/api/tours/:id` | ✗ | Detalle de un tour |
| POST | `/api/tours` | ✓ JWT | Crear tour |
| PUT | `/api/tours/:id` | ✓ JWT | Editar tour |
| DELETE | `/api/tours/:id` | ✓ JWT | Desactivar tour (soft-delete) |
| POST | `/api/orders` | ✗ | Crear pedido → devuelve `order_id`, `total`, `whatsapp_url` |
| GET | `/api/orders/:id` | ✓ JWT | Ver pedido con items |
| POST | `/api/auth/login` | ✗ | Login admin → devuelve JWT |
| GET | `/api/health` | ✗ | Health check |

### Ejemplo: crear pedido

```json
POST /api/orders
{
  "nombre": "Ana Rodríguez",
  "email": "ana@ejemplo.com",
  "telefono": "+51 987 654 321",
  "notas": "Somos 2 adultos y 1 niño",
  "items": [
    { "tour_id": 1, "adultos": 2, "ninos": 1 },
    { "tour_id": 5, "adultos": 2, "ninos": 0 }
  ]
}
```

> ⚠️ El servidor **recalcula el total** a partir del precio en la BD. El cliente nunca envía precios.

---

## 6. Panel de administración

Para gestionar tours vía API usa cualquier cliente HTTP (Postman, Insomnia, curl):

```bash
# 1. Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"TuPassword"}'

# 2. Usar el token en las rutas protegidas
curl http://localhost:4000/api/orders/1 \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 7. Funcionalidades incluidas

- ✅ Catálogo de 9 tours desde PostgreSQL con filtros de precio y duración
- ✅ Carrito persistente en localStorage (adultos + niños por tour)
- ✅ Checkout que guarda el pedido en BD y redirige a WhatsApp
- ✅ Total recalculado en servidor (seguro)
- ✅ Modales de detalle de tour, checkout, términos, privacidad y FAQ
- ✅ Carrusel en sección "Nosotros"
- ✅ Galería con lightbox
- ✅ Sección de actividades adicionales
- ✅ Selector de idioma ES / EN / PT
- ✅ Navbar fija con scroll detection
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Autenticación JWT para rutas de admin
- ✅ Soft-delete en tours

---

## 8. Para producción

1. Cambiar `NODE_ENV=production` y `DATABASE_URL` en el servidor.
2. En el cliente, hacer `npm run build` y servir `/dist` con Nginx o similar.
3. Actualizar `CLIENT_URL` en el servidor con el dominio real.
4. Cambiar `WHATSAPP_NUMBER` con el número de la agencia.
5. Generar un `JWT_SECRET` verdaderamente aleatorio (`openssl rand -hex 64`).
