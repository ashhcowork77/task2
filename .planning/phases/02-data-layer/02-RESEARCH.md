# Phase 2: Data Layer - Research

**Researched:** 2026-06-01
**Domain:** Payload CMS 3.x collections, field types, PostgreSQL integration
**Confidence:** HIGH (Payload 3.85.0 verified from npm, official docs cited)

## Summary

Phase 2 implements the core Payload CMS data layer for the Airbnb vertical demo client (Not Just A Stay). This involves replacing stub collections with fully-featured implementations: Properties (with Airbnb-specific fields), Leads (inquiry capture), Media (image uploads), and a simplified Accounts collection (single-account for MVP).

The key technical decisions center on Payload field types (array for amenities/seasonal pricing, relationship for media, point for geolocation), local filesystem storage for MVP, and PostgreSQL with PostGIS support (the `point` field requires PostgreSQL - not SQLite).

**Primary recommendation:** Build four collections using Payload's field composition patterns: Tabs for organization, Array for repeating data (amenities, seasonal pricing), Relationship for media links, and Point for geolocation. Add collection-level access control and hooks for business logic.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Demo client is Not Just A Stay (https://www.notjustastay.com)
- **D-02:** Vertical: Airbnb/Short-let properties
- **D-04:** Single account for MVP - no multi-account infrastructure
- **D-08:** Properties collection with Airbnb-specific fields
- **D-09:** Leads collection for inquiry capture
- **D-10:** Media collection using Payload built-in upload
- **D-11:** Accounts collection (single account for Not Just A Stay)
- **D-12:** Owner role - full access
- **D-14:** Local filesystem for MVP (`./public/media`)
- **D-15:** S3/Cloud storage in Version 2

### Deferred Ideas (OUT OF SCOPE)
- Multi-account infrastructure - Version 2
- Account-based access control - Version 2
- Staff roles and permissions - Version 2
- S3/media storage - Version 2
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-P2-01 | Properties collection with all base fields | Section: Standard Stack - Collection Patterns |
| REQ-P2-02 | Leads collection for inquiry capture | Section: Standard Stack - Collection Patterns |
| REQ-P2-03 | Media collection with image uploads | Section: Standard Stack - Media Configuration |
| REQ-P2-04 | All collections accessible in Payload admin | Section: Architecture Patterns - Admin Configuration |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Property data storage | Payload/PostgreSQL | - | Collection config in payload/src/collections/ |
| Property CRUD operations | Payload REST/GraphQL API | Next.js (via @payloadcms/next) | Payload handles admin + API |
| Media file storage | Payload local filesystem | - | Local storage MVP, S3 in v2 |
| Lead/inquiry capture | Payload API | Next.js (form submission) | Public create access on leads |
| Geolocation/PostGIS | PostgreSQL | Payload point field | Point field stored as GeoJSON |
| Admin UI | Payload Admin | - | Collections visible in /admin |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| payload | 3.85.0 [VERIFIED: npm registry] | CMS, REST API, Admin UI | Core platform - all collections, auth, uploads |
| @payloadcms/db-postgres | 3.85.0 [VERIFIED: npm registry] | PostgreSQL adapter | Required for PostGIS/geolocation support |
| @payloadcms/next | 3.85.0 [VERIFIED: npm registry] | Next.js integration | SSR with Payload, shared types |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @payloadcms/richtext-slate | 3.85.0 | Rich text editor | For property descriptions if needed |

