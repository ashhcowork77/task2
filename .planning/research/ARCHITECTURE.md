# Architecture Research

**Domain:** Real Estate SaaS Platform (Multi-tenant)
**Researched:** 2026-05-31
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      TENANT STOREFRONT                        │
│  (Next.js App Router — SSR for SEO)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Home    │  │Property  │  │  Map     │  │ Inquiry  │ │
│  │  Page    │  │  Detail  │  │  View    │  │  Forms   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │              │              │              │         │
├───────┴──────────────┴──────────────┴──────────────┴────────┤
│                    TENANT ADMIN UI                            │
│           (Payload CMS Admin — per-tenant access)            │
├──────────────────────────────────────────────────────────────┤
│                      PAYLOAD API LAYER                        │
│    (REST + GraphQL — tenant-scoped queries via ACLs)         │
├──────────────────────────────────────────────────────────────┤
│                      DATA LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ PostgreSQL│  │  PostGIS │  │  Media   │  │   POI    │  │
│  │          │  │(GeoIndex) │  │ Storage  │  │  Cache   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Next.js App | Storefront SSR, routing | `app/` directory with `[tenant]` dynamic segment |
| Payload CMS | Backend API, Admin UI, Auth | `payload.config.ts` with collections |
| PostgreSQL | Primary data store | Tenant, User, Property, Lead, Activity |
| PostGIS | Geospatial queries | `ST_DWithin`, `ST_Within` |
| MapLibre GL | Map rendering | Client component with SSR fallback |
| Google Places | POI data | Server-side API calls with caching |

## Recommended Project Structure

```
real-estate-saas/
├── payload/                    # Payload CMS backend
│   ├── src/
│   │   ├── collections/        # Payload collections
│   │   │   ├── Tenants.ts
│   │   │   ├── Users.ts
│   │   │   ├── Properties/
│   │   │   │   ├── index.ts
│   │   │   │   ├── fields.ts   # Shared base fields
│   │   │   │   ├── airbnb.ts    # Airbnb-specific fields
│   │   │   │   ├── agent.ts     # Agent extension points
│   │   │   │   └── builder.ts   # Builder extension points
│   │   │   ├── Activities.ts
│   │   │   ├── Leads.ts
│   │   │   ├── Media.ts
│   │   │   └── PoiCache.ts
│   │   ├── access/
│   │   │   └── tenants.ts       # Tenant-scoped access control
│   │   └── hooks/
│   │       └── tenantScope.ts   # Query hooks for tenant isolation
│   └── payload.config.ts
├── frontend/                   # Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── [tenant]/       # Dynamic tenant segment
│   │   │   │   ├── page.tsx    # Tenant home
│   │   │   │   ├── properties/
│   │   │   │   ├── activities/
│   │   │   │   └── layout.tsx
│   │   │   ├── admin/          # Payload admin (separate if needed)
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── maps/
│   │   │   ├── property/
│   │   │   └── forms/
│   │   ├── lib/
│   │   │   ├── payload.ts      # Payload client
│   │   │   ├── tenant.ts       # Tenant resolution utilities
│   │   │   └── poi.ts          # Google Places integration
│   │   └── types/
│   └── middleware.ts            # Subdomain extraction
├── docker-compose.yml
└── package.json                 # Workspace root
```

### Structure Rationale

- **`payload/`:** Monolith backend — collections, hooks, access control in one place
- **`frontend/`:** Next.js handles SSR for SEO and tenant routing
- **`[tenant]/`:** Dynamic segment enables per-tenant rendering without code splitting
- **`Properties/` subdirectory:** Extension pattern for vertical-specific fields

## Architectural Patterns

### Pattern 1: Vertical Extension via Field Composition

**What:** Shared base collection with vertical-specific field files
**When to use:** When verticals share 80% but differ on 20%
**Trade-offs:** +Clean separation, +Easy to add verticals, -Slightly more complex imports

