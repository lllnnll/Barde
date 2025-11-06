const { Pool } = require('pg');

// URL de connexion fournie par Render
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // nécessaire pour Render
  }
});

module.exports = pool;
