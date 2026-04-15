// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'portfolio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// ✅ connexion seulement
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connecté');
    client.release();
  } catch (error) {
    console.error('❌ Erreur DB:', error.message);
    process.exit(1);
  }
};

// ✅ requêtes
const query = (text, params) => pool.query(text, params);

// ✅ Exportez aussi le pool
module.exports = { connectDB, query, pool };