-- ============================================================
-- DESTINOS MÁGICOS — Schema + Seed
-- PostgreSQL 14+
-- ============================================================

-- Extensión para UUIDs (opcional, usamos SERIAL por simplicidad)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── TOURS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id                SERIAL PRIMARY KEY,
  titulo            VARCHAR(255)   NOT NULL,
  descripcion       TEXT           NOT NULL,
  detalle           TEXT,
  duracion          VARCHAR(100),
  tamano_grupo      VARCHAR(100),
  nivel_dificultad  VARCHAR(50),
  precio_desde      NUMERIC(10,2)  NOT NULL,
  badge             VARCHAR(100),
  alimentacion      VARCHAR(255),
  incluye           TEXT,          -- lista separada por comas
  imagen_url        TEXT,
  data_duration     VARCHAR(20)    CHECK (data_duration IN ('halfday','fullday','multiday')),
  activo            BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── ORDERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(255)   NOT NULL,
  email       VARCHAR(255)   NOT NULL,
  telefono    VARCHAR(50)    NOT NULL,
  notas       TEXT,
  total       NUMERIC(10,2)  NOT NULL,
  estado      VARCHAR(30)    NOT NULL DEFAULT 'pendiente'
              CHECK (estado IN ('pendiente','confirmado','cancelado')),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── ORDER ITEMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER        NOT NULL REFERENCES orders(id)  ON DELETE CASCADE,
  tour_id     INTEGER        NOT NULL REFERENCES tours(id)   ON DELETE RESTRICT,
  adultos     SMALLINT       NOT NULL DEFAULT 1 CHECK (adultos  >= 0),
  ninos       SMALLINT       NOT NULL DEFAULT 0 CHECK (ninos   >= 0),
  precio_unit NUMERIC(10,2)  NOT NULL   -- snapshot del precio al momento de la compra
);

-- ── ADMIN USERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── TRIGGER: updated_at en tours ─────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tours_updated_at ON tours;
CREATE TRIGGER trg_tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── ÍNDICES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tours_data_duration  ON tours(data_duration);
CREATE INDEX IF NOT EXISTS idx_tours_precio_desde   ON tours(precio_desde);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tour_id  ON order_items(tour_id);

-- ============================================================
-- SEED — 9 tours reales migrados de ALL_TOURS_DATA
-- ============================================================
INSERT INTO tours
  (id, titulo, descripcion, detalle, duracion, tamano_grupo,
   nivel_dificultad, precio_desde, badge, alimentacion,
   incluye, imagen_url, data_duration)
VALUES
(1,
 'Machu Picchu Clásico',
 'Visita la ciudadela inca más famosa del mundo. Incluye tren de ida y vuelta, bus panorámico y entrada al sitio arqueológico con guía certificado.',
 'Salida desde Cusco en tren Expedition. Llegada a Aguas Calientes, subida en bus panorámico hasta la ciudadela. Recorrido de 2 horas con guía. Tiempo libre para fotos. Regreso por la tarde.',
 'Día completo (12h)', 'Grupos de 2-12', 'Moderado',
 180.00, 'Más Popular', 'Almuerzo incluido',
 'Tren ida y vuelta,Bus panorámico,Entrada sitio arqueológico,Guía certificado',
 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop',
 'fullday'),

(2,
 'Montaña Arcoíris (Vinicunca)',
 'Trek a la impresionante Montaña de los 7 Colores a 5,200 msnm. Una experiencia única entre paisajes andinos de colores vibrantes.',
 'Traslado desde Cusco a las 4:30am. Desayuno en ruta. Trek de 7 km ida y vuelta a Vinicunca. Llegada a la cima con vistas 360°. Almuerzo típico andino. Regreso a Cusco.',
 'Día completo (14h)', 'Grupos de 4-16', 'Difícil',
 55.00, 'Tendencia', 'Almuerzo incluido',
 'Transporte,Desayuno,Almuerzo,Guía,Caballos opcionales',
 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/e9/1a/cb.jpg',
 'fullday'),

(3,
 'Valle Sagrado Completo',
 'Recorre Pisac, Ollantaytambo y Chinchero en un día épico por el Valle de los Incas. Mercado artesanal, ruinas y paisajes de ensueño.',
 'Visita al mercado artesanal de Pisac. Ruinas de Pisac con vistas panorámicas. Almuerzo en restaurante local. Fortaleza de Ollantaytambo. Telares y hornos coloniales en Chinchero.',
 'Día completo (10h)', 'Grupos de 2-14', 'Fácil',
 45.00, NULL, 'Almuerzo incluido',
 'Transporte,Almuerzo,Guía,Entradas a ruinas',
 'https://www.boletomachupicchu.com/gutblt/wp-content/uploads/2018/03/valle-sagrado-tips-viaje.jpg',
 'fullday'),

