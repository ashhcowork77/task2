# Roadmap: Real Estate SaaS Platform — MVP

**Defined:** 2026-05-31
**Revised:** 2026-06-01
**Granularity:** Standard (5-7 phases, 3-5 plans each)
**Project mode:** single-account-first
**Parallel execution:** enabled

> **Version 2 Note:** Shopify-style multi-tenant SaaS (self-service signup, subdomain routing, account self-onboarding) is **Version 2**. This roadmap covers the MVP — building one complete site as a proof of concept, then making it repeatable for future clients.

---

## MVP Scope

**Current target:** Build one complete website + CMS for a demo client (e.g., Airbnb host or real estate agent).

**What we deliver:**
- Complete frontend website (property listings, detail pages, inquiry form)
- CMS backend for the client to manage properties
- Search, maps, and POI integration
- SEO-optimized pages

**What's NOT in MVP:**
- Multi-tenant SaaS infrastructure
- Self-service account signup
- Subdomain or custom domain routing per account
- Template system for cloning sites

---

## Phase Overview

| # | Phase | Goal | Plans |
|---|-------|------|-------|
| 1 | Infrastructure Setup | Docker + Payload + Next.js + PostgreSQL connected | 3 |
| 2 | Data Layer | Properties, Leads, Media collections with full fields | 4 |
| 3 | Airbnb Vertical | Airbnb-specific fields + Activities + Inquiry | 3 |
| 4 | Search & Maps | Filters + MapLibre integration + POI caching | 4 |
| 5 | Storefront SSR | SEO pages for all public routes | 4 |
| 6 | Admin Polish | Clean forms for non-technical users | 2 |
| 7 | Agent & Broker Lead Engine | Agent/broker storefront + CMS fields + qualified lead capture | 4 |

---

## Phase 1: Infrastructure Setup

**Goal:** Docker Compose with Payload + Next.js + PostgreSQL, all services connected and booting.

**Status:** Complete (3/3 plans)

**Success Criteria:**
1. `docker compose up` starts all services without errors
2. Payload admin accessible at localhost:3000/admin
3. PostgreSQL connection verified
4. Next.js frontend connects to Payload API
5. Frontend builds without errors

### Plans

- [x] 1.1 — Docker Compose with Postgres/PostGIS and app service
- [x] 1.2 — Payload CMS integration with monorepo structure
- [x] 1.3 — Next.js frontend with placeholder pages

---

## Phase 2: Data Layer

**Goal:** Core Payload CMS collections (Properties, Leads, Media) with full field definitions for the demo client.

**Status:** Complete (4/4 plans)

**Success Criteria:**
1. Properties collection with all base fields (title, description, address, geolocation, BHK, type, furnishing, etc.)
2. Leads collection captures inquiry data
3. Media collection handles image uploads
4. All collections accessible in Payload admin

### Plans

- [x] 2.1 — Properties Collection
- [x] 2.2 — Leads Collection
- [x] 2.3 — Media Collection
- [x] 2.4 — Accounts Collection & Wiring

---

## Phase 3: Activities & Inquiry

**Goal:** Activities collection for Airbnb experiences + inquiry submission flow.

**Status:** Complete (3/3 plans)

**Success Criteria:**
1. Activities collection with CRUD
2. Activities can be linked to Properties
3. Inquiry form submits lead to CMS
4. Inquiry visible in admin

### Plans

- [x] 3.1 — Activities Collection
- [x] 3.2 — Inquiry Form
- [x] 3.3 — Activity Inquiry

---

## Phase 4: Search & Maps

**Goal:** Property filters, MapLibre integration, POI caching.

**Status:** Complete (4/4 plans)

**Success Criteria:**
1. All filter types implemented (BHK, type, budget, locality, amenities, etc.)
2. Property map view shows properties as markers
3. POI overlay on property detail
4. Google Places API integration with 7-day cache TTL

### Plan Status

- [x] 4.1 — Property Filters
- [x] 4.2 — Property Map View
- [x] 4.3 — POI Integration
- [x] 4.4 — Geolocation Search

### Plans

