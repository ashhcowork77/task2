# Phase 1: Infrastructure Setup - Context

**Gathered:** 2026-05-31
**Revised:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Docker Compose with Payload + Next.js + Postgres/PostGIS, all services connected and booting.
</domain>

<decisions>
## Implementation Decisions

### Architecture Model
- **D-01:** Website agency model — we build complete sites + CMS for property businesses
- **D-02:** MVP first — one demo client (Airbnb host or real estate agent)
- **D-03:** Version 2 = Shopify-style SaaS (self-service, multi-tenant) — NOT MVP scope

### Monorepo Structure
- **D-04:** Payload CMS embedded inside Next.js via `@payloadcms/next` plugin (not standalone)
- **D-05:** pnpm workspaces monorepo structure with `payload/`, `frontend/`, and `packages/` directories
- **D-06:** Workspace packages for future shared utilities (`packages/shared/` for types, etc.)

### Development Workflow
- **D-07:** Docker Compose + volume mounts for hot reload (consistent with production)
- **D-08:** Standard ports: Next.js/Payload on 3000, Postgres on 5432
- **D-09:** VS Code debugging config (launch.json) for Payload and Next.js with attached debugger

### Environment Management
- **D-10:** `.env.example` template committed to repo with all variables documented
- **D-11:** Optional service placeholders: Google Places API, email (SendGrid/Resend), S3 storage

### Docker Configuration
- **D-12:** Use `postgis/postgis:15-3.4` image for Postgres with PostGIS extension
- **D-13:** Volume mounts for Postgres data persistence
- **D-14:** Environment variables configured for Payload DB connection

### Project Files
- **D-15:** `payload.config.ts` in root for Payload configuration
- **D-16:** Standard pnpm workspace config (`pnpm-workspace.yaml`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Stack
- `.planning/research/STACK.md` — Recommended libraries, PostGIS + Payload integration, version compatibility
- `.planning/research/ARCHITECTURE.md` — Project structure, recommended patterns, data flow

### Requirements
- `.planning/REQUIREMENTS.md` — Core requirements
- `.planning/ROADMAP.md` — Phase success criteria and plan breakdown

### Project
- `.planning/PROJECT.md` — Tech stack constraints (Next.js, Payload, PostgreSQL, PostGIS, MapLibre, Docker Compose)
- `.planning/STATE.md` — Current project state

### External Docs
- [Payload CMS Docs](https://payloadcms.com/docs) — Framework integration, collections
- [PostGIS Documentation](https://postgis.net/docs/) — Geospatial functions
- [Next.js Docs](https://nextjs.org/docs) — App Router, SSR

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- No existing code at project start — greenfield project
- Phase 1 creates: Docker Compose, Payload config stubs, Next.js skeleton

### Established Patterns
- Field composition pattern for vertical extensions (Properties/base + Properties/airbnb)
- Payload CMS for backend + CMS + admin

### Integration Points
- `frontend/src/lib/payload.ts` — Payload client singleton
- `payload/src/collections/` — Collection configs (Phase 2)

</codebase_context>

<specifics>
## Specific Ideas

- User prefers standard, well-established approaches over exotic configurations
- Want debugging support from the start for development productivity
- All optional service env vars included upfront to reduce future changes
- NOT multi-tenant SaaS — each client gets their own deployment (Version 2)
</specifics>

<deferred>
## Deferred Ideas

- Multi-tenant SaaS infrastructure — Version 2
- Self-service account signup — Version 2
- Subdomain or custom domain routing per account — Version 2
- Template system for cloning sites — Version 2

</deferred>

---

*Phase: 1-Infrastructure Setup*
*Context gathered: 2026-05-31*
*Revised: 2026-06-01 — Updated for MVP-first approach*
