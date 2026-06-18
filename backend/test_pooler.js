const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eyzttndowhpsbfdmchdp:q7%2Ca3S2GrwmwvuQ@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log("Connected to Supabase Connection Pooler!");

  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      nama_lengkap VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL,
      is_active SMALLINT DEFAULT 1,
      foto_profile VARCHAR(255) DEFAULT '/uploads/placeholder.jpg'
    )`,
    `CREATE TABLE IF NOT EXISTS absensi (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      username VARCHAR(50) NOT NULL,
      nama_lengkap VARCHAR(100) NOT NULL,
      waktu_absen TIMESTAMP NOT NULL,
      foto_url VARCHAR(255) NOT NULL,
      latitude DECIMAL(10, 8) NULL,
      longitude DECIMAL(11, 8) NULL,
      status VARCHAR(20) NOT NULL,
      diubah_oleh_admin SMALLINT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS qr_token (
      id VARCHAR(50) PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL,
      is_active SMALLINT DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS settings (
      key_name VARCHAR(50) PRIMARY KEY,
      key_value VARCHAR(255) NOT NULL
    )`,
    `INSERT INTO users (id, username, password, nama_lengkap, role, is_active, foto_profile) VALUES
     ('usr-admin', 'admin', 'admin', 'Administrator', 'admin', 1, '/uploads/placeholder.jpg'),
     ('usr-ghani', 'ghani', 'ghani', 'Muhammad Yusar Ghani', 'user', 1, '/uploads/placeholder.jpg')
     ON CONFLICT (id) DO NOTHING`
  ];

  for (const q of queries) {
    try {
      console.log("Running query:", q.slice(0, 50) + "...");
      await client.query(q);
      console.log("Success!");
    } catch (err) {
      console.error("FAILED query:", err.message);
    }
  }

  await client.end();
}

main().catch(err => {
  console.error("Main error:", err);
});
