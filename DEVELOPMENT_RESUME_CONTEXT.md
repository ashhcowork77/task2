# Development Resume Context

Last updated: 2026-06-11

This document captures the current working context for the Real Estate App so a fresh Codex/GSD session can resume without relying on previous chat memory.

## How To Resume

1. Open this repository in a fresh Codex chat.
2. Ask Codex to read this file and the GSD planning handoff:
   - `DEVELOPMENT_RESUME_CONTEXT.md`
   - `.planning/HANDOFF.json`
   - `.planning/.continue-here.md`
   - `.planning/STATE.md`
3. Then run:

```text
$gsd-resume-work
```

GSD Core for Codex has already been installed globally on this machine. It installed 67 GSD skills, 33 agent roles, and Codex hooks under `~/.codex`.

## Current Git State

- Branch: `main`
- Local branch is ahead of `origin/main` by 1 commit.
- Current local commit:
  - `0ba460e WIP: Goodwood design changes (not deployable due to Vercel build issue)`
- The working tree was clean before this document was added.

## Product Direction

The app is for an Airbnb/short-let owner, currently focused on the Not Just A Stay brand.

The desired product is a polished, premium direct-booking website:

- Visual inspiration: https://www.goodwood.com/
- UX inspiration: Airbnb listing/property browsing and booking flows.
- Audience: Airbnb owners / short-let property businesses.
- Goal: property owners can manage listings, photos, descriptions, pricing, availability, experiences, and inquiries through the CMS.

The website should feel like a luxury estate / hospitality brand, not a generic SaaS dashboard.

## Design Reference Notes

Goodwood reference cues:

- Full-bleed estate imagery.
- Premium serif-led typography.
- Editorial section structure.
- Transparent or overlay navigation over hero media.
- Strong content categories such as Events, Experiences, Visit/Eat/Stay, Hospitality, About.
- Clear Book action in the nav.
- Dark charcoal / ivory / muted gold atmosphere.

Current app status:

- Homepage has a Goodwood-inspired direction.
- `/properties`, property details, activities, forms, filters, and cards still feel like older blue/gray SaaS UI.
- These pages need to be restyled to match the premium Goodwood-inspired direction while preserving Airbnb-like usability.

## Airbnb Profile Import Context

Reference Airbnb profile:

https://www.airbnb.co.in/users/profile/1465777795822618123?previous_page_name=PdpHomeMarketplace

Attempted public fetch returned an Airbnb JS app shell marked `isBotRequest: true`. The public HTML did not expose listing IDs, listing titles, prices, or full listing data.

Do not pretend the listings were extracted from that response.

To import the real listings, use one of these authorized sources:

- The host's public listing URLs.
- A CSV/manual export from the host.
- An authorized browser session where the user can view the profile/listings.
- Data provided directly by the client.

Photos and descriptions should only be reused with the host/client's permission.

## Known Bugs And Blockers

### 1. Payload/Postgres Connection Broken Locally

`npm run build` exits with code 0, but logs Payload/Postgres connection failures during prerender.

Local `.env` currently uses:

```text
DATABASE_URL=file:payload-data.db
```

But the active Payload config uses the Postgres adapter. This mismatch causes Payload to fall back toward localhost Postgres and fail with connection errors.

Observed symptoms:

- Build logs `cannot connect to Postgres`.
- `/admin` returns 500 locally.
- `/api/properties` returns an empty result.
- `/properties/villa-solace` returns 404 without DB data.

### 2. Admin Is Not Usable

`/admin` returns 500 locally because Payload cannot initialize without a working Postgres connection.

Admin must work because property data, photos, pricing, availability, activities, and leads are supposed to be CMS-editable.

### 3. Property Data Not Showing

`/properties` returns 200, but no CMS properties are shown because `getPublishedProperties()` cannot connect to Payload.

Homepage has fallback properties, but the actual listing pages should be CMS-driven.

### 4. Activity Detail Links Are Broken

`/activities` returns 200, but activity cards link to `/activities/{id}`.

There is no activity detail route currently, so `/activities/1` returns 404.

### 5. Inquiry Forms Do Not Persist Leads

Property and activity inquiry forms validate and show success, but server actions only log submissions.

They do not currently create records in the Payload `leads` collection.

### 6. Booking UX Is Missing

The desired Airbnb-like UX needs:

- Check-in/check-out date selection.
- Guest count.
- Availability calendar.
- Price calculation for selected dates.
- Minimum/maximum nights.
- Booking or inquiry request flow.
- Property-specific experiences.

