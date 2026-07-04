# Phase 5: Storefront SSR - Discussion Log

**Date:** 2026-06-02

## Areas Discussed

### 1. Page Structure

**Q1: Property cards**
- Options: Simple cards / Rich cards / Hybrid
- **Selected:** Rich cards — Include BHK type, amenity icons, rating, short description

**Q2: Home page layout**
- Options: Hero + search / Clean grid
- **Selected:** Hero + search — Large hero banner with search bar (location, guests), then featured properties

### 2. Data Fetching

**Q: How to fetch properties from Payload?**
- Options: Direct Payload import / API routes / Direct + API hybrid
- **Selected:** Direct Payload import — Fastest SSR, server-only

### 3. Property Gallery

**Q: How should the property gallery work?**
- Options: Thumbnail grid / Lightbox carousel / Simple grid
- **Selected:** Lightbox carousel — Large image with prev/next arrows, thumbnails below, mobile-friendly

### 4. SEO Details

**Q: What SEO implementation approach?**
- Options: Standard SEO / Full SEO
- **Selected:** Full SEO — Meta tags, JSON-LD, sitemaps, robots.txt, structured data for reviews, breadcrumbs

---

## Deferred Ideas

- User reviews/ratings — Version 2
- Wishlist/favorites — Version 2
- Booking/availability calendar — Version 2
- Payment processing — Version 2