```typescript
// payload/src/collections/Properties/index.ts
import { baseFields } from './fields';
import { airbnbFields } from './airbnb';
import { agentFields } from './agent';     // Extension point
import { builderFields } from './builder'; // Extension point

export const Properties: CollectionConfig = {
  slug: 'properties',
  fields: [
    ...baseFields,      // Shared: title, address, geolocation, media
    ...airbnbFields,    // Airbnb v1: pricing, amenities, availability
    // ...agentFields,  // Uncomment when Agent vertical is built
    // ...builderFields, // Uncomment when Builder vertical is built
  ],
};
```

### Pattern 2: Tenant-Scoped Access Control

**What:** Every query automatically filtered by tenant
**When to use:** Multi-tenant data isolation
**Trade-offs:** +Security, +Simplicity for developers, -Small overhead per query

```typescript
// payload/src/access/tenants.ts
export const tenantAccess = ({ req: { user } }): Access => {
  if (user?.tenant) {
    return {
      tenant: { equals: user.tenant },
    };
  }
  return false;
};

// Usage in collection
export const Properties: CollectionConfig = {
  access: {
    create: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
    delete: tenantAccess,
  },
};
```

### Pattern 3: Subdomain Resolution Middleware

**What:** Extract tenant from subdomain, pass via header
**When to use:** Multi-tenant SaaS with subdomain routing
**Trade-offs:** +Simple, +Scales well, -Requires wildcard DNS

```typescript
// frontend/middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const parts = hostname.split('.');
  const subdomain = parts[0];

  // Skip reserved domains
  if (['www', 'api', 'localhost'].includes(subdomain)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', subdomain);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

## Data Flow

### Request Flow: Property List (Tenant Storefront)

```
[User visits {tenant}.app.com]
    ↓
[Middleware extracts subdomain → x-tenant-slug header]
    ↓
[Next.js SSR: app/[tenant]/page.tsx]
    ↓
[getProperties({ tenant: slug })] → Payload API
    ↓
[Payload ACL filters by tenant] → PostgreSQL
    ↓
[SSR renders property cards] → Response
```

### Request Flow: POI Display

```
[User visits property detail page]
    ↓
[Check POI cache for property_id + type]
    ↓
[Cache hit?] → Return cached POIs → Render map
    ↓
[Cache miss] → Google Places API → Cache result → Return
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|-------------------------|
| 0-100 tenants | Single Postgres instance, basic PostGIS indexes |
| 100-1k tenants | Connection pooling (PgBouncer), read replicas |
| 1k-10k tenants | Tenant-based sharding or separate DB per tenant |

### Scaling Priorities

1. **First bottleneck:** POI cache — implement TTL-based invalidation
2. **Second bottleneck:** Media storage — consider S3/CDN for images
3. **Third bottleneck:** PostGIS queries — ensure spatial indexes exist

## Anti-Patterns

### Anti-Pattern 1: Tenant ID in URL Path

**What people do:** `/app/tenant-slug/properties`
**Why it's wrong:** SEO impact, URL changes if tenant changes subdomain
**Do this instead:** Subdomain routing `{tenant}.domain.com`

### Anti-Pattern 2: No Tenant Isolation at DB Level

**What people do:** Relying only on application-level filtering
**Why it's wrong:** Bugs can expose cross-tenant data
**Do this instead:** Row-level security + Payload ACLs

### Anti-Pattern 3: Client-Side Map Rendering

**What people do:** Rendering maps entirely on client
**Why it's wrong:** SEO impact, slower initial load
**Do this instead:** SSR skeleton with client-side interactivity

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Google Places API | Server-side fetch with caching | $32/1K requests, cache aggressively |
| MapLibre base tiles | Client-side | OpenStreetMap — free |
| Email (future) | Payload email plugin | SendGrid/Resend for lead notifications |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Frontend ↔ Payload | REST/GraphQL | Next.js server components fetch directly |
| Payload ↔ Postgres | SQL (via Drizzle ORM) | Tenant-scoped queries |

## Sources

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Payload CMS Multi-tenancy Pattern](https://payloadcms.com/community-help/github/geospatial-queries-field)
- [PostGIS Best Practices](https://postgis.net/docs/using_postgis_dbmanagement.html)
- [MapLibre GL + Next.js](https://maplibre.org/maplibre-gl-js/docs/)

---
*Architecture research for: Real Estate SaaS Platform*
*Researched: 2026-05-31*
