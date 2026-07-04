---
phase: "05"
plan: "02"
subsystem: storefront-ssr
tags: [seo, property-detail, json-ld, lightbox, ssr]
dependency_graph:
  requires:
    - "05-01"  # Property data fetching utilities
  provides:
    - Property detail page with SSR
    - JSON-LD schema generation
  affects:
    - frontend/src/app/[tenant]/properties/[slug]/
tech_stack:
  added:
    - "@/lib/seo/json-ld"  # JSON-LD utilities
  patterns:
    - Server Components for SSR
    - Client Components for interactivity
    - JSON-LD via script injection
key_files:
  created:
    - frontend/src/lib/seo/json-ld.ts
    - frontend/src/components/PropertyGallery.tsx
    - frontend/src/components/PropertyDetail.tsx
    - frontend/src/app/[tenant]/properties/[slug]/page.tsx
    - frontend/src/app/[tenant]/properties/[slug]/loading.tsx
decisions:
  - id: "D-04"
    decision: "Lightbox carousel with prev/next arrows, thumbnails below, keyboard navigation"
    alternatives: "Modal with swipe gestures, simple image grid"
    rationale: "Keyboard navigation and wrap-around for accessibility and UX"
---

# Phase 5 Plan 2: Property Detail Page Summary

**Completed:** 2026-06-02
**Duration:** ~15 minutes
**Tasks:** 4/4 complete

## One-liner

Property detail page with SSR, lightbox gallery, POI overlay, inquiry form, and JSON-LD structured data for SEO.

## What Was Built

### 1. JSON-LD Schema Utilities (`frontend/src/lib/seo/json-ld.ts`)
- `generatePropertyJsonLd()` - RealEstateListing schema with property details, pricing, address
- `generateBreadcrumbJsonLd()` - BreadcrumbList schema for navigation

### 2. PropertyGallery Component (`frontend/src/components/PropertyGallery.tsx`)
- Client component with `'use client'` directive
- Main image display with 16:9 aspect ratio
- Prev/Next navigation arrows (absolute positioned)
- Thumbnail strip with horizontal scroll
- Full-screen lightbox modal with keyboard navigation (ArrowLeft, ArrowRight, Escape)
- Wrap-around navigation
- Body scroll lock when lightbox open

### 3. PropertyDetail Component (`frontend/src/components/PropertyDetail.tsx`)
- Server component (no 'use client')
- Sections:
  - Gallery with PropertyGallery
  - Header (title, location, BHK badge, max guests, rating)
  - Pricing (large price with currency)
  - Description and house rules
  - Amenities grid with Lucide icons (Wifi, Wind, Waves, Utensils, Car, Tv, Dumbbell)
  - Details grid (bedrooms, bathrooms, max guests, floor, furnishing status)
  - Inquiry form (left column)
  - POI overlay (right column)
- Two-column layout on desktop, single column on mobile

### 4. Property Detail Page (`frontend/src/app/[tenant]/properties/[slug]/page.tsx`)
- `generateMetadata()` with title, description, OpenGraph, Twitter cards, canonical URL
- Property fetch via `getPropertyBySlug()`
- 404 handling via `notFound()`
- JSON-LD script injection via `dangerouslySetInnerHTML`
- Breadcrumbs component
- Loading skeleton

### 5. Loading Skeleton (`frontend/src/app/[tenant]/properties/[slug]/loading.tsx`)
- Skeleton placeholders for all major sections
- Maintains layout structure during loading

## Verification Results

| Check | Status |
|-------|--------|
| `ls frontend/src/lib/seo/json-ld.ts` | PASS |
| `ls frontend/src/components/PropertyGallery.tsx` | PASS |
| `ls frontend/src/components/PropertyDetail.tsx` | PASS |
| `ls frontend/src/app/[tenant]/properties/[slug]/page.tsx` | PASS |
| `grep "RealEstateListing" json-ld.ts` | PASS (3 matches) |
| `grep "BreadcrumbList" json-ld.ts` | PASS (3 matches) |
| `grep "RealEstateListing" page.tsx` | PASS (1 match) |
| `grep "BreadcrumbList" page.tsx` | PASS (1 match) |
| TypeScript errors in created files | PASS (0 errors) |

## Success Criteria Status

| Criterion | Status |
|-----------|--------|
| Property detail page fetches property by slug | PASS |
| PropertyGallery shows images with lightbox | PASS |
| Prev/next arrows and thumbnails | PASS |
| InquiryForm present and wired | PASS |
| POIOverlay displays with coordinates | PASS |
| JSON-LD RealEstateListing schema | PASS |
| JSON-LD BreadcrumbList schema | PASS |
| generateMetadata with OG/Twitter | PASS |

## Commits

| Hash | Message |
|------|---------|
| 17fe193 | feat(phase5-02): property detail page with SSR and JSON-LD |

## Deviations from Plan

None - plan executed exactly as written.

## Threat Surface

| Flag | File | Description |
|------|------|-------------|
| none | - | No new trust boundaries introduced; Server Component renders JSON-LD from CMS data only |

## Known Stubs

None.

---

*Generated: 2026-06-02*
