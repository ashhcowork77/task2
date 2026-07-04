# Codex Work Summary

This file summarizes the Payload CMS, Vercel, and Supabase debugging work completed during this session. It covers the changes made, the problems encountered, and how each problem was resolved.

## Starting Situation

The project was failing in production on Vercel when trying to load the Payload admin backend. The visible errors changed over time:

- `Application error: a server-side exception has occurred`
- Digest-style Next.js server errors
- `This page couldn't load`
- A later state where the admin loaded, but the styling was broken
- A final state where the admin worked, but the collections were empty

The database had been moved from Neon to Supabase, but the same production error initially continued.

## Main Changes Made

### 1. Payload And Next Runtime Alignment

Updated the frontend runtime so Payload admin could run correctly on Vercel.

Files changed:

- `frontend/package.json`
- `package.json`
- `frontend/next.config.mjs`

Changes included:

- Aligned Next, React, and ReactDOM versions:
  - `next`: `16.2.6`
  - `react`: `19.2.6`
  - `react-dom`: `19.2.6`
- Updated frontend scripts to use webpack:
  - `next dev --webpack`
  - `next build --webpack`
- Set root Node engine to `>=20.9.0`
- Wrapped Next config with Payload:
  - `withPayload(nextConfig)`
- Added Payload package transpilation:
  - `@payloadcms/next`
  - `@payloadcms/ui`

Commit:

- `007a03d fix: align Payload admin runtime for Vercel`

### 2. Payload API Routes Added

Added the missing Payload API route handlers required for Payload's REST, GraphQL, and GraphQL Playground endpoints.

Files added:

- `frontend/src/app/api/[...slug]/route.ts`
- `frontend/src/app/api/graphql/route.ts`
- `frontend/src/app/api/graphql-playground/route.ts`

Why this mattered:

Payload admin needs its API routes available in the Next app. Without these, the admin shell can fail or partially load while server requests break.

Commit:

- Included in `007a03d fix: align Payload admin runtime for Vercel`

### 3. Payload Config Updated For Postgres Pooling

Updated the Payload Postgres adapter configuration so it uses the deployed `DATABASE_URL` through a proper pool.

File changed:

- `frontend/payload.config.ts`

Important behavior:

- Payload now reads `process.env.DATABASE_URL`
- The Postgres adapter uses a pool configuration suitable for production
- `push: true` remains enabled so Payload can create/update its schema

### 4. Supabase Connection Switched To Session Pooler

The direct Supabase database URL was not suitable for the Vercel environment because the direct host was not IPv4 compatible.

Problem:

- Vercel could not reliably resolve/connect to:
  - `db.rpdtgvlmkatryubvlzqu.supabase.co`
- The logs showed DNS/connectivity errors, including `getaddrinfo` failures.

Fix:

- Switched the production `DATABASE_URL` to the Supabase Session Pooler URL:
  - Host: `aws-1-ap-northeast-1.pooler.supabase.com`
  - Port: `5432`
  - Database: `postgres`
  - User: `postgres.rpdtgvlmkatryubvlzqu`

Security note:

- The database password is intentionally not written into this file.

Why session pooler:

- Supabase's docs recommend the pooler when the environment is on an IPv4 network and the direct database connection is not IPv4 compatible.
- Vercel serverless deployments are a better match for pooled database connections than long-lived direct connections.

### 5. Hardcoded Supabase Credentials Removed

Removed hardcoded Supabase credentials from the local test script.

File changed:

- `frontend/test-supabase.mjs`

Commit:

- `d74b843 chore: remove hardcoded Supabase credentials`

Why this mattered:

- Credentials should not live in source files.
- Vercel and local scripts should read secrets from environment variables.

### 6. Payload Admin Root Layout Fixed

The admin later loaded into a new server-side error caused by a missing Payload root provider/layout.

Observed problem:

- Local production reproduction showed a Payload UI crash similar to:
  - `TypeError: Cannot destructure property 'config' ... as it is undefined`
- The error came from Payload UI expecting its root context/provider to exist.

Fix:

- Split the app into route groups:
  - `frontend/src/app/(frontend)/...`
  - `frontend/src/app/(payload)/admin/[[...segments]]/...`
- Added a dedicated Payload layout:
  - `frontend/src/app/(payload)/layout.tsx`
- Used Payload's `RootLayout`
- Wired `handleServerFunctions`
- Passed Payload config and import map into the Payload layout

Commit:

- `3908b6c fix: add Payload admin root layout`

Why this worked:

Payload admin needs its own app layout context. The normal frontend layout was not enough for Payload's internal UI providers.

### 7. Payload Admin CSS Fixed

Once the admin loaded, the styling was broken.

Observed problem:

- Payload admin UI loaded with missing or broken styles.
- Production CSS chunks were too small and did not contain expected Payload admin selectors.

Fix:

- Imported Payload's admin CSS in the Payload route-group layout:
  - `import '@payloadcms/next/css';`

File changed:

- `frontend/src/app/(payload)/layout.tsx`

Verification:

- Local build produced the larger Payload CSS output.
- Production admin CSS included expected Payload selectors and theme variables.

Commit:

- `03cd951 fix: include Payload admin stylesheet`

### 8. Empty Collections Seeded

After the admin worked, the collections were empty:

- Users
- Properties
- Leads
- Media
- Accounts
- Activities
- Poi Caches

Root cause:

- Supabase was a fresh database with Payload schema but no documents.
- The public frontend was still using hardcoded demo data in:
  - `frontend/src/lib/data/properties.ts`
  - `frontend/src/lib/data/activities.ts`
