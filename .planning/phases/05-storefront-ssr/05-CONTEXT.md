# Phase 5: Storefront SSR - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

SEO-optimized public pages for all routes (Home, Property List, Property Detail, Activities). All pages server-side rendered via Next.js App Router.
</domain>

<decisions>
## Implementation Decisions

### Page Structure
- **D-01:** **Rich property cards** — Include BHK type, amenity icons, rating, short description
- **D-02:** **Hero + search on home page** — Large hero banner with search bar (location, guests), then featured properties

### Data Fetching
- **D-03:** **Direct Payload import** — Import Payload directly in Server Components for fastest SSR

### Property Gallery
- **D-04:** **Lightbox carousel** — Large image with prev/next arrows, thumbnails below, mobile-friendly

### SEO
- **D-05:** **Full SEO implementation** — Meta tags via generateMetadata, JSON-LD for RealEstateListing, sitemaps, robots.txt, structured data for reviews, breadcrumbs

### Layout
- **D-06:** **FilterSidebar** from Phase 4 used for property list page
- **D-07:** **InquiryForm** from Phase 3 reused on property detail page
- **D-08:** **POIOverlay** from Phase 4 included on property detail page

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/STATE.md` — Demo client: Not Just A Stay
- `.planning/ROADMAP.md` — Phase 5 success criteria
- `.planning/PROJECT.md` — Tech stack (Next.js 14+, Payload 3.x, Tailwind CSS)

### Prior Phases
- `.planning/phases/02-data-layer/02-CONTEXT.md` — Demo client decisions (Not Just A Stay)
- `.planning/phases/04-search-maps/04-SUMMARY.md` — Phase 4 implementation summary

### Existing Code
- `frontend/src/app/[tenant]/page.tsx` — Placeholder page to enhance
- `frontend/src/app/[tenant]/layout.tsx` — Tenant layout with nav
- `frontend/src/components/InquiryForm.tsx` — Existing inquiry form to reuse
- `frontend/src/components/search/FilterSidebar.tsx` — Phase 4 filter sidebar
- `frontend/src/components/poi/POIOverlay.tsx` — Phase 4 POI overlay
- `frontend/src/components/map/MapViewSSR.tsx` — Phase 4 map (SSR-safe)

### External
- [Next.js App Router Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) — generateMetadata for SEO
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) — next/image
- [JSON-LD Schema](https://schema.org/RealEstateListing) — Property listing structured data

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- **InquiryForm** (`frontend/src/components/InquiryForm.tsx`) — Already built, reuse on property detail
- **FilterSidebar** (`frontend/src/components/search/FilterSidebar.tsx`) — Phase 4 component
- **ActiveFilters** (`frontend/src/components/search/ActiveFilters.tsx`) — Phase 4 component
- **MapViewSSR** (`frontend/src/components/map/MapViewSSR.tsx`) — SSR-safe map
- **PropertyPopup** (`frontend/src/components/map/PropertyPopup.tsx`) — Map popup
- **POIOverlay** (`frontend/src/components/poi/POIOverlay.tsx`) — Nearby places
- **filterStore** (`frontend/src/lib/stores/filterStore.ts`) — Zustand filter state

### Patterns Established
- Server Components for data fetching (direct Payload import)
- Client Components for interactivity (forms, maps, filters)
- Tailwind CSS for styling (no CSS modules)
- Lucide React for icons

### Integration Points
- Tenant layout: `frontend/src/app/[tenant]/layout.tsx`
- Root layout: `frontend/src/app/layout.tsx`
- Property detail: `frontend/src/app/[tenant]/properties/[slug]/page.tsx` (new)
- Activities: `frontend/src/app/[tenant]/activities/page.tsx` (new)

</codebase_context>

<specifics>
## Phase 5 Plans

### 5.1: Home & Property List
- Create home page with hero + search + featured properties
- Create property list page with FilterSidebar
- Implement SSR with generateMetadata
- Add loading skeletons

### 5.2: Property Detail Page
- Create property detail page (SSR)
- Implement lightbox carousel gallery
- Display all fields, amenities, pricing
- Add inquiry form (reuse existing)
- Add POI map overlay (reuse existing)
- Implement JSON-LD: RealEstateListing schema

### 5.3: Activities Pages
- Create activities list page (SSR)
- Create activity detail page (SSR)
- Add inquiry form to detail page

### 5.4: SEO & Performance
- Add canonical URLs
- Implement Open Graph meta tags
- Add sitemap generation
- Optimize images with next/image
- Add robots.txt
- Add breadcrumbs

</specifics>

<deferred>
## Deferred Ideas

- User reviews/ratings — Version 2
- Wishlist/favorites — Version 2
- Booking/availability calendar — Version 2
- Payment processing — Version 2

</deferred>

---

*Phase: 05-Storefront-SSR*
*Context gathered: 2026-06-02*
