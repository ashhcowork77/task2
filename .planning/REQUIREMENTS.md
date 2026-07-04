# Requirements: Real Estate SaaS Platform

**Defined:** 2026-05-31
**Core Value:** Property owners and agents can publish their listings and capture leads — without needing a developer.

## v1 Requirements

### Multi-Tenancy

- [ ] **MULTI-01**: Subdomain-based tenant resolution (extract tenant from `{tenant}.domain.com`)
- [ ] **MULTI-02**: Tenant-scoped access control — each tenant can only read/write their own data
- [ ] **MULTI-03**: Reserved subdomain protection (block www, api, admin, localhost)
- [ ] **MULTI-04**: Tenant model with vertical type (airbnb | agent | builder) and branding fields

### Authentication

- [ ] **AUTH-01**: Payload built-in authentication for tenant users
- [ ] **AUTH-02**: User roles within tenant (owner, staff)
- [ ] **AUTH-03**: Session persistence across browser refresh
- [ ] **AUTH-04**: Tenant-aware login — users log in to their tenant's scope

### Properties (Shared Core)

- [ ] **PROP-01**: Property CRUD via Payload admin (create, read, update, delete)
- [ ] **PROP-02**: Property base fields: title, description, address, geolocation (lat/lng via PostGIS)
- [ ] **PROP-03**: Property media gallery (images/files via Payload upload collections)
- [ ] **PROP-04**: Property status field (draft, published, archived)
- [ ] **PROP-05**: Property BHK type (Studio, 1 RK, 1BHK, 2BHK, 3BHK, 4BHK, 5BHK+)
- [ ] **PROP-06**: Property type (Apartment, Villa, Penthouse, Independent House, Plot/Land)
- [ ] **PROP-07**: Property furnishing status (Furnished, Semi-Furnished, Unfurnished)
- [ ] **PROP-08**: Property facing direction (North, South, East, West, North-East, etc.)
- [ ] **PROP-09**: Property floor (floor number, total floors)
- [ ] **PROP-10**: Property bathrooms count
- [ ] **PROP-11**: Pet policy (Pets Allowed, Pets Not Allowed)
- [ ] **PROP-12**: Tenant preference (Family, Bachelors, Corporate, Students, Working Professionals)
- [ ] **PROP-13**: Availability timing (Immediate, Within 1 Month, 1-3 Months, 3+ Months)
- [ ] **PROP-14**: Locality/neighborhood field
- [ ] **PROP-15**: Property creation timestamp, last updated

### Agent Vertical Extension Points

- [ ] **AGENT-01**: Property listing mode (For Rent, For Sale) — field added to schema
- [ ] **AGENT-02**: Rent price (monthly) — shown when For Rent selected
- [ ] **AGENT-03**: Sale price — shown when For Sale selected
- [ ] **AGENT-04**: Listing status (Available, Under Offer, Sold) — field stub added
- [ ] **AGENT-05**: Cross-listing search/filtering — extension point, not implemented

### Builder Vertical Extension Points

- [ ] **BLDR-01**: Project parent entity — schema stub added
- [ ] **BLDR-02**: Floorplan/home-type children — schema stub added
- [ ] **BLDR-03**: Lead-capture-first workflow — extension point, not implemented

### Airbnb Vertical (Full Implementation)

- [ ] **AIRB-01**: Nightly pricing field
- [ ] **AIRB-02**: Seasonal pricing table (date ranges with custom rates)
- [ ] **AIRB-03**: Amenities list (structured: WiFi, AC, Pool, Kitchen, Parking, etc.)
- [ ] **AIRB-04**: House rules (text field)
- [ ] **AIRB-05**: Availability calendar (date-based availability display)
- [ ] **AIRB-06**: Activity/Experience CRUD (title, description, price, media, availability)
- [ ] **AIRB-07**: Activities linked to Properties (optional association)
- [ ] **AIRB-08**: Booking/Inquiry record (lead capture, not live payment)

### Search & Filtering

- [ ] **FILT-01**: BHK type filter (multi-select)
- [ ] **FILT-02**: Property type filter (multi-select)
- [ ] **FILT-03**: Rent vs Sale toggle (for Agent vertical)
- [ ] **FILT-04**: Budget range filter (min/max for rent or sale price)
- [ ] **FILT-05**: Locality/neighborhood filter
- [ ] **FILT-06**: Furnishing status filter
- [ ] **FILT-07**: Amenities filter (multi-select)
- [ ] **FILT-08**: Pet policy filter
- [ ] **FILT-09**: Tenant preference filter
- [ ] **FILT-10**: Facing/Floor/Bathrooms filter
- [ ] **FILT-11**: Availability timing filter
- [ ] **FILT-12**: Geolocation-based search (PostGIS: properties within radius)

