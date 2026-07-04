# Project State

**Last updated:** 2026-06-16

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-06-01)

**Core value:** Property businesses get a professional website with a CMS — no developer needed to manage listings and capture leads.

**Current focus:** Phase 7 complete — Agent & Broker Lead Engine vertical slice shipped

## Project Model

**Website Agency Model (MVP)**
- We build complete websites + CMS for property businesses
- Not a self-service SaaS (that's Version 2)

## Demo Client

**Not Just A Stay** (Airbnb vertical)
- Website: https://www.notjustastay.com
- Vertical: Airbnb/Short-let properties
- Scope: Import all property details and photographs from existing site
- Account: Single account for MVP

## Phase Status

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 — Infrastructure Setup | ✅ Complete | 3/3 | 100% |
| 2 — Data Layer | ✅ Complete | 4/4 | 100% (4/4) |
| 2.1 — Properties Collection | ✅ Complete | - | - |
| 2.2 — Leads Collection | ✅ Complete | - | - |
| 2.3 — Media Collection | ✅ Complete | - | - |
| 2.4 — Accounts Collection | ✅ Complete | - | - |
| 3 — Activities & Inquiry | ✅ Complete | 3/3 | 100% (3/3) |
| 3.1 — Activities Collection | ✅ Complete | - | - |
| 3.2 — Property Inquiry Form | ✅ Complete | - | - |
| 3.3 — Activity Inquiry | ✅ Complete | - | - |
| 4 — Search & Maps | ✅ Complete | 4/4 | 100% (4/4) |
| 4.1 — Property Filters | ✅ Complete | - | - |
| 4.2 — Property Map View | ✅ Complete | - | - |
| 4.3 — POI Integration | ✅ Complete | - | - |
| 4.4 — Geolocation Radius Search | ✅ Complete | - | - |
| 6.1 — Property Form Polish | ✅ Complete | - | - |
| 6.2 — Activity & Media Polish | ✅ Complete | - | - |
| 5 — Storefront SSR | ✅ Complete | 4/4 | 100% (4/4) |
| 6 — Admin Polish | ✅ Complete | 2/2 | 100% (2/2) |
| 7 — Agent & Broker Lead Engine | ✅ Complete | 4/4 | 100% (4/4) |

## Execution State

**Mode:** yolo (auto-approve)
**Parallelization:** enabled
**Current wave:** none

## Notes

- MVP: Build website for Not Just A Stay as proof of concept
- Shopify-style SaaS is Version 2
- 6 phases total for MVP
- Vertical: Airbnb (Agent & Builder are future clients)
- Phase 7 starts the agent/broker vertical as a copyable owned lead-generation site using the completed MVP foundation.
- Lead-gen strategy is documented in `.planning/phases/07-agent-broker-lead-engine/07-RESEARCH.md`.
- Phase 7 implementation adds `/agents`, `/agents/listings`, `/agents/listings/[id]`, `/agents/sell`, agent listing fields, lead qualification fields, campaign attribution, and local form submission verification.

## Roadmap Correction (2026-06-01)

Phase 1 context discussion revealed fundamental misalignment:
- Original: Multi-tenant SaaS with subdomain routing
- Corrected: Website agency model — we build & deploy for each client

Updated ROADMAP.md and PROJECT.md accordingly.

## Demo Client Info

| Field | Value |
|-------|-------|
| Client | Not Just A Stay |
| URL | https://www.notjustastay.com |
| Vertical | Airbnb/Short-let |
| Data to import | Property details, photographs |

## Recent Commits

- `93d8803` — feat(phase-6.2): Activity & Media Polish
- `af0557f` — feat(phase-6.1): Property Form Polish
- `cb1ae05` — feat(phase-5): Complete Storefront SSR implementation
- `f7c3f8d` — feat(phase-4): Complete Search & Maps implementation
- `2dfe21a` — docs(phase-2): Add 2.4 execution summary for Accounts collection
- `f96ce5f` — feat(phase-3): Complete Activities & Inquiry phase
- `a47b018` — feat(phase-2): Create Accounts collection, collections index, wire payload config
- `a5f9dda` — docs(phase-2): Add 2.3 execution summary for Media collection
- `6182e03` — docs(phase-2): Add 2.1 execution summary
- `0fce52d` — feat(phase-2): Replace PropertiesStub with full Airbnb collection
- `e75e8ac` — feat(phase-2): add Leads collection for inquiry capture
- `b87ca93` — fix(phase-2): address checker issues
- `e06807c` — docs(phase-2): create phase 2 data layer plans
- `7b0643d` — docs(phase-2): capture demo client context
- `c25b0e8` — docs: revise roadmap for MVP-first approach
- `f80a085` — feat(phase-1): complete infrastructure setup
