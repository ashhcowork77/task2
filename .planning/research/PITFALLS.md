# Pitfalls Research

**Domain:** Real Estate SaaS Platform (Multi-tenant)
**Researched:** 2026-05-31
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Missing PostGIS Spatial Indexes

**What goes wrong:** Map searches and radius queries become extremely slow (seconds vs milliseconds) as property count grows.

**Why it happens:** Developers create the geometry column but forget to add a spatial index.

**How to avoid:**
```sql
-- Always create spatial index after adding PostGIS geometry
CREATE INDEX idx_properties_geolocation 
ON properties USING GIST (geolocation);
```

**Warning signs:**
- Map view takes >2 seconds to load
- Property search with location filter times out

**Phase to address:** Phase 1 (Scaffolding)

---

### Pitfall 2: Client-Side Only Maps (SEO Death)

**What goes wrong:** Search engines can't index map content; tenant sites don't rank.

**Why it happens:** MapLibre GL is a client-side library; developers use it directly in client components without SSR.

**How to avoid:**
```typescript
// ❌ Client-only (bad for SEO)
'use client';
const Map = () => <MapLibreGl />;

// ✅ Server-rendered with client hydration
// server: app/[tenant]/properties/[id]/page.tsx
export default async function PropertyPage() {
  const property = await getProperty(id);
  return (
    <>
      <PropertySchema property={property} /> {/* SEO */}
      <Map client:load /> {/* Interactive */}
    </>
  );
}
```

**Warning signs:**
- No `<script type="application/ld+json">` for property data
- Maps inside `'use client'` components only

**Phase to address:** Phase 5 (Storefront pages)

---

### Pitfall 3: Cross-Tenant Data Leakage

**What goes wrong:** Tenant A sees Tenant B's properties, leads, or sensitive data.

**Why it happens:** Access control not applied consistently; missing tenant filter in queries.

**How to avoid:**
1. Global tenant scope hook that auto-adds tenant filter
2. Payload access functions on every collection
3. Row-level security as backup defense

```typescript
// payload/src/hooks/tenantScope.ts
export const addTenantScope = (query: Query) => {
  const tenant = getTenantFromRequest();
  if (!tenant) throw new ForbiddenError();
  return { ...query, tenant: { equals: tenant } };
};
```

**Warning signs:**
- Missing `tenant` filter on any query
- Admin users can see "All" tenants in dropdown

**Phase to address:** Phase 2 (Shared core models)

---

### Pitfall 4: Uncached Google Places API Calls

**What goes wrong:** API costs spiral; rate limiting kicks in during traffic spikes.

**Why it happens:** Fetching POIs for every property view without caching.

