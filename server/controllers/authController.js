const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');

// POST /api/auth/login
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1',
      [username]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de autenticación' });
  }
}

module.exports = { login };
