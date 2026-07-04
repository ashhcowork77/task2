import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addSlugs() {
  await client.connect();
  
  // Check if slug column exists
  const columns = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'slug'
  `);
  
  if (columns.rows.length === 0) {
    console.log('Adding slug column...');
    await client.query('ALTER TABLE properties ADD COLUMN slug TEXT');
    console.log('Column added');
  }
  
  // Get all properties
  const properties = await client.query('SELECT id, title FROM properties');
  console.log('Properties:', properties.rows.length);
  
  // Update each with a slug
  for (const prop of properties.rows) {
    const slug = prop.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    await client.query('UPDATE properties SET slug = $1 WHERE id = $2', [slug, prop.id]);
    console.log(`  ${prop.id}: "${prop.title}" -> "${slug}"`);
  }
  
  await client.end();
  console.log('Done!');
}

addSlugs().catch(console.error);
