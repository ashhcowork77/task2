# Stack Research

**Domain:** Real Estate SaaS Platform (Multi-tenant)
**Researched:** 2026-05-31
**Confidence:** HIGH

## Recommended Stack

### Core Technologies (as specified by user — no substitution)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js (App Router) | 14+ | Frontend framework | SSR for SEO, App Router for server components |
| TypeScript | 5.x | Type safety | Required for Payload CMS |
| Tailwind CSS | 3.x | Styling | User-specified |
| Payload CMS | 3.x | Backend + CMS + Admin | User-specified |
| PostgreSQL + PostGIS | 15+ / 3.x | Database + geospatial | User-specified |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@payloadcms/db-postgres` | 3.x | Payload PostgreSQL adapter | Core database connection |
| `@maplibre/maplibre-gl` | 4.x | Map rendering | Property and POI maps |
| `next-compose-plugins` | - | Next.js middleware | Tenant resolution |
| `zod` | 3.x | Validation | API request validation |
| `drizzle-orm` | 0.29+ | Query builder | Complex PostGIS queries (if needed) |

## PostGIS + Payload Integration

PostgreSQL with PostGIS extension is supported via `@payloadcms/db-postgres`. Enable PostGIS in Docker Compose:

```yaml
# docker-compose.yml
postgres:
  image: postgis/postgis:15-3.4
  environment:
    POSTGRES_DB: real-estate-saas
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

PostGIS operations available:
- `ST_DWithin` — radius queries (e.g., "properties within 5km")
- `ST_Within` / `ST_Contains` — polygon containment
- `ST_Distance` — calculate distance between points

## Installation

```bash
# Create Payload app
npx create-payload-app@latest my-app

# Add Next.js frontend
cd my-app && npx create-next-app@latest frontend

# Install dependencies
npm install @maplibre/maplibre-gl @maplibre/maplibre-gl-geocoder
npm install zod
```

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Prisma | Doesn't support PostGIS natively | Payload ORM or Drizzle |
| MongoDB | No PostGIS support | PostgreSQL + PostGIS |
| Google Maps (paid) | Cost at scale | MapLibre GL + Google Places API for POI only |
| Apollo/GraphQL | Payload uses REST | Payload's built-in GraphQL (if needed) |

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Payload 3.x | PostgreSQL 14+ | PostGIS via `postgis/postgis` Docker image |
| Next.js 14+ | Node 18+ | App Router requires Node 18+ |
| MapLibre GL | MapLibre GL Geocoder | For address autocomplete |

## Sources

- [Payload CMS Docs](https://payloadcms.com/docs) — Framework integration
- [PostGIS Documentation](https://postgis.net/docs/) — Geospatial functions
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) — Open-source mapping
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — Multi-tenancy

---
*Stack research for: Real Estate SaaS Platform*
*Researched: 2026-05-31*
