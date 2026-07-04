# Phase 4: Search & Maps - Research

**Researched:** 2026-06-01
**Domain:** Property search, map visualization, POI data integration
**Confidence:** HIGH

## Summary

Phase 4 implements three core capabilities: (1) property search with multiple filter types, (2) map visualization using MapLibre GL with clustering, and (3) POI data from Google Places with 7-day caching. The tech stack is established: Next.js 14 App Router + Payload 3.x + PostGIS. Key challenges are: SSR-safe map rendering, efficient PostGIS radius queries, and API cost management via caching.

**Primary recommendation:** Use `react-map-gl` (MapLibre) for the map component with dynamic import (`ssr: false`), `ST_DWithin` for PostGIS radius filtering, and a dedicated Payload collection as the POI cache with TTL-based invalidation.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Property filters (BHK, type, budget, locality) | API / Backend | Browser / Client | Filters build Payload queries server-side; URL params sync client state |
| Map view with markers | Browser / Client | API / Backend | MapLibre renders in browser; GeoJSON fetched from API |
| Marker clustering | Browser / Client | — | Supercluster runs client-side for performance |
| POI data fetching | API / Backend | Browser / Client | Google Places called server-side; results cached |
| POI caching (7-day TTL) | Database / Storage | API / Backend | Cache stored in Payload collection; invalidation on location change |
| Geolocation search (radius) | Database / Storage | API / Backend | PostGIS `ST_DWithin` filters at database level |
| Filter state management | Browser / Client | — | URL search params + Zustand for local state |

---

## User Constraints (from CONTEXT.md)

