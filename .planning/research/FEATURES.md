# Feature Research

**Domain:** Real Estate SaaS Platform (Multi-tenant)
**Researched:** 2026-05-31
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Property listing with photos | Core value proposition | MEDIUM | Gallery component, lazy loading |
| Map view of properties | Visual discovery | MEDIUM | MapLibre GL + markers |
| Property search/filters | Finding specific listings | HIGH | BHK, price, location, amenities |
| Contact/inquiry forms | Lead capture | LOW | Form with validation |
| Mobile responsive | Most users on phones | LOW | Tailwind breakpoints |
| Property detail page | Full listing info | MEDIUM | SEO-critical (SSR) |
| Tenant admin dashboard | Manage listings | MEDIUM | Payload admin customization |
| Subdomain routing | Multi-tenant isolation | MEDIUM | Next.js middleware |

### Differentiators (Competitive Advantage)

Features that set the product apart.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Nearby POI display | "What's around?" for Airbnb | MEDIUM | Google Places API + caching |
| Seasonal pricing | Revenue optimization for hosts | MEDIUM | Date-based rate tables |
| Unified rent/sale toggle | Single platform for agents | HIGH | Filter state management |
| Clean vertical extension points | Future Agent/Builder verticals | LOW | Data model design |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Live booking calendar | Airbnb-style booking | Payment integration required | Inquiry form + manual confirmation |
| Real-time availability locking | Prevent double-booking | Complex state management | Simple availability display |
| Theme builder | "Make it my own" | Large scope, not core value | Custom CSS per tenant |
| Payment processing | "Collect money online" | Compliance, Stripe integration | v2 feature |

## Feature Dependencies

```
[Multi-tenant Core]
    └──requires──> [Tenant Resolution Middleware]
                       └──requires──> [Tenant-scoped Queries]

[Property Listings]
    └──requires──> [Media Upload System]
                       └──requires──> [Payload Media Collection]

[POI Display]
    └──requires──> [Google Places API]
                       └──requires──> [POI Cache Table]

[Search/Filter]
    └──requires──> [PostGIS Indexes]
```

## MVP Definition

### Launch With (v1)

- [ ] Multi-tenant subdomain resolution
- [ ] Property CRUD (create, read, update, delete)
- [ ] Property gallery with images
- [ ] Map view (MapLibre GL)
- [ ] Property filters: BHK, type, rent/sale, furnishing, budget
- [ ] Inquiry/lead capture forms
- [ ] SSR for all storefront pages (SEO)
- [ ] Payload admin for tenant management
- [ ] POI cache + display on property detail

### Add After Validation (v1.x)

- [ ] Availability calendar display
- [ ] Seasonal pricing management
- [ ] Activity/experience listings
- [ ] Advanced filters (facing, floor, pet policy)
- [ ] Email notifications for new leads

### Future Consideration (v2+)

- [ ] Live booking with Stripe
- [ ] Availability locking
- [ ] Agent vertical UI
- [ ] Builder vertical UI
- [ ] Custom domains
- [ ] Theme marketplace

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Property CRUD | HIGH | MEDIUM | P1 |
| Map view | HIGH | MEDIUM | P1 |
| Search filters | HIGH | HIGH | P1 |
| Inquiry forms | HIGH | LOW | P1 |
| SSR storefront | HIGH | MEDIUM | P1 |
| Multi-tenancy | HIGH | MEDIUM | P1 |
| POI display | MEDIUM | MEDIUM | P1 |
| Activity listings | MEDIUM | MEDIUM | P2 |
| Availability calendar | MEDIUM | HIGH | P2 |
| Seasonal pricing | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Shopify RE | Zillow | Our Approach |
|---------|------------|--------|--------------|
| Multi-tenancy | App ecosystem | Single product | Subdomain-based SaaS |
| Map integration | Basic | Advanced | MapLibre + POI overlay |
| Property types | Products (flat) | Deep schema | Extensible vertical model |
| Lead capture | Contact forms | Agent connect | Inquiry → tenant inbox |
| Map search | No | Yes | Yes, with PostGIS |

## Sources

- [Zillow Feature Analysis](https://www.zillow.com) — Consumer expectations
- [Airbnb Listing Features](https://www.airbnb.com) — Short-let patterns
- [Payload CMS Community](https://payloadcms.com/community-help/github/geospatial-queries-field) — Technical patterns

---
*Feature research for: Real Estate SaaS Platform*
*Researched: 2026-05-31*
