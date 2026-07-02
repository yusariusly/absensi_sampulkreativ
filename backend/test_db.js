const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/absensi_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function main() {
  try {
    const res = await pgPool.query("SELECT id, username, role, password, nama_lengkap FROM users");
    console.log("Users in DB:", res.rows);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await pgPool.end();
  }
}

main();
