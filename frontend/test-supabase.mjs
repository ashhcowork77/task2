import pg from 'pg';
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL before running this script.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});

async function test() {
  try {
    console.log('Testing Supabase connection...');
    const client = await pool.connect();
    console.log('✓ Connected!');
    
    const result = await client.query('SELECT 1 as test, now()');
    console.log('✓ Query:', result.rows[0]);
    
    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 10
    `);
    console.log('Tables:', tables.rows.length === 0 ? 'EMPTY' : tables.rows.map(r => r.table_name).join(', '));
    
    client.release();
    await pool.end();
    console.log('\n=== SUCCESS ===');
    console.log('Database works! Ready to switch.');
    process.exit(0);
  } catch (err) {
    console.error('\n=== FAILED ===');
    console.error(err.message);
    await pool.end();
    process.exit(1);
  }
}

test();