### Maps

- [ ] **MAP-01**: MapLibre GL property map view (all tenant properties with markers)
- [ ] **MAP-02**: Property detail map (single property location)
- [ ] **MAP-03**: POI overlay on property detail (restaurants, bars, parks, scenic spots)
- [ ] **MAP-04**: Map clustering for property list view (handle dense marker areas)

### POI / Google Places

- [ ] **POI-01**: Google Places API integration for nearby POI data
- [ ] **POI-02**: POI cache table (cached per property, 7-day TTL)
- [ ] **POI-03**: POI types: Restaurants & Cafes, Bars & Nightlife, Parks & Recreation, Beaches/Scenic
- [ ] **POI-04**: Cache invalidation on property location change

### Lead Capture

- [ ] **LEAD-01**: Property inquiry form (name, email, phone, message, property reference)
- [ ] **LEAD-02**: Activity inquiry form (name, email, phone, message, activity reference)
- [ ] **LEAD-03**: Leads visible in Payload admin per tenant
- [ ] **LEAD-04**: Lead status (New, Contacted, Qualified, Lost)

### Storefront (SSR for SEO)

- [ ] **FRONT-01**: Home/landing page (tenant branding, intro, featured properties)
- [ ] **FRONT-02**: Property list page with filters (SSR)
- [ ] **FRONT-03**: Property detail page with gallery, amenities, pricing, POI map (SSR)
- [ ] **FRONT-04**: Activities list page (SSR)
- [ ] **FRONT-05**: Activity detail page (SSR)
- [ ] **FRONT-06**: Property inquiry form page (SSR)
- [ ] **FRONT-07**: Activity inquiry form page (SSR)
- [ ] **FRONT-08**: JSON-LD structured data on property pages (SEO)
- [ ] **FRONT-09**: Responsive design (mobile-first)
- [ ] **FRONT-10**: Page meta tags (title, description, OG tags)

### Admin UI

- [ ] **ADMIN-01**: Payload admin accessible per tenant
- [ ] **ADMIN-02**: Property edit form with clean field grouping
- [ ] **ADMIN-03**: Activity edit form with media upload
- [ ] **ADMIN-04**: Lead management view
- [ ] **ADMIN-05**: Media library for property/activity images
- [ ] **ADMIN-06**: Admin forms polished for non-technical users (clear labels, helpful hints)

## v2 Requirements

### Payments & Booking

- **PAY-01**: Stripe integration for payments
- **PAY-02**: Live availability locking (prevent double-booking)
- **PAY-03**: Booking confirmation workflow
- **PAY-04**: Refund/cancellation handling

### Agent Vertical (Implementation)

- **AGT-01**: Agent storefront UI
- **AGT-02**: Property comparison view
- **AGT-03**: Agent-specific filters (school proximity, metro access)

### Builder Vertical (Implementation)

- **BLD-01**: Builder storefront UI
- **BLD-02**: Project/floorplan listing
- **BLD-03**: Builder-specific lead forms

### Additional Features

- **ADV-01**: Email notifications for new leads
- **ADV-02**: Custom domain support
- **ADV-03**: Theme customization per tenant
- **ADV-04**: Analytics dashboard
- **ADV-05**: Property inquiry from map markers

## Out of Scope

| Feature | Reason |
|---------|--------|
| Payments / Stripe billing | v1 is inquiry-first; payments are v2 |
| Live booking availability locking | Requires payment integration; v1 is lead capture only |
| Agent and builder verticals (UI) | Scaffolded as extension points only; full UI is v2 |
| Custom domains | Subdomain-only for v1; custom domains layered later |
| Theme marketplace / visual builder | Separate product offering, not this build |
| Real-time features, queues, caching layers | Beyond POI cache; add when needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MULTI-01 — MULTI-04 | TBD | Pending |
| AUTH-01 — AUTH-04 | TBD | Pending |
| PROP-01 — PROP-15 | TBD | Pending |
| AGENT-01 — AGENT-05 | TBD | Pending |
| BLDR-01 — BLDR-03 | TBD | Pending |
| AIRB-01 — AIRB-08 | TBD | Pending |
| FILT-01 — FILT-12 | TBD | Pending |
| MAP-01 — MAP-04 | TBD | Pending |
| POI-01 — POI-04 | TBD | Pending |
| LEAD-01 — LEAD-04 | TBD | Pending |
| FRONT-01 — FRONT-10 | TBD | Pending |
| ADMIN-01 — ADMIN-06 | TBD | Pending |

**Coverage:**
- v1 requirements: 64 total
- Mapped to phases: 0
- Unmapped: 64 ⚠️

---
*Requirements defined: 2026-05-31*
*Last updated: 2026-05-31 after initial definition*
