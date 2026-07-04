# Payload CMS + Vercel Troubleshooting Guide

## Overview

This document tracks the Payload CMS admin issue seen on Vercel and the fix applied on 2026-06-04.

---

## Current Status

| Component | Status |
|-----------|--------|
| Frontend pages | Working |
| Property detail pages | Working |
| Database connection | Working with Supabase |
| Payload schema creation | Working |
| Payload admin UI | Fixed in codebase |
| Production build | Passing |

Verification:

```bash
npm ls next react react-dom --workspace=frontend
npm run build
```

The production build now completes successfully and includes these dynamic routes:

- `/admin/[[...segments]]`
- `/api/[...slug]`
- `/api/graphql`
- `/api/graphql-playground`

---

## Root Cause

The admin error was not caused by Neon or Supabase.

Payload was installed at `3.85.0`, and `@payloadcms/ui@3.85.0` requires a React 19 compatible runtime and newer Next.js peer range. The frontend was still pinned to:

```text
next@14.x
react@18.x
react-dom@18.x
```

That mismatch caused Payload's admin UI bundle to access React 19 internals that do not exist in React 18, producing:

```text
TypeError: Cannot read properties of undefined (reading 'H')
    at ../node_modules/@payloadcms/ui/dist/exports/client/...
```

Changing database providers could not fix this because the failure happened during admin UI rendering/hydration.

---

## Fix Applied

### 1. Aligned Next and React with Payload

`frontend/package.json` now uses:

```json
{
  "next": "16.2.6",
  "react": "19.2.6",
  "react-dom": "19.2.6"
}
```

The root `package.json` now requires Node `>=20.9.0`, matching Next 16.

### 2. Wrapped the Next config with Payload

`withPayload` belongs in `frontend/next.config.mjs`, not inside `payload.config.ts`.

```js
import { withPayload } from '@payloadcms/next/withPayload';

export default withPayload(nextConfig);
```

### 3. Added Payload API routes

Payload admin needs its REST and GraphQL routes available in the Next app:

```text
frontend/src/app/api/[...slug]/route.ts
frontend/src/app/api/graphql/route.ts
frontend/src/app/api/graphql-playground/route.ts
```

### 4. Forced webpack builds

Next 16's Turbopack build hit a Payload UI SCSS processing panic locally. The app now uses webpack for dev and production:

```json
{
  "dev": "next dev --webpack",
  "build": "next build --webpack"
}
```

### 5. Fixed root Payload config drift

The root `payload.config.ts` no longer treats `withPayload` as a Payload plugin, and the root Payload collection list now includes the `users` auth collection.

---

## Environment Variables

Do not commit real secrets or database passwords.

Required Vercel variables:

| Name | Notes |
|------|-------|
| `DATABASE_URL` | Supabase or other PostgreSQL connection string |
| `PAYLOAD_SECRET` | Strong secret, generated per environment |
| `NEXT_PUBLIC_BASE_URL` | Public deployment URL |

---

## Previous Issues

### `"users" is not a valid admin user collection`

Cause: `admin.user` referenced `users`, but the collection was missing from the active Payload config.

Status: fixed by adding the `Users` auth collection to the active collection list.

### Neon DNS / connection errors

Earlier Neon connection failures were separate from the React admin error. Supabase is currently connecting successfully, so the remaining admin issue was traced to the package/runtime mismatch above.
