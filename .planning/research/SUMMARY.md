# Project Research Summary

**Project:** Real Estate SaaS Platform
**Domain:** Multi-tenant Real Estate Platform (Shopify for Real Estate)
**Researched:** 2026-05-31
**Confidence:** HIGH

## Executive Summary

This is a **multi-tenant SaaS platform** with a shared data core and vertical-specific extensions. Three verticals (Airbnb, Agent, Builder) share base entities (Tenant, Property, Lead) but diverge on vertical-specific fields. The tech stack is locked by user constraints: Next.js + Payload CMS + PostgreSQL/PostGIS + MapLibre GL.

**Key architectural insight:** The vertical extension pattern is critical. Property should use field composition (base fields + Airbnb fields + Agent fields stub) rather than one bloated schema. This prevents the "bloated Property" pitfall and keeps Agent/Builder verticals clean to implement later.

**Primary risk:** SEO-dependent storefronts require SSR for all public pages. MapLibre GL is client-side, so maps must be implemented with server-rendered skeletons that hydrate on the client. Missing SSR = no Google ranking = platform failure.

**Secondary risk:** Google Places API costs scale with traffic. POI caching is not optional — it must be implemented from day one with 7-day TTL.

## Key Findings

### Recommended Stack

User-specified stack confirmed: Next.js 14+ (App Router), Payload CMS 3.x, PostgreSQL 15+ with PostGIS extension, MapLibre GL 4.x. No substitutions needed.

**PostGIS is required** for radius searches ("properties within 5km") and geofencing. Use `postgis/postgis:15-3.4` Docker image. Critical: create spatial index (`CREATE INDEX ... USING GIST`) immediately after adding geometry columns — without it, geo queries are unusable at scale.

**Payload CMS handles auth, ACL, and admin UI.** Its built-in access control enforces tenant isolation at the collection level. Combine with middleware-based tenant resolution for defense in depth.

### Expected Features

**Must have (table stakes):**
- Property CRUD with photo gallery
- Map view of properties (MapLibre GL)
- Search filters: BHK type, property type, rent/sale toggle, furnishing, budget range
- Inquiry/lead capture forms
- Multi-tenant subdomain routing
- SSR storefront for SEO
- Payload admin for tenant management

**Should have (competitive):**
- Nearby POI display (restaurants, bars, parks, scenic spots) — key for Airbnb
- Seasonal pricing management
- Availability calendar display
- Advanced filters: facing, floor, bathrooms, pet policy

**Defer (v2+):**
- Live booking with Stripe payments
- Availability locking
- Agent vertical UI
- Builder vertical UI
- Custom domains
- Theme marketplace

### Architecture Approach

Single-repo architecture with `payload/` (backend) and `frontend/` (Next.js App Router) directories. Next.js middleware extracts tenant from subdomain and passes via `x-tenant-slug` header. Payload collections use field composition for vertical extensions — shared base fields in `Properties/fields.ts`, Airbnb-specific in `Properties/airbnb.ts`, stubs in `Properties/agent.ts` and `Properties/builder.ts`.

Tenant isolation enforced at three layers: (1) middleware validates tenant exists, (2) Payload access functions filter queries, (3) PostgreSQL row-level security as backup.

### Critical Pitfalls

1. **Missing spatial indexes** — Map queries timeout without PostGIS GIST index. Must create in Phase 1.

2. **Client-side only maps** — SEO death. Must SSR property pages with JSON-LD schema, hydrate MapLibre client-side.

3. **Cross-tenant data leakage** — ACL bugs expose wrong tenant's data. Audit every query for tenant filter.

4. **Uncached Google Places API** — API costs and rate limits. Cache with 7-day TTL from day one.

5. **Bloated Property schema** — Adding Agent/Builder fields directly to Property. Use field composition pattern.

## Implications for Roadmap

Based on research, suggested phase structure aligns with user's provided build order:

### Phase 1: Project Scaffolding
**Rationale:** Verify stack boots correctly before building features. PostGIS spatial index must be created here.
**Delivers:** Docker Compose (app + Postgres/PostGIS), Payload + Next.js connected, spatial index verified.
**Avoids:** Pitfall #1 (missing spatial index)
**Research flag:** LOW — well-documented patterns

