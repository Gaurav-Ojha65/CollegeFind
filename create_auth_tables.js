require('dotenv').config({ path: './backend/.env' });
const pool = require('./backend/src/config/db');

async function createTables() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saved_colleges (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, college_id)
    );
  `;
  try {
    await pool.query(query);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    pool.end();
  }
}

createTables();
