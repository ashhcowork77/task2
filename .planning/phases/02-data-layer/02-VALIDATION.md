# Phase 2 Data Layer - Validation Strategy

## Phase Goal
Create the data layer for the Real Estate SaaS platform with Payload CMS collections supporting the Airbnb vertical.

## Collections to Validate

### 1. Properties Collection (Plan 2.1)
**File:** `payload/src/collections/PropertiesStub.ts`

**Validation Checklist:**
- [ ] File exists and exports `Properties` collection
- [ ] Has `type: 'tabs'` field with 6 tabs:
  - [ ] Basic Info (title, description, shortDescription)
  - [ ] Location (address group, geolocation point, locality)
  - [ ] Property Details (bhkType, propertyType, furnishingStatus, bedrooms, bathrooms, maxGuests, floor group, facing)
  - [ ] Pricing (nightlyPrice, currency, seasonalPricing array, minNights, maxNights)
  - [ ] Amenities & Rules (amenities with hasMany, houseRules, petPolicy, tenantPreference)
  - [ ] Media (gallery relationship, featuredImage relationship)
- [ ] Status field in sidebar (Draft, Published, Archived)
- [ ] Access control: read: () => true, create/update/delete require auth
- [ ] Indexes defined: status, nightlyPrice, 'address.city'
- [ ] TypeScript compiles without errors

### 2. Leads Collection (Plan 2.2)
**File:** `payload/src/collections/Leads.ts`

**Validation Checklist:**
- [ ] File exists and exports `Leads` collection
- [ ] Public create access: `create: () => true`
- [ ] Admin-only read/update/delete access
- [ ] Required fields: name (text), email (email)
- [ ] Optional fields: phone, message, notes, source
- [ ] propertyReference relationship to 'properties'
- [ ] status select with defaultValue: 'new' (New, Contacted, Qualified, Converted, Lost)
- [ ] afterChange hook placeholder for email notifications
- [ ] TypeScript compiles without errors

### 3. Media Collection (Plan 2.3)
**File:** `payload/src/collections/Media.ts`

**Validation Checklist:**
- [ ] File exists and exports `Media` collection
- [ ] Upload configuration present
- [ ] staticDir: 'public/media'
- [ ] imageSizes defined:
  - [ ] thumbnail: 200x200
  - [ ] small: 400x300
  - [ ] card: 768x512
  - [ ] large: 1280x720
  - [ ] hero: 1920x1080
- [ ] adminThumbnail: 'card'
- [ ] MIME types restricted to: image/jpeg, image/png, image/webp, image/gif (no SVG)
- [ ] alt field is required
- [ ] caption field optional
- [ ] public/media directory exists
- [ ] TypeScript compiles without errors

### 4. Accounts Collection + Wiring (Plan 2.4)
**Files:**
- `payload/src/collections/Accounts.ts`
- `payload/src/collections/index.ts`
- `payload.config.ts`

**Validation Checklist:**

**Accounts Collection:**
- [ ] File exists and exports `Accounts` collection
- [ ] slug: 'accounts'
- [ ] delete: () => false (account protection)
- [ ] Fields: name (required), email (required), phone, tagline, description
- [ ] logo relationship to 'media'
- [ ] socialLinks group (instagram, facebook, twitter, linkedin, youtube)
- [ ] address group (street, city, state, zipCode, country)

**Index Export:**
- [ ] File exists: `payload/src/collections/index.ts`
- [ ] Exports `collections` array
- [ ] All four collections included: PropertiesStub, Leads, Media, Accounts

**Payload Config:**
- [ ] Imports from `./payload/src/collections` (index)
- [ ] Uses `collections: collections` in buildConfig
- [ ] No direct TenantsStub or PropertiesStub imports
- [ ] TypeScript compiles without errors

**Database Schema:**
- [ ] Docker containers running
- [ ] Migration completes successfully (exit code 0)
- [ ] All collections visible in Payload admin at localhost:3000/admin
- [ ] No errors in Docker logs

## Automated Verification Commands

```bash
# Phase 2.1 - Properties
ls payload/src/collections/PropertiesStub.ts
grep -c "type: 'tabs'" payload/src/collections/PropertiesStub.ts
grep -c "type: 'point'" payload/src/collections/PropertiesStub.ts
grep "nightlyPrice" payload/src/collections/PropertiesStub.ts

# Phase 2.2 - Leads
ls payload/src/collections/Leads.ts
grep "create: () => true" payload/src/collections/Leads.ts
grep "relationTo: 'properties'" payload/src/collections/Leads.ts

# Phase 2.3 - Media
ls payload/src/collections/Media.ts
grep "staticDir: 'public/media'" payload/src/collections/Media.ts
grep "required: true" payload/src/collections/Media.ts | grep alt
ls -d public/media

# Phase 2.4 - Wiring
ls payload/src/collections/Accounts.ts
ls payload/src/collections/index.ts
grep "collections: collections" payload.config.ts
! grep "TenantsStub" payload.config.ts

# TypeScript compilation
cd payload && npx tsc --noEmit

# Docker migration
docker compose exec app npx payload migrate
```

## Manual Verification Steps

1. **Open Payload Admin:** http://localhost:3000/admin
2. **Login with admin credentials**
3. **Navigate to each collection and verify:**
   - Properties: 6 tabs visible, all fields present
   - Leads: Form fields for lead submission
   - Media: Upload interface visible
   - Accounts: Branding fields visible
4. **Test database migration:** Run `docker compose logs app | tail -50` to check for errors

## Success Criteria Summary

All four plans must produce:
- TypeScript compilation passes (no errors)
- Collections export CollectionConfig
- All required fields present per acceptance criteria
- Access control correctly configured
- Database schema migration succeeds
- Collections visible in Payload admin UI
