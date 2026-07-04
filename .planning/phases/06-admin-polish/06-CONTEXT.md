# Phase 6 Context: Admin Polish

**Created:** 2026-06-02

## Phase Overview

**Goal:** Payload admin forms optimized for non-technical users.

**Success Criteria:**
1. Property edit form with clean field groupings
2. Field labels are user-friendly
3. Helpful hints for complex fields
4. Activity edit form polished
5. Media library is intuitive

## Current State

### Properties Collection (`payload/src/collections/PropertiesStub.ts`)

Already has:
- Tab-based organization (Basic Info, Location, Property Details, Pricing, Amenities & Rules, Media)
- Field descriptions on most fields
- Default values where appropriate
- Status in sidebar

### Activities Collection (`payload/src/collections/Activities.ts`)

Already has:
- Tab-based organization (Basic Info, Details, Pricing, Media, Availability)
- Field descriptions on most fields
- Status in sidebar

### Gaps Identified

1. **Field labels** - Uses technical terms (BHK, INR) instead of user-friendly labels
2. **Complex field hints** - Some fields need better descriptions or examples
3. **Media upload UX** - Need guidance on image requirements, sizing
4. **Form validation** - Some required fields lack clear indication
5. **Conditional fields** - Some fields only make sense with certain selections

## Approach

Phase 6 is lightweight - no new features, just admin UX improvements:

1. **Plan 6.1:** Property Form Polish
   - Add friendly field labels with `label` overrides
   - Enhance descriptions with examples
   - Group related fields more logically
   - Add conditionals where helpful

2. **Plan 6.2:** Activity & Media Polish
   - Polish Activity fields
   - Add media upload guidance
   - Ensure image preview is clear

## Tech Stack Context

- **Payload CMS 3.x** - Uses `admin.label`, `admin.description`, `admin.placeholder`
- **No custom components needed** - Using Payload's built-in field customization
- **TypeScript** - All field configs are typed

## Demo Client

**Not Just A Stay** (Airbnb vertical)
- Non-technical client needs to manage properties without developer help
- Clear labels and hints essential for adoption