**Installation:** Already present in payload/package.json
\`\`\`bash
pnpm install  # Installs all payload dependencies
\`\`\`

**Version verification:** Payload 3.85.0 confirmed via `npm view payload version` (published 2026)

## Architecture Patterns

### Recommended Project Structure
\`\`\`
payload/
├── src/
│   ├── collections/
│   │   ├── index.ts              # Export all collections
│   │   ├── Properties.ts         # Full Airbnb properties
│   │   ├── Leads.ts             # Inquiry capture
│   │   ├── Media.ts             # Image uploads
│   │   └── Accounts.ts          # Single account for MVP
│   └── index.ts                 # Re-export from payload.config.ts
payload.config.ts                 # Import collections from src/collections/
\`\`\`

### Pattern 1: Collection with Tabs Organization

Use `type: 'tabs'` to organize complex property forms:

```typescript
// Source: https://payloadcms.com/docs/fields/tabs
const Properties: CollectionConfig = {
  slug: 'properties',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                { name: 'city', type: 'text' },
                // ...
              ],
            },
            { name: 'geolocation', type: 'point' },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            { name: 'nightlyPrice', type: 'number' },
            // Seasonal pricing array
          ],
        },
        {
          label: 'Amenities',
          fields: [
            { name: 'amenities', type: 'select', hasMany: true },
            { name: 'houseRules', type: 'textarea' },
          ],
        },
      ],
    },
    { name: 'status', type: 'select' },
  ],
}
```

### Pattern 2: Array Field for Repeating Data

For amenities (select-based) and seasonal pricing (date range + price):

```typescript
// Source: https://payloadcms.com/docs/fields/array
// Seasonal Pricing
{
  name: 'seasonalPricing',
  type: 'array',
  label: 'Seasonal Pricing',
  interfaceName: 'SeasonalPricingRow',
  fields: [
    {
      name: 'seasonName',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
  ],
}

// Amenities as select (multiple)
{
  name: 'amenities',
  type: 'select',
  hasMany: true,
  options: [
    { label: 'WiFi', value: 'wifi' },
    { label: 'Air Conditioning', value: 'ac' },
    { label: 'Pool', value: 'pool' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Parking', value: 'parking' },
    { label: 'Washer', value: 'washer' },
    { label: 'TV', value: 'tv' },
    { label: 'Gym', value: 'gym' },
    { label: 'Beach Access', value: 'beach_access' },
    { label: 'Hot Tub', value: 'hot_tub' },
    { label: 'BBQ', value: 'bbq' },
    { label: 'Fireplace', value: 'fireplace' },
  ],
}
```

### Pattern 3: Media/Upload Collection

```typescript
// Source: https://payloadcms.com/docs/upload/overview
const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'public/media',  // Local filesystem
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
```

### Pattern 4: Point Field for Geolocation

```typescript
// Source: https://payloadcms.com/docs/fields/point
{
  name: 'geolocation',
  type: 'point',  // Stores as [longitude, latitude]
  // Note: Point field requires PostgreSQL (not SQLite)
}
```

### Pattern 5: Relationship to Media

```typescript
// Source: https://payloadcms.com/docs/fields/relationship
{
  name: 'gallery',
  type: 'relationship',
  relationTo: 'media',
  hasMany: true,
  admin: {
    isSortable: true,  // Drag-and-drop reordering
  },
}
```

### Pattern 6: Access Control

```typescript
// Source: https://payloadcms.com/docs/access-control/overview
const Leads: CollectionConfig = {
  slug: 'leads',
  access: {
    // Public can create leads (inquiry form)
    create: () => true,
    // Only authenticated users can read/update/delete
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
}
```

### Pattern 7: Collection Hooks

```typescript
// Source: https://payloadcms.com/docs/hooks/overview
const Properties: CollectionConfig = {
  slug: 'properties',
  hooks: {
    beforeRead: [
      async ({ doc }) => {
        // Enrich data before returning
        return doc;
      },
    ],
    beforeChange: [
      async ({ data }) => {
        // Validate or transform before save
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Sync to external service, send notifications, etc.
      },
    ],
  },
}
```

### Pattern 8: Indexes Configuration

```typescript
const Properties: CollectionConfig = {
  slug: 'properties',
  indexes: [
    // Compound index for common query patterns
    {
      fields: {
        status: 1,
        propertyType: 1,
      },
    },
    // For geospatial queries (PostGIS GIST index added via migration)
  ],
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File upload handling | Custom file storage | Payload built-in upload | Handles validation, resizing, thumbnails, CDN integration |
| Admin UI | Custom admin panel | Payload admin | Auto-generated forms, authentication, versioning |
| REST API | Custom endpoints | Payload REST API | Auto-generated CRUD, filtering, pagination, auth |
| Authentication | Custom auth system | Payload built-in auth | JWT tokens, session management, role-based access |
| Rich text editing | Custom textarea | @payloadcms/richtext-slate | Lexical-based editor with formatting |

**Key insight:** Payload provides comprehensive CMS functionality out of the box. Build custom business logic on top, not duplicate functionality underneath.

## Common Pitfalls

### Pitfall 1: Using Point Field with SQLite
**What goes wrong:** Payload throws error - Point field not supported in SQLite
**Why it happens:** PostgreSQL-specific spatial features required
**How to avoid:** Use PostgreSQL adapter (already configured with postgis/postgis:15-3.4 image)
**Warning signs:** Error "Point field is not supported by this adapter"

### Pitfall 2: Missing Spatial Index for Geolocation
**What goes wrong:** Slow map queries when properties grow
**Why it happens:** Payload point field doesn't auto-create PostGIS GIST index
**How to avoid:** Add custom migration or schema hook to create GIST index on geolocation column
**Warning signs:** `EXPLAIN ANALYZE` shows sequential scan on properties table

### Pitfall 3: Circular Dependencies in Collections
**What goes wrong:** TypeScript compilation errors, runtime crashes
**Why it happens:** Collection A references Collection B, which references Collection A
**How to avoid:** Use lazy imports or define relationship fields as separate field configs
**Warning signs:** "Cannot access 'X' before initialization" errors

### Pitfall 4: Large File Uploads Without Limits
**What goes wrong:** Storage fills up, performance degrades
**Why it happens:** No validation on file sizes
**How to avoid:** Configure `maxFileSize` in upload options and middleware body parser limits
**Warning signs:** Payload config doesn't set upload size limits

### Pitfall 5: Forgetting Access Control on Public Collections
**What goes wrong:** Anyone can read/delete leads
**Why it happens:** Payload defaults to authenticated-only, but explicit is better
**How to avoid:** Always define access control explicitly, even if it matches defaults
**Warning signs:** Leaked data in API responses

## Code Examples

### Properties Collection (Full Airbnb Fields)

```typescript
// Source: https://payloadcms.com/docs/configuration/collections + field docs
import { CollectionConfig } from 'payload';

export const Properties: CollectionConfig = {
  slug: 'properties',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'nightlyPrice', 'locality'],
    listSearchableFields: ['title', 'locality'],
  },
  access: {
    read: () => true,  // Public read for published properties
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeRead: [
      ({ doc }) => {
        // Default to published if no status
        if (!doc.status) {
          doc.status = 'draft';
        }
        return doc;
      },
    ],
  },
  fields: [
    // === TAB: Basic Info ===
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'Full property description' },
            },
            {
              name: 'shortDescription',
              type: 'text',
              admin: { description: 'Brief summary for cards' },
            },
          ],
        },
        // === TAB: Location ===
        {
          label: 'Location',
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                { name: 'city', type: 'text', required: true },
                { name: 'state', type: 'text' },
                { name: 'zipCode', type: 'text' },
                { name: 'country', type: 'text', defaultValue: 'India' },
              ],
            },
            {
              name: 'geolocation',
              type: 'point',  // [longitude, latitude]
              admin: { description: 'Pinpoint location on map' },
            },
            {
              name: 'locality',
              type: 'text',
              admin: { description: 'Neighborhood or area name' },
            },
          ],
        },
        // === TAB: Property Details ===
        {
          label: 'Property Details',
          fields: [
            {
              name: 'bhkType',
              type: 'select',
              options: [
                { label: '1 BHK', value: '1bhk' },
                { label: '2 BHK', value: '2bhk' },
                { label: '3 BHK', value: '3bhk' },
                { label: '4+ BHK', value: '4plus_bhk' },
                { label: 'Studio', value: 'studio' },
                { label: 'Villa', value: 'villa' },
                { label: 'Penthouse', value: 'penthouse' },
              ],
            },
            {
              name: 'propertyType',
              type: 'select',
              options: [
                { label: 'Apartment', value: 'apartment' },
                { label: 'House', value: 'house' },
                { label: 'Villa', value: 'villa' },
                { label: 'Condo', value: 'condo' },
                { label: 'Farmhouse', value: 'farmhouse' },
              ],
            },
            {
              name: 'furnishingStatus',
              type: 'select',
              options: [
                { label: 'Furnished', value: 'furnished' },
                { label: 'Semi-Furnished', value: 'semi_furnished' },
                { label: 'Unfurnished', value: 'unfurnished' },
              ],
            },
            {
              name: 'bedrooms',
              type: 'number',
              min: 0,
            },
            {
              name: 'bathrooms',
              type: 'number',
              min: 0,
            },
            {
              name: 'maxGuests',
              type: 'number',
              min: 1,
              defaultValue: 2,
            },
            {
              name: 'floor',
              type: 'group',
              fields: [
                { name: 'current', type: 'number' },
                { name: 'total', type: 'number' },
              ],
            },
            {
              name: 'facing',
              type: 'select',
              options: [
                { label: 'North', value: 'north' },
                { label: 'South', value: 'south' },
                { label: 'East', value: 'east' },
                { label: 'West', value: 'west' },
                { label: 'North-East', value: 'north_east' },
                { label: 'North-West', value: 'north_west' },
                { label: 'South-East', value: 'south_east' },
                { label: 'South-West', value: 'south_west' },
              ],
            },
          ],
        },
        // === TAB: Pricing ===
        {
          label: 'Pricing',
          fields: [
            {
              name: 'nightlyPrice',
              type: 'number',
              admin: { description: 'Base price per night (INR)' },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'INR',
              options: [
                { label: 'INR', value: 'INR' },
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
              ],
            },
            {
              name: 'seasonalPricing',
              type: 'array',
              admin: { description: 'Override prices for specific dates' },
              fields: [
                { name: 'seasonName', type: 'text', required: true },
                { name: 'startDate', type: 'date', required: true },
                { name: 'endDate', type: 'date', required: true },
                { name: 'price', type: 'number', required: true },
              ],
            },
            {
              name: 'minNights',
              type: 'number',
              defaultValue: 1,
            },
            {
              name: 'maxNights',
              type: 'number',
            },
          ],
        },
        // === TAB: Amenities & Rules ===
        {
          label: 'Amenities & Rules',
          fields: [
            {
              name: 'amenities',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'WiFi', value: 'wifi' },
                { label: 'Air Conditioning', value: 'ac' },
                { label: 'Pool', value: 'pool' },
                { label: 'Kitchen', value: 'kitchen' },
                { label: 'Parking', value: 'parking' },
                { label: 'Washer', value: 'washer' },
                { label: 'Dryer', value: 'dryer' },
                { label: 'TV', value: 'tv' },
                { label: 'Gym', value: 'gym' },
                { label: 'Beach Access', value: 'beach_access' },
                { label: 'Hot Tub', value: 'hot_tub' },
                { label: 'BBQ Grill', value: 'bbq' },
                { label: 'Fireplace', value: 'fireplace' },
                { label: 'Garden', value: 'garden' },
                { label: 'Balcony', value: 'balcony' },
                { label: 'Terrace', value: 'terrace' },
                { label: 'Security', value: 'security' },
                { label: 'First Aid Kit', value: 'first_aid' },
                { label: 'Smoke Detector', value: 'smoke_detector' },
                { label: 'Water Heater', value: 'water_heater' },
              ],
            },
            {
              name: 'houseRules',
              type: 'textarea',
              admin: { description: 'Check-in/out times, pet policy, smoking rules' },
            },
            {
              name: 'petPolicy',
              type: 'select',
              options: [
                { label: 'Pets Allowed', value: 'allowed' },
                { label: 'Pets Not Allowed', value: 'not_allowed' },
                { label: 'Cats Only', value: 'cats_only' },
                { label: 'Dogs Only', value: 'dogs_only' },
              ],
            },
            {
              name: 'tenantPreference',
              type: 'select',
              options: [
                { label: 'Families', value: 'families' },
                { label: 'Couples', value: 'couples' },
                { label: 'Business Travelers', value: 'business' },
                { label: 'Anyone', value: 'anyone' },
              ],
            },
          ],
        },
        // === TAB: Media ===
        {
          label: 'Media',
          fields: [
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              admin: {
                isSortable: true,
                description: 'Drag to reorder images',
              },
            },
            {
              name: 'featuredImage',
              type: 'relationship',
              relationTo: 'media',
              admin: { description: 'Main image shown in listings' },
            },
          ],
        },
      ],
    },
    // === OUTSIDE TABS ===
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'availabilityCalendar',
      type: 'json',
      admin: {
        description: 'Blocked dates and availability (future phase)',
      },
    },
  ],
  indexes: [
    { fields: { status: 1 } },
    { fields: { nightlyPrice: 1 } },
    { fields: { 'address.city': 1 } },
  ],
};
```

### Leads Collection

```typescript
// Source: Payload CMS documentation
import { CollectionConfig } from 'payload';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'propertyReference', 'status', 'createdAt'],
  },
  access: {
    // Public can submit leads via inquiry form
    create: () => true,
    // Only authenticated users can view/manage leads
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Guest or lead name' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Phone number with country code' },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: { description: 'Inquiry message from guest' },
    },
    {
      name: 'propertyReference',
      type: 'relationship',
      relationTo: 'properties',
      admin: { description: 'Property this lead inquired about' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Converted', value: 'converted' },
        { label: 'Lost', value: 'lost' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal notes about this lead' },
    },
    // Metadata
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Property Inquiry', value: 'property_inquiry' },
        { label: 'Contact Form', value: 'contact_form' },
        { label: 'Activity Inquiry', value: 'activity_inquiry' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // TODO: Send email notification on new lead
        if (operation === 'create' && doc.status === 'new') {
          // await sendLeadNotificationEmail(doc);
        }
      },
    ],
  },
};
```

### Media Collection

```typescript
// Source: https://payloadcms.com/docs/upload/overview
import { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
  },
  upload: {
    staticDir: 'public/media',  // Local filesystem
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'small',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1280,
        height: 720,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'card',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    // Disable SVG upload for security
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Alternative text for accessibility' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Image caption or credit' },
    },
  ],
};
```

### Accounts Collection (MVP Single Account)

```typescript
// Source: Payload CMS documentation
import { CollectionConfig } from 'payload';

export const Accounts: CollectionConfig = {
  slug: 'accounts',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'email'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: () => false,  // Never delete the main account
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Business or brand name' },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'Short tagline for the website' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'About the business' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'state', type: 'text' },
        { name: 'zipCode', type: 'text' },
        { name: 'country', type: 'text' },
      ],
    },
  ],
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom CMS per client | Payload CMS (single codebase) | Phase 1 | Faster development, consistent patterns |
| MongoDB for flexibility | PostgreSQL + PostGIS | Phase 1 | Better for relational data, native geospatial |
| Local file storage | Local for MVP, S3 in v2 | Phase 2 | Simplicity now, scalability later |
| Array fields with JSON | Typed array fields | Payload 2.0+ | Better type safety, admin UI |

**Deprecated/outdated:**
- SQLite adapter for Payload - Point field not supported
- Mongoose adapter (MongoDB) - PostgreSQL preferred for relational + geospatial

## Assumptions Log

> List all claims tagged [ASSUMED] in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PostgreSQL PostGIS extension auto-installs with postgis/postgis:15-3.4 image | Environment | May need explicit extension creation in migration |
| A2 | Point field stores coordinates as [lng, lat] GeoJSON | Standard Stack | Verify in Payload docs - affects frontend map integration |
| A3 | GIST spatial index can be added via Payload schema hooks | Architecture | May require custom migration |

**If this table is empty:** All claims in this research were verified or cited - no user confirmation needed.

## Open Questions

1. **Property Status Access Control**
   - What we know: ROADMAP shows status with draft/published/archived values
   - What's unclear: Should draft properties be readable by admin only, or hidden from public API?
   - Recommendation: Draft = admin only, Published = public, Archived = hidden. Add `read` access function to filter by status.

2. **Geolocation Spatial Index**
   - What we know: PostgreSQL with PostGIS image is configured
   - What's unclear: Does Payload's point field automatically create a spatial index, or do we need a custom migration?
   - Recommendation: Add explicit GIST index via `beforeSchemaInit` hook using raw SQL

3. **Image Storage Path**
   - What we know: Local filesystem for MVP
   - What's unclear: Should `staticDir` be `public/media` or `payload/media`?
   - Recommendation: `public/media` for easier Next.js serving during development

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PostgreSQL 15 | Payload database | Via Docker | 15-3.4 (postgis image) | - |
| PostGIS | Geolocation/point field | Via Docker | 3.4 | - |
| Node.js 18+ | Payload runtime | System | 18+ detected | - |
| pnpm 8+ | Package manager | System | 8+ detected | - |

**Missing dependencies with no fallback:** None identified - all required dependencies are available via Docker or are already installed.

**Missing dependencies with fallback:** None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected |
| Config file | N/A - No test infrastructure |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-P2-01 | Properties collection with all base fields | Manual | `docker compose exec app curl localhost:3000/api/properties` | Manual verification |
| REQ-P2-02 | Leads collection for inquiry capture | Manual | `curl -X POST localhost:3000/api/leads -d '{"name":"Test","email":"test@test.com"}'` | Manual verification |
| REQ-P2-03 | Media collection with image uploads | Manual | Upload via Payload admin at localhost:3000/admin | Manual verification |
| REQ-P2-04 | All collections accessible in Payload admin | Manual | Navigate to localhost:3000/admin, verify collections listed | Manual verification |

### Sampling Rate
- **Per task commit:** Manual verification via Payload admin
- **Per wave merge:** Manual full-suite verification
- **Phase gate:** Manual verification that all collections appear in Payload admin

### Wave 0 Gaps
- [ ] `payload/src/collections/` - No test files exist yet
- [ ] Framework install: No test framework detected - all verification is manual
- [ ] Consider adding Jest or Vitest for future phases (Phase 7 or later)

*(If no gaps: "None - existing test infrastructure covers all phase requirements")*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Payload built-in auth for admin access |
| V3 Session Management | Yes | Payload JWT tokens with configurable expiry |
| V4 Access Control | Yes | Collection-level access functions |
| V5 Input Validation | Yes | Payload field validation (required, min/max, types) |
| V6 Cryptography | No | No custom crypto needed |

### Known Threat Patterns for Payload CMS

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SQL Injection | Tampering | Parameterized queries via Drizzle ORM |
| XSS in rich text | Spoofing | Sanitized output by React/Next.js |
| Unauthorized lead access | Information Disclosure | Access control on Leads collection |
| File upload abuse | Tampering | MIME type validation, size limits |
| Brute force admin login | Spoofing | Rate limiting via Payload config |

## Sources

### Primary (HIGH confidence)
- [Payload CMS Fields Documentation](https://payloadcms.com/docs/fields/overview) - Field types, array, relationship, point
- [Payload CMS Upload Documentation](https://payloadcms.com/docs/upload/overview) - Media configuration
- [Payload CMS Collections Documentation](https://payloadcms.com/docs/configuration/collections) - Collection config, indexes
- [Payload CMS Access Control Documentation](https://payloadcms.com/docs/access-control/overview) - Access functions
- [Payload CMS Hooks Documentation](https://payloadcms.com/docs/hooks/overview) - Lifecycle hooks

### Secondary (MEDIUM confidence)
- [Payload CMS Tabs Field](https://payloadcms.com/docs/fields/tabs) - Form organization
- [Payload CMS Select Field](https://payloadcms.com/docs/fields/select) - Options configuration
- [Payload CMS Database Overview](https://payloadcms.com/docs/database/overview) - Adapter selection

### Tertiary (LOW confidence)
- [Payload CMS Point Field PostGIS](https://payloadcms.com/docs/fields/point) - Assumed PostGIS GIST index needs custom configuration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Payload 3.85.0 verified from npm registry
- Architecture: HIGH - Based on official docs and established patterns
- Pitfalls: MEDIUM - Based on community knowledge and docs

**Research date:** 2026-06-01
**Valid until:** 2026-07-01 (30 days - Payload 3.x is stable)

---

## RESEARCH COMPLETE

**Phase:** 2 - Data Layer
**Confidence:** HIGH

### Key Findings
1. Payload 3.85.0 verified from npm - latest stable release
2. Point field requires PostgreSQL (not SQLite) - postgis/postgis:15-3.4 image already configured
3. Use Tabs for form organization in Properties collection
4. Array field for seasonal pricing and select with hasMany for amenities
5. Access control on Leads collection allows public create for inquiry forms
6. Spatial GIST index for geolocation may need custom migration/hook

### File Created
`/Users/rudhraksh/Desktop/Projects/Real Estate App/.planning/phases/02-data-layer/02-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Payload 3.85.0 verified, docs cited |
| Architecture | HIGH | Official patterns, established collection structure |
| Pitfalls | MEDIUM | Community patterns, may need verification |

### Open Questions
1. Draft property visibility (admin-only vs hidden)
2. GIST spatial index auto-creation by Payload
3. Image storage path preference (public/media vs payload/media)

### Ready for Planning
Research complete. Planner can now create PLAN.md files.
