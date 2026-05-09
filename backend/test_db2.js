const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.cvinpbkkcwfzksdjcznl:Logic@12404197@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query("SELECT DISTINCT exam_type FROM cutoffs WHERE college_id IN (SELECT id FROM colleges WHERE name ILIKE '%IIT%' OR name ILIKE '%Indian Institute of Technology%')"))
  .then(res => { 
    console.log('IIT Exams:', res.rows); 
    client.end(); 
  });