Current detail pages only have a basic inquiry form.

### 7. Production Is Behind Vercel Authentication

The production URL from the handoff:

https://real-estate-app-rudhraksh-s-projects.vercel.app

Returned Vercel `401` with SSO headers during QA. If this is meant to be public, disable Vercel deployment protection or configure public access.

## CMS Schema Status

Payload collections already exist for:

- Properties
- Media
- Activities
- Leads
- Accounts
- Users
- POI cache

The schema is partly aligned with the goal:

- Properties have title, description, short description, location, price, seasonal pricing, min/max nights, amenities, gallery, featured image, and availability JSON placeholder.
- Activities have title, description, highlights, duration, group size, price, gallery, featured image, availability JSON, booking lead time, and linked properties.
- Leads can reference properties and activities.

Main gaps:

- Booking/availability is JSON-only and not surfaced in a proper UI.
- Frontend does not show property-linked experiences on property details.
- Lead creation is not wired into Payload.
- There is no dedicated Booking or Reservations collection yet.
- Local/prod DB configuration must be fixed before CMS work can be trusted.

## Files And Areas To Inspect First

Core app:

- `frontend/package.json`
- `frontend/next.config.mjs`
- `frontend/payload.config.ts`
- `payload.config.ts`
- `.env`
- `.env.example`

Frontend pages:

- `frontend/src/app/(frontend)/page.tsx`
- `frontend/src/app/(frontend)/properties/page.tsx`
- `frontend/src/app/(frontend)/properties/[id]/page.tsx`
- `frontend/src/app/(frontend)/activities/page.tsx`

Components:

- `frontend/src/components/PropertyCard.tsx`
- `frontend/src/components/PropertyGallery.tsx`
- `frontend/src/components/InquiryForm.tsx`
- `frontend/src/components/ActivityCard.tsx`
- `frontend/src/components/ActivityInquiryForm.tsx`

Data/actions:

- `frontend/src/lib/data/properties.ts`
- `frontend/src/lib/data/activities.ts`
- `frontend/src/lib/actions.ts`
- `frontend/src/lib/schemas.ts`

CMS collections:

- `payload/src/collections/PropertiesStub.ts`
- `payload/src/collections/Activities.ts`
- `payload/src/collections/Leads.ts`
- `payload/src/collections/Media.ts`
- `payload/src/collections/Users.ts`

There is a mirrored `frontend/payload-src/collections` tree too. Check which one the active config imports before editing.

## Recommended Next Work Order

1. Fix environment/database configuration.
   - Decide whether local development uses Postgres or a supported local adapter.
   - Align `.env`, docs, and Payload adapter.
   - Verify `/admin` works locally.

2. Make CMS data visible.
   - Verify Payload collections initialize.
   - Seed or import real properties.
   - Verify `/api/properties`, `/properties`, and `/properties/[id]`.

3. Wire lead persistence.
   - Change `submitInquiry` and `submitActivityInquiry` to create Payload `leads`.
   - Include selected dates/guests once booking fields exist.

4. Add Airbnb-like booking UX.
   - Date picker, guest selector, price breakdown, availability checks.
   - Add a reservation/booking request model if needed.

5. Add property-specific experiences.
   - Show linked activities/experiences on property detail pages.
   - Add activity detail route.

6. Restyle all public pages.
   - Bring `/properties`, details, activities, cards, and forms into the Goodwood-inspired design system.
   - Keep Airbnb-like usability for listing cards and booking interactions.

7. Import real Airbnb host listings.
   - Use authorized listing URLs or client-provided data.
   - Import photos/descriptions/prices into Payload.

8. Fix deployment/public access.
   - Confirm Vercel env vars.
   - Confirm production build with real env.
   - Disable deployment protection if public launch is required.

## Verification Commands

Use Homebrew Node path if this shell does not have Node on `PATH`:

```bash
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin npm run build
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin npm run dev
```

Useful route checks:

```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/admin
curl http://localhost:3000/api/properties
curl -I http://localhost:3000/properties
curl -I http://localhost:3000/activities
curl -I http://localhost:3000/activities/1
```

Expected before fixes:

- `/admin` fails locally.
- `/api/properties` returns empty docs.
- `/activities/1` returns 404.

## Important Caution

`CLAUDE.md` appears stale and still describes the earlier multi-tenant SaaS plan. `.planning/STATE.md` says the project was corrected to the MVP agency model for Not Just A Stay.

Prefer `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/HANDOFF.json`, and this file over stale `CLAUDE.md` content until `CLAUDE.md` or `AGENTS.md` is updated.

