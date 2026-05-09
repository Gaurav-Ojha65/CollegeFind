const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.cvinpbkkcwfzksdjcznl:Logic@12404197@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query(`
    UPDATE cutoffs 
    SET exam_type = 'WBJEE' 
    WHERE college_id IN (SELECT id FROM colleges WHERE name ILIKE '%Jadavpur%');
  `))
  .then(() => client.query(`
    UPDATE colleges
    SET fees = 195000
    WHERE name ILIKE '%IIT%' OR name ILIKE '%Indian Institute of Technology%';
  `))
  .then(() => {
    console.log('Database updated successfully.');
    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });
