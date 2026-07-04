# Phase 5: Storefront SSR - Technical Research

**Researched:** 2026-06-02
**Domain:** Next.js 14 App Router SSR Patterns, SEO Optimization, Image Handling
**Confidence:** HIGH

## Summary

Phase 5 implements SEO-optimized public storefront pages using Next.js 14 App Router's Server Components. Key technical decisions include:

1. **Direct Payload import in Server Components** (D-03) — Direct `getPayload()` calls in async Server Components, bypassing API routes for fastest SSR
2. **Reuse Phase 4 components** — FilterSidebar, MapViewSSR, POIOverlay are already built and SSR-safe
3. **Full SEO stack** — generateMetadata, JSON-LD (RealEstateListing schema), sitemap.ts, robots.ts
4. **Image optimization** — next/image with existing remotePatterns config (already set for `https://**`)

**Primary recommendation:** Use Server Components with React's `cache()` for data deduplication, implement JSON-LD via `<script type="application/ld+json">` in Server Components, and generate sitemaps dynamically from Payload data.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Rich property cards with BHK type, amenity icons, rating, short description
- **D-02:** Hero + search on home page with location/guests search
- **D-03:** Direct Payload import in Server Components for fastest SSR
- **D-04:** Lightbox carousel with prev/next arrows, thumbnails below
- **D-05:** Full SEO implementation (meta tags, JSON-LD, sitemaps, robots.txt)
- **D-06:** Reuse FilterSidebar from Phase 4
- **D-07:** Reuse InquiryForm from Phase 3
- **D-08:** Include POIOverlay from Phase 4 on property detail

### Deferred Ideas (OUT OF SCOPE)
- User reviews/ratings — Version 2
- Wishlist/favorites — Version 2
- Booking/availability calendar — Version 2
- Payment processing — Version 2

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Property data fetching | API/Backend (Payload) | — | Direct Payload import in Server Components |
| Filter state management | Client (Zustand) | — | Client-side interactivity required |
| Image optimization | CDN/Static (next/image) | — | Built-in Next.js optimization |
| SEO metadata | Frontend Server (SSR) | — | generateMetadata in Server Components |
| JSON-LD structured data | Frontend Server (SSR) | — | Server Component generates script tag |
| Sitemap generation | Frontend Server (SSR) | — | sitemap.ts route handler |
| Property gallery/carousel | Client | — | User interaction required |
| Map view | Client | — | MapLibre requires browser APIs |
| Inquiry form submission | Client + Server Action | — | React state + Server Action |

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-5.1 | Home page with hero, search, featured properties | Next.js App Router patterns, generateMetadata |
| REQ-5.2 | Property list page with filters (SSR) | Direct Payload import, FilterSidebar reuse |
| REQ-5.3 | Property detail page (SSR) | RealEstateListing JSON-LD, lightbox carousel |
| REQ-5.4 | Activities pages (SSR) | Same patterns as properties |
| REQ-5.5 | JSON-LD schema on property pages | schema.org RealEstateListing, BreadcrumbList |
| REQ-5.6 | Sitemap generation | sitemap.ts route handler |
| REQ-5.7 | Robots.txt | robots.ts route handler |
| REQ-5.8 | Image optimization | next/image, existing remotePatterns |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.2+ | SSR framework | App Router with Server Components |
| Payload CMS | 3.x | Backend + CMS | Direct import in Server Components |
| Tailwind CSS | 3.4 | Styling | Already in use, mobile-first |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React `cache()` | built-in | Deduplicate data fetches | Metadata + page fetch same data |
| Lucide React | 1.17 | Icons | Already in use |
| zustand | 5.0 | Filter state | Already built in Phase 4 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct Payload import | API routes + SWR | Direct import is faster SSR, API routes add network hop |
| `cache()` for deduplication | Duplicate fetch calls | `cache()` memoizes, prevents duplicate DB queries |

---

## Package Legitimacy Audit

