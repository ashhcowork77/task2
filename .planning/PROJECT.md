# Real Estate SaaS Platform

## What This Is

A website agency model — we build complete websites with CMS backends for property businesses (Airbnb hosts, real estate agents, property builders).

**MVP:** One complete site as proof of concept (demo client: e.g., Airbnb host or real estate agent).

**Version 2:** Shopify-style multi-tenant SaaS where clients self-signup and manage their own sites.

## Core Value

Property businesses get a professional website with a CMS — no developer needed to manage listings and capture leads.

## MVP Scope

### What we deliver (MVP)
- Complete frontend website (property listings, detail pages, inquiry form)
- CMS backend for managing properties
- Search, maps, and POI integration
- SEO-optimized pages
- For one demo client first

### What's NOT in MVP
- Multi-tenant SaaS infrastructure
- Self-service account signup
- Subdomain or custom domain routing per account
- Template system for cloning sites

## Tech Stack

- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend/CMS/Admin:** Payload CMS 3.x (TypeScript)
- **Database:** PostgreSQL 15+ with PostGIS extension
- **Maps:** MapLibre GL (frontend) + Google Places API (POI data)
- **Auth:** Payload built-in authentication
- **Deployment:** Docker Compose

## Requirements

### Active (MVP)

- [ ] Properties collection with all fields (title, description, address, geolocation, BHK, type, furnishing, etc.)
- [ ] Leads collection with inquiry capture
- [ ] Media collection for images
- [ ] Airbnb vertical fields (nightly pricing, amenities, house rules, activities)
- [ ] Property filters and search
- [ ] Map view with markers
- [ ] POI integration with Google Places
- [ ] SSR pages for SEO
- [ ] Inquiry forms
- [ ] Payload admin forms polished for non-technical users
- [ ] Agent/broker vertical with sale/rent listings, seller valuation page, buyer visit requests, lead qualification, and campaign attribution fields

### Out of Scope (MVP) / Version 2

- Multi-tenant infrastructure — Version 2
- Self-service signup — Version 2
- Subdomain or custom domain routing — Version 2
- Template system for cloning sites — Version 2
- Payments / Stripe billing — inquiry capture only
- Live booking availability — inquiry capture only

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Payload CMS as backend+CMS+admin | Single TypeScript codebase, built-in auth, reduces vendor count |
| PostGIS for geolocation | Native geospatial queries, works with Payload |
| Inquiry-first (not live booking) | Payments/availability engine is v2; lead capture is MVP |
| Airbnb vertical fully implemented | Demo client uses this vertical |
| Local media storage for MVP | S3 added when needed |
| Website agency model | We build & deploy for each client; v2 is self-service SaaS |
| Agent vertical positioning | Do not replace portals; reduce dependency by owning listing pages, lead capture, attribution, and follow-up |

## Version 2 (Future)

| Feature | Description |
|---------|-------------|
| Multi-tenant | Account isolation, shared database |
| Self-service | Clients signup themselves |
| Domain routing | Automatic domain → account lookup |
| Template system | Clone site for new client |

---
*Last updated: 2026-06-01 — Revised for MVP-first approach*
