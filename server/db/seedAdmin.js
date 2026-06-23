/**
 * Crea un usuario administrador por defecto.
 * Ejecutar UNA SOLA VEZ: npm run db:seed-admin
 * Las credenciales por defecto se pueden sobreescribir con variables de entorno.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./pool');

const USERNAME = process.env.ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'DestinosMagicos2024!';

(async () => {
  try {
    const hash = await bcrypt.hash(PASSWORD, 12);
    await pool.query(
      `INSERT INTO admin_users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [USERNAME, hash]
    );
    console.log(`✅ Admin creado/actualizado: ${USERNAME}`);
    console.log('⚠️  Cambia la contraseña antes de ir a producción.');
  } catch (err) {
    console.error('❌ Error al crear admin:', err.message);
  } finally {
    await pool.end();
  }
})();