> This phase primarily uses existing packages. No new external packages required.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| (none) | — | — | — | — | — | All packages from Phases 1-4 |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Request                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App Router                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ [tenant]/    │  │ [tenant]/   │  │ [tenant]/properties/   │ │
│  │ page.tsx     │  │ activities/ │  │ [slug]/page.tsx         │ │
│  │ (Server)     │  │ page.tsx    │  │ (Server)                │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                 │                      │               │
│         │         ┌───────┴───────┐              │               │
│         │         │               │              │               │
│         ▼         ▼               ▼              ▼               │
│  ┌─────────────┐  ┌───────────┐  ┌─────────────────────────────┐│
│  │ generate    │  │ generate  │  │ generateMetadata +          ││
│  │ Metadata()  │  │ Metadata()│  │ JSON-LD script tag         ││
│  └─────────────┘  └───────────┘  └─────────────────────────────┘│
│         │                 │                      │               │
│         └────────┬────────┴─────────────────────┘               │
│                  │                                                │
│                  ▼                                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Payload CMS (Direct Import)                    │ │
│  │  getPayload() → find() → Property[] / Activity[]           │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       HTML Response                             │
│  <head> generateMetadata() → meta, og:*, canonical              │
│  <script type="application/ld+json"> RealEstateListing         │
│  <body> Server-rendered property cards, content                 │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
frontend/src/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   ├── robots.ts                     # robots.txt generation
│   └── [tenant]/
│       ├── layout.tsx                # Tenant layout (already exists)
│       ├── page.tsx                  # Home page (enhance existing)
│       ├── properties/
│       │   ├── page.tsx              # Property list (SSR + FilterSidebar)
│       │   └── [slug]/
│       │       └── page.tsx          # Property detail (SSR + JSON-LD)
│       └── activities/
│           ├── page.tsx              # Activities list (SSR)
│           └── [slug]/
│               └── page.tsx          # Activity detail (SSR)
├── components/
│   ├── PropertyCard.tsx              # New: Rich property card
│   ├── PropertyGallery.tsx           # New: Lightbox carousel
│   ├── HeroSearch.tsx                # New: Home page hero + search
│   ├── FeaturedProperties.tsx        # New: Home page featured grid
│   ├── Breadcrumbs.tsx               # New: Breadcrumb component
│   ├── InquiryForm.tsx               # Existing: Phase 3
│   ├── search/
│   │   └── FilterSidebar.tsx        # Existing: Phase 4
│   └── ...
├── lib/
│   ├── payload.ts                    # Existing: Payload singleton
│   ├── seo/
│   │   └── json-ld.ts                # New: JSON-LD helpers
│   └── data/
│       └── properties.ts             # New: Cached property fetchers
```

### Pattern 1: Direct Payload Import in Server Components

**What:** Use `getPayload()` directly inside async Server Components, bypassing API routes.

**When to use:** All data fetching in page components that need CMS data.

**Example:**
```typescript
// frontend/src/lib/data/properties.ts
import { getPayloadInstance } from '@/lib/payload';
import { cache } from 'react';

// Cache prevents duplicate fetches when called multiple times
export const getPublishedProperties = cache(async (options?: {
  limit?: number;
  tenantSlug?: string;
}) => {
  const payload = await getPayloadInstance();
  return payload.find({
    collection: 'properties',
    where: {
      status: { equals: 'published' },
    },
    limit: options?.limit ?? 20,
    depth: 2, // Include relationship fields (featuredImage, gallery)
  });
});

export const getPropertyBySlug = cache(async (slug: string) => {
  const payload = await getPayloadInstance();
  return payload.find({
    collection: 'properties',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 3, // Full relationship depth for detail page
  });
});
```

```typescript
// frontend/src/app/[tenant]/properties/[slug]/page.tsx
import { getPropertyBySlug } from '@/lib/data/properties';
import { PropertyDetail } from '@/components/PropertyDetail';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ tenant: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPropertyBySlug(slug);
  const property = result.docs[0];

  if (!property) return { title: 'Property Not Found' };

  return {
    title: `${property.title} | ${property.address.city}`,
    description: property.shortDescription || property.description?.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.shortDescription || '',
      images: property.featuredImage?.url ? [property.featuredImage.url] : [],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const result = await getPropertyBySlug(slug);
  const property = result.docs[0];

  if (!property) {
    return <div>Property not found</div>;
  }

  return <PropertyDetail property={property} />;
}
```

**Source:** [Next.js Metadata - generateMetadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

### Pattern 2: JSON-LD Structured Data

**What:** Generate RealEstateListing JSON-LD schema in Server Components for search engine rich results.

**When to use:** Property detail pages, activity detail pages.

**Example:**
```typescript
// frontend/src/lib/seo/json-ld.ts
import type { Property } from '@/types';

interface PropertyJsonLdOptions {
  property: Property;
  baseUrl: string;
}

