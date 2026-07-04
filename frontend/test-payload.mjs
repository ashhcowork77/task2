import { getPayload } from 'payload';
import configPromise from '../payload.config';

async function test() {
  const payload = await getPayload({ config: configPromise });
  
  console.log('Fetching properties...');
  const result = await payload.find({
    collection: 'properties',
    limit: 5,
  });
  
  console.log('Total:', result.totalDocs);
  console.log('Docs:', result.docs.length);
  
  if (result.docs.length > 0) {
    console.log('First doc keys:', Object.keys(result.docs[0]));
    console.log('First doc:', JSON.stringify(result.docs[0], null, 2).slice(0, 500));
  }
}

test().catch(console.error);
