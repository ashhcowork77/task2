import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  await client.connect();
  
  console.log('Checking properties table...');
  const result = await client.query('SELECT id, title, slug FROM properties');
  console.log('Found:', result.rows.length, 'properties');
  result.rows.forEach(r => console.log(`  - ${r.id}: "${r.title}" (slug: ${r.slug})`));
  
  await client.end();
}

test().catch(console.error);
