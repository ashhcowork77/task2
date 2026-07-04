# Real Estate SaaS Platform — Project Guide

## Quick Start

Run `/gsd:discuss-phase 1` to start planning Phase 1.

## Project Overview

Multi-tenant SaaS platform ("Shopify for Real Estate") with three verticals:
- **Airbnb/short-let owners** (v1, fully implemented)
- **Real estate agents** (scaffolded as extension points)
- **Property builders** (scaffolded as extension points)

Each tenant gets their own branded site on a subdomain.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend/CMS/Admin:** Payload CMS 3.x (TypeScript)
- **Database:** PostgreSQL 15+ with PostGIS extension
- **Maps:** MapLibre GL (frontend) + Google Places API (POI data)
- **Auth:** Payload built-in authentication
- **Deployment:** Docker Compose

## Phase Structure

| Phase | Name | Status |
|-------|------|--------|
| 1 | Infrastructure Setup | Pending |
| 2 | Shared Data Layer | Pending |
| 3 | Tenant Routing | Pending |
| 4 | Airbnb Vertical | Pending |
| 5 | Search & Maps | Pending |
| 6 | Storefront SSR | Pending |
| 7 | Admin Polish | Pending |

## Known Issues

### Payload CMS + Neon DNS Resolution Failure
**Issue:** Vercel serverless functions cannot resolve Neon's hostname, causing `ENOTFOUND` errors.

**Documentation:** See `PAYLOAD_VERCEL_TROUBLESHOOTING.md` for full error log and attempted solutions.

**Workaround Options:**
1. Switch to Supabase (different DNS infrastructure)
2. Deploy to same region as Neon (ap-southeast-1)
3. Use Neon's HTTP API instead of direct PostgreSQL

## Key Principles

1. **SSR for SEO** — All storefront pages server-rendered
2. **Tenant isolation** — Every query scoped to current tenant
3. **Extension pattern** — Property fields composed from vertical-specific modules
4. **Cache-first** — POI data cached with 7-day TTL

## Planning Workflow

1. `/gsd:discuss-phase N` — Clarify approach before planning
2. `/gsd:plan-phase N` — Create execution plans
3. `/gsd:execute-phase N` — Run plans
4. `/gsd:verify-phase N` — Verify deliverables

## File Locations

| Artifact | Location |
|----------|----------|
| Project context | `.planning/PROJECT.md` |
| Config | `.planning/config.json` |
| Research | `.planning/research/` |
| Requirements | `.planning/REQUIREMENTS.md` |
| Roadmap | `.planning/ROADMAP.md` |
| State | `.planning/STATE.md` |

---

*Generated: 2026-05-31*