(4,
 'City Tour Cusco + 4 Ruinas',
 'Descubre el corazón del Imperio Inca: Sacsayhuamán, Qenqo, Puca Pucara, Tambomachay y el centro histórico colonial de Cusco.',
 'Recorrido por la Plaza de Armas, Catedral y Qorikancha. Visita a las 4 ruinas del entorno de Cusco con guía bilingüe. Incluye transporte en bus turístico.',
 'Medio día (4 horas)', 'Grupos de 2-20', 'Fácil',
 30.00, NULL, NULL,
 'Bus turístico,Guía bilingüe,Entradas a ruinas',
 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/60/32/e0/20171102-080128-largejpg.jpg?w=900&h=500&s=1',
 'halfday'),

(5,
 'Laguna Humantay',
 'Trek a la laguna turquesa a los pies del nevado Humantay a 4,200 msnm. Agua cristalina de color esmeralda rodeada de montañas nevadas.',
 'Salida a las 4:00am desde Cusco. Desayuno en Soraypampa. Trek de 4 km hasta la laguna (2h aprox). Ritual de ofrenda a la Pachamama. Almuerzo buffet. Regreso.',
 'Día completo (12h)', 'Grupos de 4-14', 'Moderado',
 50.00, 'Imperdible', 'Almuerzo incluido',
 'Transporte,Desayuno,Almuerzo buffet,Guía,Entrada al santuario',
 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/ac/07/7b.jpg',
 'fullday'),

(6,
 'Camino Inca Corto 2 Días',
 'La versión corta del legendario Camino Inca. Camina los últimos 12 km de la ruta ancestral y llega a Machu Picchu al amanecer por la Puerta del Sol.',
 'Día 1: Traslado al km 104, inicio del trek, campamento. Día 2: Madrugada hacia la Puerta del Sol, entrada al sol a Machu Picchu, recorrido guiado, regreso en tren.',
 '2 días / 1 noche', 'Grupos de 2-12', 'Difícil',
 350.00, 'Experiencia Única', 'Todas las comidas incluidas',
 'Tren,Carpa y sleeping,Comidas,Guía,Cocinero,Porteadores,Entrada Machu Picchu',
 'https://www.peru.travel/Contenido/General/Imagen/es/317/1.1/Qhapaq.jpg',
 'multiday'),

(7,
 'Maras, Moray y Salineras',
 'Visita los círculos agrícolas circulares de Moray, las terrazas de sal de Maras y el pueblo colonial de Chinchero en un tour fuera de lo común.',
 'Salida matutina hacia Chinchero. Visita a las salineras de Maras (más de 3,000 pozas). Circular de Moray — laboratorio agrícola inca. Regreso por rutas panorámicas.',
 'Medio día (4 horas)', 'Grupos de 2-16', 'Fácil',
 35.00, NULL, NULL,
 'Transporte,Guía,Entradas a Moray y Salineras',
 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop',
 'halfday'),

(8,
 'Tour Lago Titicaca 3 Días',
 'Viaja al lago navegable más alto del mundo. Visita las islas flotantes de los Uros, Taquile y Amantaní con estadía en familia local.',
 'Día 1: Viaje Cusco-Puno en tren panorámico, llegada. Día 2: Navegación a islas flotantes Uros y Taquile, noche en Amantaní. Día 3: Regreso a Puno, traslado a Cusco o aeropuerto.',
 '3 días / 2 noches', 'Grupos de 4-16', 'Fácil',
 280.00, 'Multi-destino', 'Desayunos y almuerzos incluidos',
 'Tren panorámico,Alojamiento,Barco en lago,Guía,Entradas,Desayunos y almuerzos',
 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&h=600&fit=crop',
 'multiday'),

(9,
 'Aventura Palccoyo (Arcoíris Alternativa)',
 'La montaña de colores sin multitudes. Palccoyo ofrece 3 montañas de colores, bosque de piedras y llamas en libertad. Trek corto y accesible.',
 'Salida a las 6:00am. Trek fácil de 3 km. Vistas de 3 montañas de colores distintos. Bosque de piedras Qaqayoc. Abundante vida silvestre andina. Almuerzo típico cusqueño.',
 'Día completo (10h)', 'Grupos de 2-16', 'Moderado',
 40.00, NULL, 'Almuerzo incluido',
 'Transporte,Almuerzo,Guía,Entrada al sitio',
 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
 'fullday')
ON CONFLICT (id) DO NOTHING;

-- Resetear la secuencia al valor correcto después del seed
SELECT setval('tours_id_seq', (SELECT MAX(id) FROM tours));