**How to avoid:**
1. Create `poi_cache` table in Payload
2. On property view: check cache → if miss → fetch from Google → cache with TTL
3. Use 7-day TTL for POI data (places don't change often)

```typescript
// Cache for 7 days
const cachedPoi = await payload.find({
  collection: 'poiCache',
  where: {
    property: { equals: propertyId },
    type: { equals: poiType },
    cachedAt: { greater_than: sevenDaysAgo },
  },
});
```

**Warning signs:**
- Google Places API usage > expected by 10x
- "OVER_QUERY_LIMIT" errors in logs

**Phase to address:** Phase 6 (Google Places integration)

---

### Pitfall 5: Bloated Property Schema (Vertical Confusion)

**What goes wrong:** Property collection accumulates fields for all verticals, becoming unmanageable.

**Why it happens:** Adding Agent/Builder fields directly to Property instead of using extension points.

**How to avoid:**
- Use field composition pattern (base + vertical-specific files)
- Mark Agent/Builder fields with comments: `// AGENT VERTICAL: uncomment when building`
- Keep vertical fields isolated

**Warning signs:**
- Property collection has >50 fields
- "Property type: Apartment/Villa/Project" confusion
- Airbnb-specific fields visible in Agent admin UI

**Phase to address:** Phase 2 (Data model design)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip spatial indexes | Faster initial setup | Slow queries at scale | Never for geolocation apps |
| Hardcode tenant ID | Simpler code | Security breach | Never |
| Skip SSR for maps | Easier development | SEO failure | Never |
| No POI caching | Simpler code | API bill explosion | Only for MVP demo |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Payload + PostGIS | Assuming Drizzle handles PostGIS types | Use `pg` directly for raw PostGIS functions |
| MapLibre SSR | Maps crash on server | Use dynamic import with `ssr: false` or skeleton |
| Google Places | No caching | Cache in DB with TTL, batch requests |
| Subdomain routing | Breaking on localhost | Use `lvh.me` or `/etc/hosts` mapping |

---

### Pitfall 6: Database DNS Resolution in Serverless Environments

**What goes wrong:** Payload CMS cannot connect to Neon PostgreSQL from Vercel serverless functions.

**Why it happens:** Node.js's DNS resolver fails to resolve Neon's hostname (`*.c-2.ap-southeast-1.aws.neon.tech`) in serverless environments, even though `dig` resolves it correctly.

**Symptoms:**
```
getaddrinfo ENOTFOUND ep-round-art-aos6mbkn-pooler.c-2.ap-southeast-1.aws.neon.tech
```

**Attempted Solutions:**
1. Connection pooling ON/OFF in Neon - Same DNS failure
2. Using IP instead of hostname - SSL cert mismatch
3. Different SSL modes - DNS fails before SSL
4. Neon Serverless Driver - Not integrated with Payload CMS

**Status:** UNRESOLVED

**Alternative Approaches to Try:**
- Use Supabase instead of Neon (different DNS infrastructure)
- Use Neon's HTTP API instead of direct PostgreSQL
- Deploy to AWS (same region as Neon: ap-southeast-1)
- Contact Neon support about DNS resolution

**Phase to address:** Phase 1 or when switching database providers

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| N+1 queries on property list | 1s per 10 properties | Use Payload's `depth` parameter | >50 properties |
| Large property gallery | Slow page load | Lazy load images, use blur placeholders | >10 images per property |
| Complex PostGIS queries | Timeout on search | Index geolocation, limit search radius | >10km radius |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| No tenant isolation | Cross-tenant data access | Payload ACLs + middleware validation |
| Unvalidated tenant slug | Path traversal | Validate against DB, redirect if not found |
| No rate limiting on forms | Lead spam | Implement rate limiting on inquiry endpoints |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|----------------|
| Map markers all at same zoom | Can't see individual properties | Auto-fit bounds to visible markers |
| Infinite scroll without loading state | Confusion during load | Skeleton + "Loading more..." |
| Filter reset on navigation | Lost filter state | Persist filters in URL params |

## "Looks Done But Isn't" Checklist

- [ ] **Maps:** Often missing fallback for slow connections — test with throttled network
- [ ] **POI display:** Often missing on mobile — verify responsive layout
- [ ] **Property schema:** Often missing required fields (BHK type is easy to miss)
- [ ] **SSR:** Often not implemented for map pages — verify with `curl` (no JS)
- [ ] **Tenant routing:** Often breaks on first property detail view — test full flow
- [ ] **Media uploads:** Often missing resize/optimization — verify image sizes

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|---------------|
| Missing spatial index | LOW | Add index, reindex in background |
| Cross-tenant leak | CRITICAL | Audit logs, fix ACLs, notify affected tenants |
| No POI caching | MEDIUM | Add cache table, backfill existing properties |
| SEO failure | HIGH | Implement SSR, submit sitemap to Google |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Missing spatial index | Phase 1 | `EXPLAIN ANALYZE` on geo queries |
| Client-only maps | Phase 5 | Test with `curl`, check for JSON-LD |
| Cross-tenant leakage | Phase 2 | Audit all queries for tenant filter |
| Uncached POI calls | Phase 6 | Monitor Google API dashboard |
| Bloated schema | Phase 2 | Review field count per collection |

## Sources

- [Payload CMS Community](https://payloadcms.com/community-help/) — Common issues
- [PostGIS Performance](https://postgis.net/docs/using_postgis_dbmanagement.html#idm4622) — Index best practices
- [Next.js SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) — SSR patterns

---
*Pitfalls research for: Real Estate SaaS Platform*
*Researched: 2026-05-31*
