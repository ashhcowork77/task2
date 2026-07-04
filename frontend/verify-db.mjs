import pg from 'pg';

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('Set DATABASE_URL before running this script.');
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  console.log('Testing DATABASE_URL connection...');

  try {
    await client.connect();
    const result = await client.query('SELECT id, title FROM properties LIMIT 3');
    console.log('Found', result.rows.length, 'properties');
    result.rows.forEach((row) => console.log('  -', row.title));
  } finally {
    await client.end();
  }
}

test().catch((error) => {
  console.error('Database verification failed:', error.message);
  process.exit(1);
});