**4.1: Property Filters**
- Create Zustand filter store with URL sync
- Create filter utilities and Payload query builder
- Build filter UI: BHK selector, property type, budget slider, locality, furnishing, amenities, pet policy, tenant preference
- Test: Apply filters, verify correct results

**4.2: Property Map View**
- Install maplibre-gl, react-map-gl
- Create SSR-safe MapViewSSR wrapper with dynamic import
- Create PropertyMap component with GeoJSON markers and clustering
- Add MapSkeleton loading placeholder
- Test: Map loads with property markers

**4.3: POI Integration**
- Create POICache collection with 7-day TTL hooks
- Implement Google Places API client
- Create POI cache utilities (read/write/invalidate)
- Build POI overlay component with category filtering
- Test: Fetch POIs, verify cache hit on second load

**4.4: Geolocation Search**
- Create PostGIS radius query hook (ST_DWithin)
- Add radius and center fields to filter store
- Create RadiusSelector and CenterPointSelector UI
- Wire radius filter to API route
- Test: "Properties within 5km" returns correct results

---

## Phase 5: Storefront SSR

**Goal:** SEO-optimized public pages for all routes.

**Status:** Complete (4/4 plans)

**Success Criteria:**
1. Home page renders with featured properties
2. Property list page with filters (SSR)
3. Property detail page with gallery, amenities, POI map (SSR)
4. Activities pages (SSR)
5. JSON-LD schema on property pages
6. Responsive design
7. Meta tags on all pages

### Plans

**5.1: Home & Property List**
- Create home page with featured properties
- Create property list page with filters
- Implement SSR with `generateMetadata`
- Add loading skeletons
- Test: `curl` returns full HTML

**5.2: Property Detail Page**
- Create property detail page
- Implement gallery with lazy loading
- Display all fields, amenities, pricing
- Add inquiry form
- Add POI map overlay
- Implement JSON-LD: RealEstateListing schema
- Test: Verify JSON-LD in page source

**5.3: Activities Pages**
- Create activities list page (SSR)
- Create activity detail page (SSR)
- Add inquiry form to detail page
- Test: Pages render correctly

**5.4: SEO & Performance**
- Add canonical URLs
- Implement Open Graph meta tags
- Add sitemap generation
- Optimize images with next/image
- Test: Pages score well in SEO audit

---

## Phase 6: Admin Polish

**Goal:** Payload admin forms optimized for non-technical users.

**Status:** Complete (2/2 plans)

**Success Criteria:**
1. Property edit form with clean field groupings
2. Field labels are user-friendly
3. Helpful hints for complex fields
4. Activity edit form polished
5. Media library is intuitive

### Plans

- [x] **6.1: Property Form Organization** ✅
- [x] **6.2: Activity & Media Polish** ✅

---

## Version 2: Shopify-Style SaaS (Future)

## Phase 7: Agent & Broker Lead Engine

**Goal:** Add a copyable real-estate-agent/broker vertical that turns the completed property website foundation into an owned listing and lead-generation system.

**Status:** Complete (4/4 plans)

**Success Criteria:**
1. Agent/broker-specific property fields exist in Payload without breaking the Airbnb vertical
2. Leads capture qualification, source, campaign, score, and follow-up context
3. `/agents`, `/agents/listings`, `/agents/listings/[id]`, and `/agents/sell` render without a database
4. Buyer, seller, and listing visit forms submit structured lead context through server actions
5. Frontend build passes or any blocker is documented

### Plans

- [x] 7.1 — Agent CMS fields and lead qualification fields
- [x] 7.2 — Agent fallback listings and server actions
- [x] 7.3 — Agent storefront, listing index, listing detail, and seller page
- [x] 7.4 — Build and visual verification

---

These items are **out of scope** for MVP and will be addressed in Version 2:

| Feature | Notes |
|---------|-------|
| Multi-tenant architecture | Account isolation, shared database |
| Self-service signup | Clients sign up themselves |
| Subdomain routing | `{account}.platform.com` |
| Custom domain routing | Automatic domain → account lookup |
| Template system | Clone site for new client |
| Account management dashboard | Onboard new clients from admin |

---

*Last updated: 2026-06-02 — Phase 5 complete, Phase 6 pending*
