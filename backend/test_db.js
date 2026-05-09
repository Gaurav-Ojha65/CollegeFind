const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres.cvinpbkkcwfzksdjcznl:Logic@12404197@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect()
  .then(() => client.query("SELECT name, fees FROM colleges WHERE name ILIKE '%IIT%' OR name ILIKE '%Indian Institute of Technology%'"))
  .then(res => { 
    console.log('IITs:', res.rows); 
    return client.query("SELECT DISTINCT exam_type FROM cutoffs WHERE college_id = (SELECT id FROM colleges WHERE name ILIKE '%Jadavpur%' LIMIT 1)"); 
  })
  .then(res => { 
    console.log('Jadavpur Exams:', res.rows); 
    return client.query("SELECT COUNT(*) FROM colleges");
  })
  .then(res => {
    console.log('Total Colleges:', res.rows[0].count);
    client.end(); 
  });