- Payload admin was reading Supabase, so it correctly showed empty collections.

Fix:

- Added a reusable seed script:
  - `frontend/scripts/seed-demo-content.mjs`
- Seeded Supabase with starter content:
  - 1 account
  - 4 properties
  - 2 activities
  - 1 lead
  - 6 media records

Commit:

- `bad99ba chore: add Payload demo seed script`

Final seed result:

```text
accounts:   1
properties: 4
activities: 2
leads:      1
media:      6
```

## Problems Faced And How They Were Solved

### Problem 1: Same Error After Moving From Neon To Supabase

What happened:

- The app still showed a server-side production error after moving from Neon to Supabase.

Why it happened:

- The database provider changed, but the connection method still was not correct for Vercel.
- Supabase direct database connections can be IPv6-only unless an IPv4 add-on is purchased.

How it was solved:

- Checked Supabase's connection documentation.
- Identified that Vercel needed the Supabase Session Pooler.
- Updated Vercel's `DATABASE_URL` to use the pooler host instead of the direct database host.

### Problem 2: Direct Supabase Host Was Not Vercel-Friendly

What happened:

- The direct connection string used:
  - `db.rpdtgvlmkatryubvlzqu.supabase.co`

Why it failed:

- The Supabase UI warned it was not IPv4 compatible.
- Vercel needed an IPv4-compatible connection path.

How it was solved:

- Used the Supabase Session Pooler connection:
  - `aws-1-ap-northeast-1.pooler.supabase.com`

### Problem 3: Payload Admin Server Error

What happened:

- After the database connection was fixed, Payload admin still crashed.

Why it happened:

- Payload's admin UI was missing the expected root layout/provider.
- Next route grouping was not set up cleanly for Payload admin.

How it was solved:

- Added a dedicated `(payload)` route group.
- Added `frontend/src/app/(payload)/layout.tsx`.
- Wrapped the admin route with Payload's `RootLayout`.
- Wired server functions through `handleServerFunctions`.

### Problem 4: Admin Loaded But Styling Was Broken

What happened:

- The Payload admin started loading, but looked unstyled or visually broken.

Why it happened:

- Payload admin CSS was not imported into the admin route group.

How it was solved:

- Added:

```ts
import '@payloadcms/next/css';
```

to:

```text
frontend/src/app/(payload)/layout.tsx
```

### Problem 5: Collections Were Empty

What happened:

- Payload admin worked, but all collections appeared empty.

Why it happened:

- Supabase had schema only, no documents.
- The visible public site content came from hardcoded demo arrays, not Payload.

How it was solved:

- Seeded the Supabase database directly with starter Payload records.
- Added a reusable seed script for future re-runs.

### Problem 6: Payload Local API Seed Attempt Was Fragile

What happened:

- An initial attempt was made to seed through Payload's local API and CLI.
- That path ran into import/runtime issues with the Payload CLI, TypeScript, and Next environment loading.

Why it happened:

- Payload's local API depends on a correctly loaded Payload/Next runtime environment.
- Running it directly from a script outside the normal app runtime caused module-resolution and environment-loader friction.

How it was solved:

- Abandoned the fragile CLI seeding path.
- Reverted the temporary import changes made for that experiment.
- Replaced it with a plain `pg` Postgres seed script that writes directly into Payload's generated tables.
- Used a transaction so failed inserts roll back cleanly.

### Problem 7: Payload Relationship And Array Tables Needed Manual Handling

What happened:

- Payload does not store every field directly on the parent table.
- Arrays and relationships use generated child tables.

Examples:

- `properties_amenities`
- `activities_highlights`
- `activities_rels`

How it was solved:

- The seed script inserts parent records first.
- Then it inserts related child rows:
  - property amenities
  - activity highlights
  - activity-to-property relations

### Problem 8: Media Uploads Need Durable Storage Later

What happened:

- Media records were seeded so the admin is no longer empty.

Remaining caveat:

- The current Payload media collection uses local filesystem storage.
- Vercel's filesystem is not persistent for real production uploads.

How it was handled for now:

- Seeded media records with remote image URLs for starter content.

What should be done later:

- Configure durable media storage, such as:
  - Supabase Storage
  - S3-compatible storage
  - Another Payload-compatible cloud storage adapter

## Deployment And Verification Notes

Production deployment was updated during the process after the code fixes.

Important production URL:

```text
https://real-estate-saas-frontend.vercel.app
```

The database seed did not require a redeploy because it changed Supabase data, not application code.

After seeding, the correct action was:

- Refresh Payload admin
- Log out and back in if the admin had cached old collection views

## Commit Timeline

Recent relevant commits:

```text
bad99ba chore: add Payload demo seed script
03cd951 fix: include Payload admin stylesheet
3908b6c fix: add Payload admin root layout
d74b843 chore: remove hardcoded Supabase credentials
007a03d fix: align Payload admin runtime for Vercel
23f65c1 docs: update troubleshooting with latest findings - Supabase works, Payload UI fails
235d2c7 fix: simplify Users collection for Payload 3.x
d18890d docs: update all documentation with Payload/Neon/Vercel troubleshooting info
```

## Current State

Working:

- Payload admin loads
- Payload admin styling is fixed
- Supabase connection works through the Session Pooler
- Collections are no longer empty after seeding
- Seed script exists for future use
- Latest changes are pushed to GitHub

Still worth improving later:

- Connect the public frontend to Payload/Supabase instead of hardcoded demo data
- Add durable cloud storage for Payload media uploads
- Consider replacing `push: true` with a migration-based production workflow once the schema stabilizes
- Add a safer documented process for rotating database credentials

