---
phase: 04
slug: 04-search-maps
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-01
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + React Testing Library |
| **Config file** | `frontend/vitest.config.ts` (to be created in Wave 0) |
| **Quick run command** | `cd frontend && npm run test -- --run --reporter=dot` |
| **Full suite command** | `cd frontend && npm run test` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run affected test files only
- **After every plan wave:** Run full test suite
- **Before `/gsd:verify-phase`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 4.1-01 | 01 | 1 | Filter Zustand store | T-4.1-01 | URL sanitization | unit | `grep "useFilterStore" frontend/src/lib/stores/filterStore.ts` | ⬜ pending |
| 4.1-02 | 01 | 1 | Filter URL serialization | T-4.1-01 | Parameterization | unit | `grep "serializeFilters" frontend/src/lib/search/filters.ts` | ⬜ pending |
| 4.1-03 | 01 | 1 | Filter components | T-4.1-01 | Input validation | component | `grep "FilterSidebar" frontend/src/components/search/FilterSidebar.tsx` | ⬜ pending |
| 4.2-01 | 02 | 1 | MapLibre installed | — | N/A | install | `grep "react-map-gl" frontend/package.json` | ⬜ pending |
| 4.2-02 | 02 | 1 | PropertyMap component | T-4.2-01 | SSR safe | component | `grep "PropertyMap" frontend/src/components/map/PropertyMap.tsx` | ⬜ pending |
| 4.2-03 | 02 | 1 | Marker clustering | — | N/A | component | `grep "cluster" frontend/src/components/map/PropertyMap.tsx` | ⬜ pending |
| 4.2-04 | 02 | 1 | PropertyPopup | T-4.2-02 | Content sanitization | component | `grep "PropertyPopup" frontend/src/components/map/PropertyPopup.tsx` | ⬜ pending |
| 4.3-01 | 03 | 1 | POICache collection | T-4.3-01 | Server-side only | unit | `grep "slug.*poi-cache" payload/src/collections/POICache.ts` | ⬜ pending |
| 4.3-02 | 03 | 1 | POI API client | T-4.3-02 | API key protection | unit | `grep "fetchNearbyPOIs" frontend/src/lib/poi/client.ts` | ⬜ pending |
| 4.3-03 | 03 | 1 | Cache integration | — | N/A | integration | `grep "beforeChange" payload/src/collections/POICache.ts` | ⬜ pending |
| 4.3-04 | 03 | 1 | POIOverlay component | T-4.3-01 | SSR safe | component | `grep "POIOverlay" frontend/src/components/poi/POIOverlay.tsx` | ⬜ pending |
| 4.4-01 | 04 | 2 | Radius filter hook | T-4.4-01 | SQL injection | unit | `grep "useGeolocationFilter" frontend/src/hooks/useGeolocationFilter.ts` | ⬜ pending |
| 4.4-02 | 04 | 2 | Radius API route | T-4.4-01 | Input validation | integration | `grep "ST_DWithin" frontend/src/app/api/properties/route.ts` | ⬜ pending |
| 4.4-03 | 04 | 2 | Radius selector | T-4.4-01 | URL validation | component | `grep "RadiusSelector" frontend/src/components/search/RadiusSelector.tsx` | ⬜ pending |
| 4.4-04 | 04 | 2 | Filter integration | T-4.4-01 | SSR safe | integration | `grep "radius" frontend/src/lib/stores/filterStore.ts` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/vitest.config.ts` — Vitest configuration
- [ ] `frontend/src/setup-tests.ts` — Jest/Vitest DOM setup
- [ ] `frontend/src/lib/__tests__/filters.test.ts` — filter logic unit tests
- [ ] `frontend/src/components/search/__tests__/FilterSidebar.test.tsx` — filter component tests

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Map rendering in browser | MAP-01, MAP-04 | Browser APIs required | 1. Open properties page 2. Verify map loads with markers 3. Verify clustering at low zoom |
| POI overlay interaction | MAP-03, POI-03 | DOM interaction | 1. Open property detail 2. Verify POI markers appear 3. Click category toggles |
| Radius filter end-to-end | FILT-12 | Database + API + UI | 1. Set radius to 5km 2. Verify only nearby properties shown 3. Verify URL param updates |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
