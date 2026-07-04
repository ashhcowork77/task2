import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  await client.connect();
  const result = await client.query('SELECT id, title, slug FROM properties');
  console.log('Properties:');
  result.rows.forEach(r => console.log(`  ${r.id}: "${r.title}" - slug: ${r.slug || 'MISSING'}`));
  await client.end();
}

check().catch(console.error);
