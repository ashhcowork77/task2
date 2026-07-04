# Phase 2: Data Layer - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Core Payload CMS collections (Properties, Leads, Media) with full field definitions for the demo client (Not Just A Stay).
</domain>

<decisions>
## Implementation Decisions

### Demo Client
- **D-01:** Demo client is **Not Just A Stay** (https://www.notjustastay.com)
- **D-02:** Vertical: **Airbnb/Short-let** properties
- **D-03:** Data to import: Property details and photographs from existing site
- **D-04:** Single account for MVP — no multi-account infrastructure needed

### No Multi-Tenant Infrastructure (MVP)
- **D-05:** No account/tenant isolation — all data is for Not Just A Stay
- **D-06:** No access control per account — single user/admin only
- **D-07:** Version 2 handles multi-account when needed

### Collections
- **D-08:** Properties collection — Airbnb-specific fields (nightly pricing, amenities, house rules, etc.)
- **D-09:** Leads collection — inquiry capture (name, email, phone, message, property reference)
- **D-10:** Media collection — Payload built-in upload for images
- **D-11:** Single Accounts collection — just to store Not Just A Stay's info (name, logo, tagline)

### User Roles
- **D-12:** Owner role — full access (create, edit, delete properties and leads)
- **D-13:** No staff roles for MVP

### Media Storage
- **D-14:** Local filesystem for MVP (`./public/media`)
- **D-15:** S3/Cloud storage in Version 2

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/STATE.md` — Demo client: Not Just A Stay
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/PROJECT.md` — Tech stack and constraints

### Phase 1
- `.planning/phases/01-infrastructure-setup/01-CONTEXT.md` — Infrastructure decisions
- `.planning/phases/01-infrastructure-setup/*-SUMMARY.md` — What was built

### Codebase
- `payload.config.ts` — Current Payload config
- `payload/src/collections/TenantsStub.ts` — Stub to replace
- `payload/src/collections/PropertiesStub.ts` — Stub to replace

### External
- [Payload CMS Docs](https://payloadcms.com/docs) — Collections, fields, authentication
- [Payload Upload](https://payloadcms.com/docs/upload/overview) — Media handling

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Stubs to Replace
- `payload/src/collections/TenantsStub.ts` — Minimal stub (name, slug, verticalType)
- `payload/src/collections/PropertiesStub.ts` — Minimal stub (title, description, address, geolocation)

### What Needs Building
- Full Properties collection with Airbnb fields
- Leads collection
- Media collection (Payload built-in)
- Accounts collection (single account for Not Just A Stay)

</codebase_context>

<specifics>
## Specific Ideas

- Import property data from https://www.notjustastay.com
- Import photographs from existing site
- Airbnb vertical is "full" implementation (not stub)
- Agent and Builder verticals are stubs only (future clients)

</specifics>

<deferred>
## Deferred Ideas

- Multi-account infrastructure — Version 2
- Account-based access control — Version 2
- Staff roles and permissions — Version 2
- S3/media storage — Version 2

</deferred>

---

*Phase: 2-Data Layer*
*Context gathered: 2026-06-01*