export function generatePropertyJsonLd({ property, baseUrl }: PropertyJsonLdOptions) {
  const url = `${baseUrl}/properties/${property.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || property.shortDescription,
    url,
    datePosted: property.createdAt,
    image: property.featuredImage?.url,
    offers: {
      '@type': 'Offer',
      price: property.nightlyPrice,
      priceCurrency: property.currency || 'INR',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address?.street,
      addressLocality: property.address?.city,
      addressRegion: property.address?.state,
      postalCode: property.address?.zipCode,
      addressCountry: property.address?.country || 'IN',
    },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

```typescript
// frontend/src/app/[tenant]/properties/[slug]/page.tsx
import { generatePropertyJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';

export default async function PropertyPage({ params }: Props) {
  // ... fetch property ...

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notjustastay.com';

  const jsonLd = {
    property: generatePropertyJsonLd({ property, baseUrl }),
    breadcrumbs: generateBreadcrumbJsonLd([
      { name: 'Home', url: baseUrl },
      { name: 'Properties', url: `${baseUrl}/properties` },
      { name: property.title, url: `${baseUrl}/properties/${property.slug}` },
    ]),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.property) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbs) }}
      />
      {/* Page content */}
    </>
  );
}
```

**Source:** [schema.org RealEstateListing](https://schema.org/RealEstateListing)

### Pattern 3: Dynamic Sitemap Generation

**What:** Generate sitemap.xml dynamically from Payload CMS data.

**When to use:** All public pages need to be discoverable by search engines.

**Example:**
```typescript
// frontend/src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getPayloadInstance } from '@/lib/payload';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notjustastay.com';

  // Fetch all published properties and activities
  const payload = await getPayloadInstance();

  const [propertiesResult, activitiesResult] = await Promise.all([
    payload.find({
      collection: 'properties',
      where: { status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
      limit: 1000,
    }),
    payload.find({
      collection: 'activities',
      where: { status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
      limit: 1000,
    }),
  ]);

  const propertyUrls: MetadataRoute.Sitemap = propertiesResult.docs.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const activityUrls: MetadataRoute.Sitemap = activitiesResult.docs.map((a) => ({
    url: `${baseUrl}/activities/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...propertyUrls,
    ...activityUrls,
  ];
}
```

**Source:** [Next.js sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

### Pattern 4: Image Optimization with next/image

**What:** Use Next.js Image component with configured remote patterns.

**When to use:** All property images, gallery images, featured images.

**Example:**
```typescript
// next.config.ts (already configured)
const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};
```

```tsx
// PropertyCard.tsx
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden">
      {property.featuredImage && (
        <div className="relative aspect-[4/3]">
          <Image
            src={property.featuredImage.url}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={/* first 3 items get priority */ index < 3}
          />
        </div>
      )}
      {/* Content */}
    </article>
  );
}
```

**Source:** [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### Pattern 5: Loading States with Suspense

**What:** Wrap client components in Suspense with loading skeletons.

**When to use:** Pages with client components (FilterSidebar, MapViewSSR).

**Example:**
```typescript
// frontend/src/app/[tenant]/properties/page.tsx
import { Suspense } from 'react';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { FilterSkeleton } from '@/components/skeletons/FilterSkeleton';
import { MapSkeleton } from '@/components/map/MapSkeleton';
import dynamic from 'next/dynamic';

// Map loaded client-side only
const MapViewSSR = dynamic(
  () => import('@/components/map/MapViewSSR'),
  { ssr: false, loading: () => <MapSkeleton /> }
);

export default function PropertiesPage() {
  return (
    <div className="flex gap-6">
      <Suspense fallback={<FilterSkeleton />}>
        <FilterSidebar />
      </Suspense>
      <main className="flex-1">
        <PropertyList />
      </main>
      <aside className="w-1/3 hidden lg:block">
        <Suspense fallback={<MapSkeleton />}>
          <MapViewSSR properties={properties} />
        </Suspense>
      </aside>
    </div>
  );
}
```

### Pattern 6: Lightbox Carousel Gallery

**What:** Client-side image gallery with keyboard/touch support.

**When to use:** Property detail page image gallery.

**Example:**
```tsx
// PropertyGallery.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, goToPrevious, goToNext]);

  return (
    <div>
      {/* Main Image */}
      <div
        className="relative aspect-[16/9] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || title}
          fill
          className="object-cover rounded-lg"
          priority
        />
        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)}>
            <Image
              src={img.url}
              alt={img.alt || `${title} ${i + 1}`}
              width={80}
              height={60}
              className={`object-cover rounded ${i === currentIndex ? 'ring-2 ring-blue-500' : ''}`}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white">
            <X className="w-8 h-8" />
          </button>
          <button onClick={goToPrevious} className="absolute left-4 text-white">
            <ChevronLeft className="w-12 h-12" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || title}
              fill
              className="object-contain"
            />
          </div>
          <button onClick={goToNext} className="absolute right-4 text-white">
            <ChevronRight className="w-12 h-12" />
          </button>
          <div className="absolute bottom-4 text-white">{currentIndex + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom image loader | next/image | Built-in WebP, lazy loading, CLS prevention |
| Sitemap generation | Static XML files | sitemap.ts route | Auto-updates with new content |
| SEO metadata | Hardcoded meta tags | generateMetadata | Dynamic per-page metadata |
| Structured data | Manual JSON-LD | Server Component pattern | Type-safe, colocated with page |

**Key insight:** Next.js App Router provides first-class SSR patterns that eliminate the need for custom solutions. The sitemap.ts convention alone prevents stale sitemaps.

---

## Common Pitfalls

### Pitfall 1: Duplicate Data Fetches in generateMetadata and Page

**What goes wrong:** Both `generateMetadata` and the page component call the same data fetch, doubling database load.

**Why it happens:** `generateMetadata` and the default export are separate functions with no automatic deduplication.

**How to avoid:** Use React's `cache()` function to memoize the fetch call. The first call caches the result; subsequent calls return the cached value.

**Warning signs:** High database load, slow TTFB, duplicate queries in logs.

### Pitfall 2: Client Components Without Suspense Boundaries

**What goes wrong:** Client components (FilterSidebar, MapViewSSR) block the entire page from streaming, degrading perceived performance.

**Why it happens:** By default, Server Components render completely before Client Components render.

**How to avoid:** Wrap client components in `<Suspense fallback={...}>` to allow the server to stream the page shell immediately.

**Warning signs:** No loading state appears until all data/client components are ready.

### Pitfall 3: Missing Image Priority on Above-Fold Images

**What goes wrong:** Featured images on property cards don't get priority loading, causing layout shift and slower LCP.

**Why it happens:** Default `next/image` behavior is lazy loading, even for above-fold images.

**How to avoid:** Add `priority` prop to first 3-4 property images (above the fold). Use `sizes` attribute correctly.

**Warning signs:** Poor Core Web Vitals scores, visible image loading flicker.

### Pitfall 4: JSON-LD in Client Components

**What goes wrong:** Attempting to render `<script type="application/ld+json">` in client components causes hydration mismatches.

**Why it happens:** `<script>` tags are not React-rendered and behave differently in SSR vs. client.

**How to avoid:** Render JSON-LD in the Server Component parent. Client components receive the parsed data if needed.

**Warning signs:** JSON-LD not appearing in page source, hydration warnings.

### Pitfall 5: Not Handling Missing Properties

**What goes wrong:** Property detail page throws or shows broken UI when slug doesn't exist.

**Why it happens:** `find()` returns empty docs array, but code assumes property exists.

**How to avoid:** Always check `result.docs[0]` existence and return 404 page or not-found UI.

**Warning signs:** Runtime errors in production, empty pages for invalid slugs.

---

## Code Examples

### Server Component Data Fetching

```typescript
// Source: Next.js App Router patterns
// Using React's cache() for deduplication
import { cache } from 'react';
import { getPayloadInstance } from '@/lib/payload';

export const getProperty = cache(async (slug: string) => {
  const payload = await getPayloadInstance();
  return payload.findOne({
    collection: 'properties',
    where: { slug: { equals: slug } },
    depth: 3,
  });
});
```

### Metadata with OpenGraph

```typescript
// Source: Next.js generateMetadata docs
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty((await params).slug);

  return {
    title: property.title,
    description: property.shortDescription,
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
    openGraph: {
      title: property.title,
      description: property.shortDescription || property.description?.slice(0, 160),
      images: property.featuredImage ? [property.featuredImage.url] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      images: property.featuredImage ? [property.featuredImage.url] : [],
    },
  };
}
```

### robots.ts

```typescript
// Source: Next.js robots.ts docs
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notjustastay.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| getServerSideProps | Server Components + generateMetadata | Next.js 13 App Router (2023) | No JS required for data fetching, streaming |
| Custom image component | next/image | Next.js 10+ (2020) | Automatic WebP, CLS prevention |
| Static sitemap.xml | sitemap.ts route handler | Next.js 13.3 (2023) | Auto-updates with content |
| External SEO library | Native metadata APIs | Next.js 13+ | No additional dependencies |

**Deprecated/outdated:**
- `getStaticProps`/`getServerSideProps`: Replaced by Server Components
- Custom `<Head>` component: Replaced by `metadata` export
- CRA/React SPA: Next.js App Router is standard for SSR

---

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Properties have slugs accessible via `property.slug` | Pattern 1 | Property slug may be auto-generated; verify Payload slug field exists |
| A2 | `featuredImage` and `gallery` relationships return full media objects with `url` | Pattern 1 | Depth=2/3 should resolve relationships; verify media URL field name |
| A3 | `NEXT_PUBLIC_BASE_URL` env var is set for sitemap generation | Pattern 3 | Fallback to hardcoded URL works but is less flexible |
| A4 | All images are on HTTPS domains | Pattern 4 | next.config.ts allows `https://**` |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions (RESOLVED)

1. **Property Slug Field**
   - What we know: `PropertiesStub` uses `useAsTitle: 'title'` but has NO explicit `slug` field
   - Resolution: **Add explicit `slug` field to PropertiesStub collection** for SEO-friendly URLs. The slug should be a `text` field (not auto-generated) so admins can set it manually.
   - Action: Add slug field to `payload/src/collections/PropertiesStub.ts`

2. **Media URL Field**
   - What we know: Media collection uses Payload's built-in upload system which provides `url` field
   - Resolution: **Use `url` field from Payload's upload system** — verified by examining `Media.ts`
   - Action: Access via `property.featuredImage.url` (depth=2 resolves relationship)

3. **Tenant Slug Mapping**
   - What we know: Demo client is "notjustastay" with URL `notjustastay.com`
   - Resolution: **Hardcode "notjustastay" for MVP** — multi-tenant routing is Phase 6+
   - Action: All Phase 5 pages use `params.tenant = 'notjustastay'`

---

## Environment Availability

> Step 2.6: SKIPPED — no external dependencies beyond project code. All required packages already installed:
> - next: ^14.2.0
> - payload: ^3.0.0
> - @payloadcms/next: ^3.0.0

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (manual verification) |
| Quick run command | `cd frontend && npm run dev` |
| Full suite command | `cd frontend && npm run build` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-5.1 | Home page renders with properties | Manual | `curl localhost:3000/notjustastay \| grep property` | TBD |
| REQ-5.2 | Property list page loads | Manual | `curl localhost:3000/notjustastay/properties \| grep FilterSidebar` | TBD |
| REQ-5.3 | Property detail shows JSON-LD | Manual | View page source, search for RealEstateListing | TBD |
| REQ-5.4 | Activities pages load | Manual | `curl localhost:3000/notjustastay/activities` | TBD |
| REQ-5.5 | JSON-LD schema valid | Manual | Paste JSON-LD into Google rich results test | TBD |
| REQ-5.6 | Sitemap returns XML | Manual | `curl localhost:3000/sitemap.xml` | TBD |
| REQ-5.7 | Robots.txt accessible | Manual | `curl localhost:3000/robots.txt` | TBD |
| REQ-5.8 | Images optimized | Manual | DevTools network tab, check for WebP | TBD |

### Wave 0 Gaps
- [ ] None — existing test infrastructure covers basic verification
- Framework install: N/A (manual verification only)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — public storefront pages |
| V3 Session Management | No | N/A — public pages |
| V4 Access Control | Yes | Payload access control in collection config |
| V5 Input Validation | Yes | Zod schemas in lib/schemas.ts (existing) |
| V6 Cryptography | No | N/A — no crypto operations |

### Known Threat Patterns for SSR/Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS in JSON-LD | Tampering | Server Component rendering; no user input in JSON-LD |
| Open redirect via canonical | Tampering | Canonical URL validated against known domains |
| SSRF via image URLs | Information Disclosure | next/image handles; remotePatterns restricts domains |
| Property enumeration | Information Disclosure | Intentional for public listings |

---

## Sources

### Primary (HIGH confidence)
- [Next.js App Router Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) — generateMetadata, static metadata, OpenGraph
- [Next.js sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — Dynamic sitemap generation
- [Next.js robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — robots.ts route handler
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) — next/image configuration
- [schema.org RealEstateListing](https://schema.org/RealEstateListing) — Real estate structured data schema

### Secondary (MEDIUM confidence)
- [React cache() documentation](https://react.dev/reference/react/cache) — Data deduplication in Server Components
- [Next.js Streaming Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata) — Performance optimization

### Tertiary (LOW confidence)
- Community patterns for lightbox carousels (no canonical source)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All technologies verified in project package.json
- Architecture: HIGH — Patterns from official Next.js docs
- Pitfalls: MEDIUM — Based on common SSR patterns, some from experience

**Research date:** 2026-06-02
**Valid until:** 2026-07-02 (30 days — Next.js patterns are stable)
