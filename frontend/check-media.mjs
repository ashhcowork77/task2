import pg from 'pg';
const { Client } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL before running this script.');
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  await client.connect();
  const result = await client.query('SELECT id, url, alt, filename FROM media');
  console.log('Media entries:');
  result.rows.forEach(r => console.log(`  ${r.id}: ${r.url} (${r.filename})`));
  await client.end();
}

check().catch(console.error);
