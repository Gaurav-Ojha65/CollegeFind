require('dotenv').config();
const pool = require('./src/config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Adding website_url column to colleges table...');
    await client.query(`ALTER TABLE colleges ADD COLUMN IF NOT EXISTS website_url VARCHAR(255) DEFAULT 'https://example.edu';`);
    
    // Add some realistic URLs for top ones
    console.log('Updating specific URLs...');
    await client.query(`UPDATE colleges SET website_url = 'https://home.iitd.ac.in/' WHERE name ILIKE '%Delhi%' AND name ILIKE '%Institute of Technology%';`);
    await client.query(`UPDATE colleges SET website_url = 'https://www.iitb.ac.in/' WHERE name ILIKE '%Bombay%';`);
    await client.query(`UPDATE colleges SET website_url = 'https://www.iitm.ac.in/' WHERE name ILIKE '%Madras%';`);
    await client.query(`UPDATE colleges SET website_url = 'https://www.nitw.ac.in/' WHERE name ILIKE '%Warangal%';`);
    await client.query(`UPDATE colleges SET website_url = 'https://vit.ac.in/' WHERE name ILIKE '%Vellore%';`);
    
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
