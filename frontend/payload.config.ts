import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { collections } from './payload-src/collections';

// Payload config for Vercel deployment
export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: 'Not Just A Stay - Admin',
    },
  },
  db: postgresAdapter({
    push: true,
    migrationDir: './migrations',
    pool: {
      max: 10,
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: collections,
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-in-production',
});
