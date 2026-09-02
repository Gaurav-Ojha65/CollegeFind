// FILE: backend/src/config/db.js
const { Pool } = require('pg');
const { createInMemoryDb } = require('./inMemoryDb');

let activePool = null;
let inMemoryPromise = null;
let isConnectedToPostgres = false;

const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 3000,
});

pgPool.on('error', (err) => {
  console.warn('⚠️ PostgreSQL pool error:', err.message);
});

async function getInMemoryPool() {
  if (!inMemoryPromise) {
    inMemoryPromise = createInMemoryDb();
  }
  return inMemoryPromise;
}

// Initial connection check
pgPool.query('SELECT NOW()')
  .then((res) => {
    isConnectedToPostgres = true;
    activePool = pgPool;
    console.log('✅ Connected to external PostgreSQL database:', res.rows[0]);
  })
  .catch(async (err) => {
    console.warn(`⚠️ External DB unavailable (${err.message}). Using high-performance in-memory database with full 30-college dataset.`);
    activePool = await getInMemoryPool();
  });

const dbWrapper = {
  async query(sqlText, values = []) {
    if (activePool) {
      try {
        return await activePool.query(sqlText, values);
      } catch (err) {
        if (!isConnectedToPostgres) {
          throw err;
        }
        console.warn('PostgreSQL query error, switching to in-memory fallback:', err.message);
        activePool = await getInMemoryPool();
        return await activePool.query(sqlText, values);
      }
    }

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('PG query timeout')), 2000));
      const res = await Promise.race([pgPool.query(sqlText, values), timeoutPromise]);
      isConnectedToPostgres = true;
      activePool = pgPool;
      return res;
    } catch (err) {
      console.warn(`⚠️ Switching to in-memory database (${err.message})`);
      activePool = await getInMemoryPool();
      return await activePool.query(sqlText, values);
    }
  },
  async connect() {
    if (activePool && activePool.connect) {
      return activePool.connect();
    }
    const mem = await getInMemoryPool();
    return {
      query: (t, v) => mem.query(t, v),
      release: () => {}
    };
  },
  async end() {
    if (pgPool) await pgPool.end().catch(() => {});
  },
  on() {}
};

module.exports = dbWrapper;