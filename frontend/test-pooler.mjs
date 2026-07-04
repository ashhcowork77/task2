import pg from 'pg';
const { Client } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL before running this script.');
}

const pooler = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  console.log('Testing pooler connection...');
  try {
    await pooler.connect();
    const r = await pooler.query('SELECT id, title FROM properties LIMIT 3');
    console.log('Pooler: Found', r.rows.length, 'properties');
    r.rows.forEach(row => console.log('  -', row.title));
    await pooler.end();
  } catch (e) {
    console.log('Pooler failed:', e.message);
  }
}

test().catch(console.error);