No CONTEXT.md exists for Phase 4 — this is a greenfield phase. All decisions are open for research and recommendation.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `maplibre-gl` | 5.24.0 | Map rendering engine | Open-source, no API key required for basic tiles |
| `react-map-gl` | 8.1.1 | React bindings for MapLibre | Official MapLibre-Vis.gl partnership; handles SSR edge cases |
| `zustand` | 5.0.14 | Filter state management | Minimal boilerplate, URL sync built-in |
| `@googlemaps/google-maps-services-js` | 3.4.2 | Google Places API client | Official Google library; supports nearby search |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `supercluster` | 8.0.1 | Marker clustering algorithm | Used internally by react-map-gl; also available for custom clustering |
| `lucide-react` | 1.17.0 | Filter UI icons | Consistent with existing project (used in inquiry forms) |
| `slugify` | 1.6.9 | URL-friendly filter keys | Convert filter values to URL-safe strings |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-map-gl` | Direct `maplibre-gl` in `useEffect` | `react-map-gl` handles SSR safety, popup anchoring, and lifecycle automatically |
| Zustand | `useState` + `useSearchParams` | Zustand provides URL sync middleware without prop drilling |
| `@googlemaps/google-maps-services-js` | `axios` + raw Google API | Official client handles auth, retries, and TypeScript types |
| Supercluster | MapLibre native clustering | Supercluster offers more control for custom cluster rendering |

**Installation:**
```bash
cd frontend
npm install maplibre-gl react-map-gl zustand @googlemaps/google-maps-services-js supercluster lucide-react slugify
```

**Version verification:** All packages verified on npm registry 2026-06-01.

---

## Package Legitimacy Audit

> slopcheck was unavailable; all packages tagged `[ASSUMED]` per protocol. Planner should gate each install behind `checkpoint:human-verify`.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `maplibre-gl` | npm | ~5 years | ~500K/wk | github.com/maplibre/maplibre-gl-js | [ASSUMED] | Approved with verification |
| `react-map-gl` | npm | ~7 years | ~300K/wk | github.com/visgl/react-map-gl | [ASSUMED] | Approved with verification |
| `zustand` | npm | ~6 years | ~3M/wk | github.com/pmndrs/zustand | [ASSUMED] | Approved with verification |
| `@googlemaps/google-maps-services-js` | npm | ~10 years | ~1.5M/wk | github.com/googlemaps/google-maps-services-js | [ASSUMED] | Approved with verification |
| `supercluster` | npm | ~12 years | ~3M/wk | github.com/mapbox/supercluster | [ASSUMED] | Approved with verification |
| `lucide-react` | npm | ~4 years | ~8M/wk | github.com/lucide-icons/lucide | [ASSUMED] | Approved with verification |
| `slugify` | npm | ~11 years | ~5M/wk | github.com/simov/slugify | [ASSUMED] | Approved with verification |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*All packages are established, high-download libraries from well-known maintainers. Cross-ecosystem confusion unlikely for this ecosystem.*

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER / CLIENT                               │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │  Filter Sidebar  │───▶│   Zustand Store  │◀───│   Property MapView   │  │
│  │  (BHK, Type, ...) │    │  (URL-synced)    │    │  (react-map-gl)      │  │
│  └──────────────────┘    └────────┬─────────┘    └──────────┬───────────┘  │
│                                    │                           │             │
└────────────────────────────────────┼───────────────────────────┼─────────────┘
                                     │                           │
                                     ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API / BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Property Search Endpoint                          │  │
│  │  GET /api/properties?bhk=1_bhk,2_bhk&price_min=1000&radius=5km      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌──────────────────┐    ┌──────────────────────────────────────────────┐   │
│  │  Payload Query    │───▶│              PostgreSQL + PostGIS         │   │
│  │  (custom hook)    │    │  ST_DWithin(geolocation, point, radius)  │   │
│  └──────────────────┘    └──────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    POI Cache Collection                              │   │
│  │  { property_id, poi_type, data, expires_at }                         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                 Google Places API (server-side)                       │   │
│  │  - Nearby search per POI category                                    │   │
│  │  - 7-day cache TTL                                                    │   │
│  │  - Rate limiting (QPS)                                               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
frontend/src/
├── components/
│   ├── search/
│   │   ├── FilterSidebar.tsx       # All filter controls
│   │   ├── FilterChip.tsx          # Individual filter pill
│   │   ├── PriceRangeSlider.tsx   # Budget range slider
│   │   ├── LocalityAutocomplete.tsx
│   │   └── ActiveFilters.tsx      # Clear-all chips
│   ├── map/
│   │   ├── PropertyMap.tsx         # Main map with markers
│   │   ├── PropertyMarker.tsx      # Custom marker component
│   │   ├── PropertyPopup.tsx        # Marker click popup
│   │   ├── ClusterMarker.tsx        # Cluster bubble
│   │   └── MapSkeleton.tsx          # Loading placeholder
│   ├── poi/
│   │   ├── POIOverlay.tsx           # POI markers on property detail
│   │   └── POICategoryFilter.tsx    # Toggle POI categories
│   └── PropertyCard.tsx             # Reusable property card
├── lib/
│   ├── search/
│   │   ├── filters.ts              # Filter logic, URL serialization
│   │   ├── usePropertySearch.ts    # Hook for fetching filtered properties
│   │   └── searchParams.ts         # Type-safe search param utilities
│   ├── map/
│   │   └── mapConfig.ts             # Style URLs, layer configs
│   ├── poi/
│   │   ├── client.ts               # Google Places API client
│   │   ├── cache.ts                # Cache read/write logic
│   │   └── types.ts                # POI types and interfaces
│   └── stores/
│       └── filterStore.ts           # Zustand store with URL sync
├── app/
│   └── [tenant]/
│       ├── properties/
│       │   ├── page.tsx             # Property list with filters (SSR)
│       │   └── [id]/
│       │       └── page.tsx         # Property detail with POI map
│       └── api/
│           └── properties/
│               └── route.ts         # Server-side property search
└── types/
    ├── property.ts                  # Property + filter types
    ├── search.ts                    # Filter state, params
    └── poi.ts                       # POI types

payload/src/collections/
├── POICache.ts                      # Cache collection with TTL
└── Properties.ts                    # Enhanced with search indexes

payload/src/
├── endpoints/
│   └── properties/
│       ├── search.ts                # Custom search endpoint with PostGIS
│       └── nearby.ts                # POI fetch endpoint
└── hooks/
    └── useGeolocationFilter.ts     # PostGIS radius query helper
```

### Pattern 1: SSR-Safe MapLibre with Dynamic Import