### Phase 2: Shared Core Models
**Rationale:** Foundation for everything else. Tenant isolation must be correct here — can't fix later without rewriting.
**Delivers:** Tenant, User, Property (base fields), Lead, Media collections with full ACLs.
**Implements:** Vertical extension pattern for Property.
**Avoids:** Pitfall #3 (cross-tenant leakage), Pitfall #5 (bloated schema)
**Research flag:** LOW — Payload ACL patterns well-documented

### Phase 3: Subdomain Tenant Resolution
**Rationale:** Frontend can't show tenant data without knowing which tenant.
**Delivers:** Next.js middleware, `[tenant]` dynamic route segment, tenant validation.
**Avoids:** Pitfall #3 (leakage via middleware)
**Research flag:** LOW — Next.js middleware patterns well-documented

### Phase 4: Airbnb Extension Models
**Rationale:** Core vertical for v1 launch.
**Delivers:** Property.airbnb fields (pricing, amenities, availability), Activity collection, Booking/Inquiry models.
**Extends:** Phase 2 Property collection via field composition.
**Research flag:** LOW — Payload field patterns well-documented

### Phase 5: Storefront Pages
**Rationale:** SEO-dependent. SSR patterns must be correct from day one.
**Delivers:** Home page, property list, property detail, activities, inquiry forms — all SSR with JSON-LD.
**Implements:** MapLibre integration with SSR skeleton pattern.
**Avoids:** Pitfall #2 (client-side only maps)
**Research flag:** MEDIUM — MapLibre + Next.js SSR has less documentation

### Phase 6: Google Places Integration + POI Caching
**Rationale:** Core differentiator for Airbnb vertical.
**Delivers:** POI cache table, Places API integration, map overlay on property detail.
**Avoids:** Pitfall #4 (uncached API calls)
**Research flag:** MEDIUM — Google Places patterns, caching strategy

### Phase 7: Admin Form Polish
**Rationale:** Non-technical users need clean forms.
**Delivers:** Custom Payload admin components, field groups, validation messages.
**Research flag:** LOW — Payload admin customization documented

### Phase Ordering Rationale

1. **Scaffolding first** — verify PostGIS + Payload connection works
2. **Core models before UI** — data model drives everything
3. **Tenant resolution next** — frontend needs tenant context
4. **Airbnb extension** — build the v1 vertical
5. **Storefront pages** — SSR maps, SEO
6. **POI integration** — API-heavy, cache-first
7. **Admin polish** — polish phase, not blocking

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5:** MapLibre + Next.js SSR hydration edge cases
- **Phase 6:** Google Places API rate limits, cost optimization

Phases with standard patterns (skip research-phase):
- **Phase 1:** Docker/Postgres patterns well-established
- **Phase 2:** Payload ACL patterns well-documented
- **Phase 3:** Next.js middleware patterns well-documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | User-specified, all technologies mature |
| Features | HIGH | Clear PRD with feature list |
| Architecture | HIGH | Vertical extension pattern well-understood |
| Pitfalls | HIGH | Common patterns documented |

**Overall confidence:** HIGH

### Gaps to Address

- **MapLibre + Next.js SSR hydration:** Specific edge cases when maps load on server vs client — needs verification during Phase 5 planning.
- **Google Places pricing:** Actual cost at expected traffic volume — needs business input on user count projections.

## Sources

### Primary (HIGH confidence)
- [Payload CMS Docs](https://payloadcms.com/docs) — Collections, ACL, authentication
- [PostGIS Documentation](https://postgis.net/docs/) — Spatial indexes, geometry functions
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware) — Subdomain extraction

### Secondary (MEDIUM confidence)
- [Payload CMS Community](https://payloadcms.com/community-help/github/geospatial-queries-field) — PostGIS integration patterns
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) — Map rendering
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/legacy/search) — POI integration

### Tertiary (LOW confidence)
- User-provided PRD — primary source for requirements

---
*Research completed: 2026-05-31*
*Ready for roadmap: yes*