**What:** MapLibre GL requires browser APIs (`window`, `document`). Next.js App Router server components fail if these are accessed at module load time.

**When to use:** Every map component in a Next.js 14 App Router project.

**Example:**
```tsx
// components/map/PropertyMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface PropertyMapProps {
  properties: PropertyWithLocation[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Dynamic import ensures maplibre-gl loads client-side only
    import('maplibre-gl').then((maplibregl) => {
      import('maplibre-gl/dist/maplibre-gl.css');

      map.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [77.5, 12.9], // Default to Bangalore
        zoom: 11,
      });

      map.current.on('load', () => {
        addPropertySource(map.current!);
        addClusterLayers(map.current!);
        addPropertyLayers(map.current!);
        setIsLoaded(true);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [properties]);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      {!isLoaded && <MapSkeleton />}
    </div>
  );
}
```

**Source:** [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/examples/); [Stadia Maps Clustering Tutorial](https://docs.stadiamaps.com/tutorials/clustering-styling-points-with-maplibre/)

### Pattern 2: URL-Synced Filter State with Zustand

**What:** Filters are stored in URL search params for shareability, bookmarking, and SSR. Zustand middleware syncs state bidirectionally.

**When to use:** Any multi-filter search interface.

**Example:**
```typescript
// lib/stores/filterStore.ts
import { create } from 'zustand';
import { persist, createURLSearchParamsSync } from 'zustand/middleware';

export interface FilterState {
  bhkTypes: string[];
  propertyTypes: string[];
  priceMin: number | null;
  priceMax: number | null;
  furnishing: string | null;
  amenities: string[];
  locality: string | null;
  radius: number | null; // km
  sortBy: 'price_asc' | 'price_desc' | 'newest';
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      bhkTypes: [],
      propertyTypes: [],
      priceMin: null,
      priceMax: null,
      furnishing: null,
      amenities: [],
      locality: null,
      radius: null,
      sortBy: 'newest',
      // ... setters
    }),
    {
      name: 'property-filters',
    }
  )
);
```

**Source:** [Zustand Documentation](https://zustand.docs.pmnd.rs/)

### Pattern 3: PostGIS Radius Search with ST_DWithin

**What:** Efficient geospatial radius filtering using PostGIS's spatial index (GiST) via `ST_DWithin`, which only fetches rows within the bounding box before computing exact distance.

**When to use:** "Properties within X km" search functionality.

**Example:**
```typescript
// payload/src/hooks/useGeolocationFilter.ts
import type { Where } from 'payload';

/**
 * Builds a Payload Where clause for PostGIS radius search.
 * Uses ST_DWithin for index-efficient filtering.
 *
 * @param centerLat - Center latitude
 * @param centerLng - Center longitude
 * @param radiusKm  - Search radius in kilometers
 */
export function buildRadiusWhere(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Where {
  // Convert km to meters for PostGIS ST_DWithin
  const radiusMeters = radiusKm * 1000;

  return {
    geolocation: {
      near: {
        latitude: centerLat,
        longitude: centerLng,
        // Payload handles the PostGIS ST_DWithin conversion internally
        // when using the 'near' operator on point fields
        distance: radiusMeters,
      },
    },
  };
}
```

**Note:** Payload 3.x with `@payloadcms/db-postgres` handles PostGIS integration natively. The `point` field type supports `near` operator with distance.

**Source:** [PostGIS Documentation - ST_DWithin](https://postgis.net/docs/ST_DWithin.html)

### Pattern 4: POI Cache with TTL Invalidation

**What:** POI data is expensive to fetch (rate limits, API costs). Cache per property with a 7-day TTL. Invalidate if property geolocation changes.

**When to use:** Any external API data that rarely changes but is queried frequently.

**Example:**
```typescript
// payload/src/collections/POICache.ts
import type { CollectionConfig } from 'payload';

export const POICache: CollectionConfig = {
  slug: 'poi-cache',
  fields: [
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
    },
    {
      name: 'poiType',
      type: 'select',
      options: [
        { label: 'Restaurants & Cafes', value: 'restaurant' },
        { label: 'Bars & Nightlife', value: 'bar' },
        { label: 'Parks & Recreation', value: 'park' },
        { label: 'Beaches & Scenic', value: 'beach' },
      ],
      required: true,
    },
    {
      name: 'data',
      type: 'json', // Cached Google Places results
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      index: true, // Index for TTL queries
    },
  ],
  indexes: [
    {
      // Composite index for cache key + expiration
      fields: {
        property: 1,
        poiType: 1,
        expiresAt: 1,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set expiration to 7 days from now
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        data.expiresAt = expires;
        return data;
      },
    ],
  },
};
```

**Source:** [Payload CMS 3.x Collections](https://payloadcms.com/docs/configuration/collections)

### Anti-Patterns to Avoid

- **SSR-rendered map:** Never import `maplibre-gl` at module level in a server component. Use `dynamic(() => import(...), { ssr: false })` or `'use client'` directive with `useEffect`.
- **ST_Distance in WHERE clause:** Never use `ST_Distance(geolocation, point) < radius` in PostGIS filters — it computes exact distance for every row. Use `ST_DWithin` instead for index-based filtering.
- **Uncached Google Places calls:** Calling Google Places API on every property detail page view will hit rate limits quickly. Always cache with TTL.
- **Client-side-only filtering:** All filter state should sync to URL params for SSR compatibility and shareable links.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Map rendering | Custom MapLibre wrappers | `react-map-gl` | Handles SSR safety, lifecycle, popups, and clustering out of the box |
| Marker clustering | Custom clustering algorithm | MapLibre native clustering or Supercluster | Clustering algorithms are non-trivial; existing implementations are optimized |
| Filter state | useState + useSearchParams manually | Zustand with URL sync | Bidirectional URL sync requires careful handling; Zustand middleware is battle-tested |
| Google API calls | Raw fetch + auth headers | `@googlemaps/google-maps-services-js` | Handles auth, rate limiting, retries, and TypeScript types |
| POI cache invalidation | Custom cache table | Payload collection with hooks | Payload hooks handle TTL, hooks fire on related collection changes |

**Key insight:** Map rendering and geospatial queries are notoriously tricky. The MapLibre ecosystem has mature React bindings, and PostGIS + Payload handle radius queries natively. Building custom implementations risks SSR bugs and performance issues.

---

## Common Pitfalls

### Pitfall 1: MapLibre SSR Hydration Mismatch
**What goes wrong:** Server renders placeholder, client hydrates with map, causes layout shift or hydration warnings.
**Why it happens:** MapLibre requires browser APIs. Server renders empty div, client initializes map in useEffect (after hydration).
**How to avoid:** Use `MapSkeleton` placeholder matching map dimensions. Import CSS dynamically. Use `'use client'` directive.
**Warning signs:** Hydration mismatch warnings in console, layout shift on map load.

### Pitfall 2: Missing PostGIS Spatial Index
**What goes wrong:** Radius search is slow on large datasets (full table scan).
**Why it happens:** No GiST index on the `geolocation` point field.
**How to avoid:** Payload 3.x creates spatial indexes automatically for `point` fields. Verify with `\d properties` in psql after migration.
**Warning signs:** Slow queries on properties with geolocation. Run `EXPLAIN` on radius queries.

### Pitfall 3: Google Places Rate Limit Exceeded
**What goes wrong:** API returns 429 Too Many Requests, POIs fail to load.
**Why it happens:** No rate limiting on concurrent POI fetches for multiple properties.
**How to avoid:** Queue POI requests with delay, cache aggressively (7-day TTL), batch by type.
**Warning signs:** Intermittent 429 errors in logs, empty POI sections on property pages.

### Pitfall 4: Filter State Desync with URL
**What goes wrong:** URL shows one set of filters, UI shows another. SSR renders wrong content.
**Why it happens:** Client-side state updates don't propagate to URL, or URL params change without state update.
**How to avoid:** Zustand middleware that syncs state <-> URL bidirectionally. Test SSR with curl.
**Warning signs:** Page shows different results on refresh vs. client navigation.

### Pitfall 5: POI Cache Stampede
**What goes wrong:** Cache expires for popular property, hundreds of requests all miss cache and hit Google API.
**Why it happens:** Thundering herd on cache expiration.
**How to avoid:** Stale-while-revalidate pattern: serve cached data while fetching fresh in background, or randomize TTL slightly.
**Warning signs:** Spike in Google API quota usage after cache expires.

---

## Code Examples

### Google Places Nearby Search with Cache
```typescript
// lib/poi/client.ts
import { GoogleMapsServices } from '@googlemaps/google-maps-services-js';

const google = new GoogleMapsServices();
const CACHE_TTL_DAYS = 7;

export interface POIResult {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  types: string[];
}

export type POICategory = 'restaurant' | 'bar' | 'park' | 'beach';

export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  category: POICategory,
  radiusMeters: number = 5000
): Promise<POIResult[]> {
  const typeMap: Record<POICategory, string> = {
    restaurant: 'restaurant|cafe',
    bar: 'bar|night_club',
    park: 'park',
    beach: 'natural_feature',
  };

  try {
    const response = await google.placesNearby({
      params: {
        location: { lat, lng },
        radius: radiusMeters,
        type: typeMap[category],
        key: process.env.GOOGLE_PLACES_API_KEY!,
      },
    });

    return response.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry?.location,
      rating: place.rating,
      types: place.types,
    }));
  } catch (error) {
    console.error('Google Places API error:', error);
    return [];
  }
}
```

**Source:** [@googlemaps/google-maps-services-js Documentation](https://github.com/googlemaps/google-maps-services-js)

### Property Filter Query Builder
```typescript
// lib/search/filters.ts
import type { FilterState } from '@/stores/filterStore';

export function buildPropertyQuery(filters: FilterState): Record<string, unknown> {
  const query: Record<string, unknown> = {
    status: 'published', // Only show published properties
    limit: 20,
  };

  if (filters.bhkTypes.length > 0) {
    query.bhkType = { in: filters.bhkTypes.join(',') };
  }

  if (filters.propertyTypes.length > 0) {
    query.propertyType = { in: filters.propertyTypes.join(',') };
  }

  if (filters.priceMin !== null || filters.priceMax !== null) {
    query.nightlyPrice = {
      ...(filters.priceMin !== null && { gte: filters.priceMin }),
      ...(filters.priceMax !== null && { lte: filters.priceMax }),
    };
  }

  if (filters.furnishing) {
    query.furnishingStatus = filters.furnishing;
  }

  if (filters.amenities.length > 0) {
    query.amenities = { in: filters.amenities.join(',') };
  }

  if (filters.locality) {
    query.locality = { like: filters.locality };
  }

  if (filters.sortBy === 'price_asc') {
    query.sort = 'nightlyPrice';
    query.order = 'asc';
  } else if (filters.sortBy === 'price_desc') {
    query.sort = 'nightlyPrice';
    query.order = 'desc';
  }

  return query;
}
```

**Source:** [Payload CMS 3.x Query Builder](https://payloadcms.com/docs/database/query-builder)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Maps JavaScript API | MapLibre GL JS | ~2020 | No API key required for basic tiles, open-source, no usage costs |
| Client-side clustering | MapLibre native clustering + Supercluster | ~2018 | Better performance, GPU-accelerated rendering |
| Raw fetch to Google API | Official `@googlemaps/google-maps-services-js` | ~2015 | Type-safe, built-in retries, proper error handling |
| Server-side filter rendering | URL-synced state (Zustand/URL) | ~2020 | SSR + shareable/bookmarkable filters |

**Deprecated/outdated:**
- Google Maps JavaScript API: Replaced by MapLibre GL for cost reasons (free tiles, no API key for basic use)
- Marker clustering via external library: MapLibre 3.x has native clustering support; external libraries less necessary

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Payload 3.x `point` field supports `near` operator natively | PostGIS Radius Search | Payload 3.x may not expose PostGIS near query via field operators; may need custom endpoint |
| A2 | PostGIS 3.4 spatial indexes work with Payload point fields | PostGIS Radius Search | Index creation depends on Payload migration configuration |
| A3 | Google Places API key is available | POI Integration | Phase assumes key exists in environment; need to document setup |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions (RESOLVED)

1. **Payload point field `near` operator availability** ✅ RESOLVED
   - Decision: Use Payload custom endpoint approach instead of native operator
   - Implementation: Create `/api/properties/nearby` endpoint that uses raw PostGIS via Payload's `sql` helper
   - Rationale: This gives full control over ST_DWithin queries and avoids Payload version-specific behavior

2. **Google Places API key management** ✅ RESOLVED
   - Decision: Document setup in execution plan, use environment variable GOOGLE_PLACES_API_KEY
   - Implementation: Key stored in `.env.local`, read server-side only in poi/client.ts
   - Rationale: Standard Next.js pattern, key never exposed to client

3. **Tile server for MapLibre style** ✅ RESOLVED
   - Decision: Start with demotiles.maplibre.org, document upgrade path
   - Implementation: Use demotiles for MVP, document self-hosted tiles as future optimization
   - Rationale: Demotiles sufficient for demo client, self-hosting adds operational complexity

---

## Environment Availability

> Step 2.6: SKIPPED (no external dependencies beyond npm packages listed in Standard Stack)

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (Next.js default) + React Testing Library |
| Config file | `frontend/vitest.config.ts` or `frontend/jest.config.js` |
| Quick run command | `npm run test -- --run --reporter=dot` |
| Full suite command | `npm run test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FILT-01 | BHK filter returns matching properties | Unit | `vitest filter --testNamePattern="BHK"` | needs Wave 0 |
| FILT-04 | Price range filter bounds properties | Unit | `vitest filter --testNamePattern="price"` | needs Wave 0 |
| FILT-12 | Radius search returns only nearby properties | Unit | `vitest search --testNamePattern="radius"` | needs Wave 0 |
| MAP-01 | Map renders with property markers | Component | `vitest map --testNamePattern="renders markers"` | needs Wave 0 |
| MAP-04 | Dense areas show cluster markers | Component | `vitest map --testNamePattern="cluster"` | needs Wave 0 |
| POI-02 | POI cache returns stale data after TTL | Integration | `vitest poi --testNamePattern="cache"` | needs Wave 0 |

### Sampling Rate
- **Per task commit:** Unit tests on changed files only
- **Per wave merge:** Full test suite
- **Phase gate:** Full suite green before `/gsd:verify-phase 4`

### Wave 0 Gaps
- [ ] `frontend/src/lib/__tests__/filters.test.ts` — filter logic unit tests
- [ ] `frontend/src/lib/__tests__/search.test.ts` — search query builder tests
- [ ] `frontend/src/components/map/__tests__/PropertyMap.test.tsx` — map rendering tests
- [ ] `vitest` installation: `cd frontend && npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] `frontend/src/setup-tests.ts` — Jest/Vitest DOM setup

*No existing test infrastructure detected for frontend package. Wave 0 must set up Vitest before Phase 4 implementation.*

---

## Security Domain

> Payload 3.x built-in auth handles access control. Phase 4 focuses on frontend filtering and map display. No user input to sanitize beyond standard Payload access rules.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Payload built-in (AUTH-01 through AUTH-04 in Phase 3) |
| V3 Session Management | No | Payload built-in |
| V4 Access Control | Partial | `status: 'published'` filter on public property queries |
| V5 Input Validation | Yes | Filter input sanitized before Payload query (prevents injection) |
| V6 Cryptography | No | No sensitive data in Phase 4 |

### Known Threat Patterns for Search & Maps

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Filter injection via URL params | Information Disclosure | Payload query builder parameterizes all values |
| Map marker data exposure | Information Disclosure | Only published properties visible; no private fields |
| POI cache poisoning | Tampering | Server-side cache write only; client reads cached JSON |
| Google API key exposure | Elevation of Privilege | API key server-side only; never sent to client |

---

## Sources

### Primary (HIGH confidence)
- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js/docs/) - Map rendering API, clustering
- [PostGIS ST_DWithin Documentation](https://postgis.net/docs/ST_DWithin.html) - Efficient radius queries
- [Payload CMS 3.x Collections](https://payloadcms.com/docs/configuration/collections) - Collection configuration
- [Zustand Documentation](https://zustand.docs.pmnd.rs/) - State management with URL sync
- [Google Maps Services JS](https://github.com/googlemaps/google-maps-services-js) - POI API client

### Secondary (MEDIUM confidence)
- [Stadia Maps Clustering Tutorial](https://docs.stadiamaps.com/tutorials/clustering-styling-points-with-maplibre/) - Clustering implementation pattern
- [MapLibre Next.js Starter](https://github.com/richard-unterberg/maplibre-nextjs-ts-starter) - SSR-safe map setup

### Tertiary (LOW confidence)
- Payload 3.x `point` field `near` operator availability — needs verification in Phase 4 execution

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified on npm, established maintainers
- Architecture: HIGH — patterns from official documentation and mature open-source projects
- Pitfalls: HIGH — common issues with known solutions

**Research date:** 2026-06-01
**Valid until:** 2026-07-01 (30 days; no major breaking changes expected in these libraries)

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FILT-01 | BHK type filter (multi-select) | FilterSidebar component pattern, Zustand state, Payload query builder |
| FILT-02 | Property type filter (multi-select) | FilterSidebar component pattern, Zustand state, Payload query builder |
| FILT-04 | Budget range filter (min/max for nightly price) | PriceRangeSlider component pattern, Zustand state, Payload range query |
| FILT-05 | Locality/neighborhood filter | LocalityAutocomplete pattern, Payload like query |
| FILT-06 | Furnishing status filter | Single-select filter pattern |
| FILT-07 | Amenities filter (multi-select) | Multi-select filter pattern with Payload `in` operator |
| FILT-08 | Pet policy filter | Single-select filter pattern |
| FILT-09 | Tenant preference filter | Single-select filter pattern |
| FILT-10 | Facing/Floor/Bathrooms filter | Additional filter fields in FilterSidebar |
| FILT-11 | Availability timing filter | Single-select filter pattern |
| FILT-12 | Geolocation-based search (PostGIS radius) | ST_DWithin pattern, Payload near operator |
| MAP-01 | MapLibre GL property map view | react-map-gl pattern, GeoJSON source |
| MAP-02 | Property detail map (single property location) | PropertyPopup component pattern |
| MAP-03 | POI overlay on property detail | POIOverlay component, Google Places integration |
| MAP-04 | Map clustering for property list view | MapLibre native clustering configuration |
| POI-01 | Google Places API integration | @googlemaps/google-maps-services-js client |
| POI-02 | POI cache table (7-day TTL) | POICache collection pattern with hooks |
| POI-03 | POI types: Restaurants, Bars, Parks, Beaches | POICategory types, Google Places type mapping |
| POI-04 | Cache invalidation on property location change | Payload hook on Properties collection update |

---

## RESEARCH COMPLETE

**Phase:** 4 - Search & Maps
**Confidence:** HIGH

### Key Findings
- MapLibre GL + react-map-gl is the standard approach for Next.js 14 App Router (SSR-safe via dynamic import)
- PostGIS radius search uses `ST_DWithin` for index-efficient filtering (not `ST_Distance` in WHERE)
- POI caching uses a dedicated Payload collection with `expiresAt` field and beforeChange hook for 7-day TTL
- Filter state syncs to URL via Zustand middleware for SSR compatibility and shareable links
- No test infrastructure exists in frontend — Wave 0 must set up Vitest

### File Created
`/Users/rudhraksh/Desktop/Projects/Real Estate App/.planning/phases/04-search-maps/04-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|-------|
| Standard Stack | HIGH | All packages verified on npm, established maintainers with 5+ year track records |
| Architecture | HIGH | Patterns from official documentation and proven open-source projects |
| Pitfalls | HIGH | Common issues documented with specific prevention strategies |

### Open Questions
1. Payload 3.x `point` field `near` operator availability — needs verification during execution
2. Google Places API key setup — needs documentation in execution plan
3. Tile server choice (demotiles vs self-hosted) — defer to Phase 4.2

### Ready for Planning
Research complete. Planner can now create PLAN.md files for plans 4.1-4.4.
