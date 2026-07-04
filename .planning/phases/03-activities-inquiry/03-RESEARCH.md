# Phase 3: Activities & Inquiry - Research

**Researched:** 2026-06-01
**Domain:** Payload CMS 3.x Collections + Next.js 14 Server Actions + Form Handling
**Confidence:** HIGH

## Summary

Phase 3 implements two complementary systems: (1) an Activities collection for Airbnb experiences/excursions, and (2) inquiry form submission infrastructure. The Activities collection follows standard Payload patterns with relationship links to Properties. Inquiry forms use Next.js Server Actions with Zod validation, following the canonical `useActionState` pattern for progressive enhancement and error handling.

**Primary recommendation:** Use Payload's Local API via Server Actions for form submission (not REST), combined with Zod schema validation and `useActionState` for client-side state management.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Activities collection | Payload CMS (backend) | — | Collection schema, admin CRUD |
| Activities-Property linking | Payload CMS (backend) | — | Relationship field defines links |
| Inquiry form submission | Frontend Server (SSR) | API/Backend | Server Action processes form data |
| Form validation | Frontend Server (SSR) | Browser/Client | Zod schema validates server-side |
| Lead storage | Payload CMS (backend) | — | Leads collection persistence |

## User Constraints (from CONTEXT.md)

*No CONTEXT.md exists yet for this phase — all decisions are in scope for research.*

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AIRB-06 | Activity/Experience CRUD (title, description, price, media, availability) | Activities collection pattern |
| AIRB-07 | Activities linked to Properties | Relationship field configuration |
| AIRB-08 | Booking/Inquiry record (lead capture, not live payment) | Inquiry form + Leads collection |
| LEAD-01 | Property inquiry form (name, email, phone, message, property reference) | Inquiry form component + Server Action |
| LEAD-02 | Activity inquiry form (name, email, phone, message, activity reference) | Activity inquiry + Server Action |
| LEAD-03 | Leads visible in Payload admin per tenant | Leads collection (already implemented) |
| LEAD-04 | Lead status (New, Contacted, Qualified, Lost) | Leads collection status field (already implemented) |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Payload CMS | 3.x | Backend + Admin + Collections | Already in project |
| Next.js | 14.x | Frontend + Server Actions | Already in project |
| Zod | 3.x | Form validation | Already in project |
| React Hook Form | 7.x | Form state (optional, for complex forms) | Alternative to useActionState |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@payloadcms/sdk` | 3.x | Type-safe Payload SDK | Only if using REST API approach |

**Alternatives Considered:**
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local API (Server Actions) | REST API via SDK | Local API has lower latency for server-side calls; REST better for external clients |
| Zod validation | Custom validation | Zod provides TypeScript inference and is already in project |
| useActionState | React Hook Form + Zod Resolver | useActionState is simpler for basic forms; RHF better for complex client-side validation |

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser / Client                             │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │ Property Detail │    │ Activity Detail │                     │
│  │   Page (SSR)    │    │   Page (SSR)     │                     │
│  │                 │    │                 │                     │
│  │ [InquiryForm]   │    │ [ActivityForm]   │                     │
│  │  - name        │    │  - name          │                     │
│  │  - email       │    │  - email         │                     │
│  │  - phone       │    │  - phone         │                     │
│  │  - message     │    │  - message       │                     │
│  └────────┬───────┘    └────────┬───────┘                     │
└───────────┼─────────────────────┼───────────────────────────────┘
            │                     │
            │ HTML Form Submit    │
            │ (Server Action)     │
            ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Frontend Server (Next.js)                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ Server Actions (app/actions/inquiry.ts)                  │     │
│  │ 1. Validate with Zod schema                             │     │
│  │ 2. Call Payload Local API (payload.create)              │     │
│  │ 3. Return { success: true } or { errors: {...} }       │     │
│  └────────────────────────┬────────────────────────────────┘   │
│                           │                                      │
│                           │ payload.create({                     │
│                           │   collection: 'leads',               │
│                           │   data: { name, email, ... }        │
│                           │ })                                  │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
            │
            │ PostgreSQL
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Payload CMS + PostgreSQL                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Activities   │  │   Leads      │  │  Properties  │            │
│  │  (new)      │  │  (existing)  │  │  (existing)  │            │
│  │             │◄─┤              │  │              │            │
│  │ linkedProps │  │ propertyRef   │  │              │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                  │
│  ┌──────────────┐                                               │
│  │    Media     │                                               │
│  │  (existing)  │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
frontend/src/
├── app/
│   └── [tenant]/
│       ├── actions/
│       │   └── inquiry.ts          # Server Actions for forms
│       ├── properties/
│       │   └── [id]/
│       │       └── InquiryForm.tsx  # Property inquiry form
│       └── activities/
│           └── [id]/
│               └── InquiryForm.tsx  # Activity inquiry form
└── components/
    └── ui/
        └── inquiry-form.tsx         # Shared inquiry form component

payload/src/collections/
├── Activities.ts                    # NEW: Activities collection
└── index.ts                        # UPDATE: Export Activities
```

### Pattern 1: Activities Collection (Payload)

**What:** Payload CMS collection for Airbnb experiences/excursions with relationship links to properties.

**When to use:** When managing add-on experiences that can be booked alongside properties.

**Example:**
```typescript
// Source: payloadcms.com/docs/configuration/collections + research
import type { CollectionConfig } from 'payload';

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'createdAt'],
  },
  access: {
    read: () => true, // Public read
    create: ({ req: { user } }) => Boolean(user), // Admin only
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      type: 'text',
      admin: { description: 'Brief tagline (max 150 chars)' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: { description: 'Price per person' },
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'INR',
      options: [
        { label: 'INR', value: 'INR' },
        { label: 'USD', value: 'USD' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      admin: { description: 'e.g., "2 hours", "Full day"' },
    },
    {
      name: 'maxParticipants',
      type: 'number',
      admin: { description: 'Maximum group size' },
    },
    {
      name: 'availability',
      type: 'json',
      admin: { description: 'Availability schedule as JSON' },
    },
    {
      name: 'linkedProperties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      admin: { description: 'Properties this activity is available at' },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
};
```

### Pattern 2: Inquiry Server Action (Next.js)

**What:** Server Action that validates form data with Zod and creates a lead in Payload.

**When to use:** For any inquiry/contact form submission.

**Example:**
```typescript
// Source: nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
'use server';

import { z } from 'zod';
import { getPayload } from 'payload';
import { revalidatePath } from 'next/cache';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  propertyReference: z.string().optional(),
  activityReference: z.string().optional(),
  source: z.enum(['property_inquiry', 'activity_inquiry', 'contact_form']),
});

export type InquiryState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function submitInquiry(
  prevState: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  // 1. Extract data from FormData
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    message: formData.get('message'),
    propertyReference: formData.get('propertyReference') || undefined,
    activityReference: formData.get('activityReference') || undefined,
    source: formData.get('source') || 'contact_form',
  };

  // 2. Validate with Zod
  const validated = inquirySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // 3. Create lead in Payload
  try {
    const payload = await getPayload({});
    await payload.create({
      collection: 'leads',
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        message: validated.data.message,
        propertyReference: validated.data.propertyReference,
        status: 'new',
        source: validated.data.source,
      },
      overrideAccess: true, // Bypass access control for public submission
    });

    // 4. Revalidate cache and return success
    revalidatePath('/');
    return { success: true, message: 'Inquiry submitted successfully!' };
  } catch (error) {
    console.error('Lead creation failed:', error);
    return { message: 'Failed to submit inquiry. Please try again.' };
  }
}
```

### Pattern 3: Client-Side Form with useActionState

**What:** React Client Component that uses `useActionState` for form submission with loading and error states.

**When to use:** For all inquiry forms to provide good UX with progressive enhancement.

**Example:**
```typescript
// Source: nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
'use client';

import { useActionState } from 'react-dom';
import { submitInquiry, type InquiryState } from '@/app/[tenant]/actions/inquiry';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface InquiryFormProps {
  propertyId?: string;
  activityId?: string;
}

export function InquiryForm({ propertyId, activityId }: InquiryFormProps) {
  const initialState: InquiryState = {};
  const [state, action, pending] = useActionState(submitInquiry, initialState);

  const source = activityId ? 'activity_inquiry' : 'property_inquiry';
  const reference = activityId || propertyId;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name={activityId ? 'activityReference' : 'propertyReference'} value={reference} />

      {/* Success Message */}
      {state.success && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          {state.message}
        </div>
      )}

      {/* Error Message */}
      {state.message && !state.success && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          {state.message}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name *</label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          disabled={pending}
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email *</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={pending}
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          disabled={pending}
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium">Message *</label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={pending}
        />
        {state.errors?.message && (
          <p className="mt-1 text-sm text-red-600">{state.errors.message[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Submitting...' : 'Submit Inquiry'}
      </Button>
    </form>
  );
}
```

### Anti-Patterns to Avoid
- **REST API for server-side form submission:** Higher latency than Local API. Use Local API from Server Actions.
- **Client-side only validation:** Breaks without JavaScript. Always validate server-side too.
- **Not using `overrideAccess: true` for public submissions:** Leads collection requires auth for reads, but public create should work without auth. Local API bypasses access control when needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom regex validation | Zod | TypeScript inference, composable schemas |
| Form state management | useState for form fields | useActionState | Native React 19 support, works without JS |
| Payload API calls | REST API with fetch | Local API (getPayload) | Lower latency, type-safe, SSR-compatible |

**Key insight:** Payload's Local API (`getPayload()`) is designed for server-side usage and provides the lowest-latency path to database operations from Next.js Server Components and Server Actions.

## Common Pitfalls

### Pitfall 1: Access Control Mismatch
**What goes wrong:** Leads collection requires auth for all operations, but public form submission fails.
**Why it happens:** Payload's default access control checks for authenticated user. Public `create: () => true` is needed for forms.
**How to avoid:** Use `overrideAccess: true` when creating leads from Server Actions, or set `create: () => true` in collection access control.
**Warning signs:** 401/403 errors on form submission, leads not appearing in admin.

### Pitfall 2: Form Data Type Mismatch
**What goes wrong:** Form submission silently fails or returns wrong data types.
**Why it happens:** FormData returns strings, but Zod expects specific types (number, boolean).
**How to avoid:** Parse explicitly or use Zod's `z.coerce` for numeric fields.
**Warning signs:** Type errors in Zod validation, undefined values.

### Pitfall 3: Missing Activity Reference in Leads
**What goes wrong:** Activity inquiries create leads but don't link to the activity.
**Why it happens:** `activityReference` field not set in form or Server Action.
**How to avoid:** Add `activityReference` to form as hidden field and include in data object.
**Warning signs:** Leads show "No related document" in Payload admin.

## Code Examples

### Fetching Activities with Property Links (Server Component)
```typescript
// Source: payloadcms.com/docs/local-api/overview
import { getPayload } from 'payload';
import config from '@payload-config';

async function getActivities() {
  const payload = await getPayload({ config });

  const { docs: activities } = await payload.find({
    collection: 'activities',
    where: {
      status: { equals: 'published' },
    },
    depth: 2, // Include linked properties
  });

  return activities;
}
```

### Fetching Single Activity with Property Reference
```typescript
async function getActivity(id: string) {
  const payload = await getPayload({ config });

  const activity = await payload.findByID({
    collection: 'activities',
    id,
    depth: 1, // Include linked property details
  });

  return activity;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| REST API + fetch | Server Actions + Local API | Next.js 14 App Router era | Lower latency, type-safe |
| useState for form fields | useActionState / useFormState | React 19 / Next.js 15 | Better UX, works without JS |
| Custom validation | Zod schema validation | 2021+ | TypeScript inference, composable |

**Deprecated/outdated:**
- `useFormState` (React 18) - replaced by `useActionState` (React 19 / Next.js 15)
- `getServerSideProps` - replaced by Server Components for data fetching

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Activities availability stored as JSON field | Activities Collection | Could use dedicated date range fields instead; JSON is more flexible but less queryable |
| A2 | Single inquiry form component works for both property and activity | Inquiry Form | If UI requirements differ significantly, may need separate components |
| A3 | Leads collection already has `activityReference` field | Inquiry Submission | Need to verify Leads collection has this field or add it |

**Assumptions needing validation:**
- A1: JSON availability is acceptable for MVP (Phase 5 can add calendar UI)
- A3: Leads collection (line 71-70 in existing file) only has `propertyReference` - need to add `activityReference`

## Open Questions

1. **Should activities have a dedicated inquiry source field in Leads, or reuse existing?**
   - What we know: Leads collection has `source` field with 'activity_inquiry' option
   - What's unclear: Whether we need a separate `activityReference` relationship field or if the existing pattern is sufficient
   - Recommendation: Add `activityReference` relationship field to Leads to match property pattern

2. **How should activity availability be displayed to users?**
   - What we know: Phase 5 covers storefront SSR pages
   - What's unclear: Whether Phase 3 should include availability display components or just data storage
   - Recommendation: Store availability data in Phase 3, display in Phase 5

3. **Should there be a max relationship count for linkedProperties?**
   - What we know: Activities can be linked to multiple properties
   - What's unclear: Any practical limit needed (e.g., max 10 properties per activity)
   - Recommendation: No limit for MVP; add `maxRows` if needed based on real usage

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Payload CMS | Collections, Admin | ✓ | 3.85.0 | — |
| Next.js | Server Actions | ✓ | 14.x | — |
| Zod | Validation | ✓ | 3.23.0 | — |
| PostgreSQL | Data persistence | ✓ | 15+ | — |

**All dependencies available — no external installations needed.**

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest + React Testing Library |
| Config file | `jest.config.ts` (if exists) |
| Quick run command | `npm test -- --testPathPattern="inquiry" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| AIRB-06 | Create activity with all fields | Unit | `npm test -- activities.test.ts` | Needs creation |
| AIRB-07 | Activity-Property linking | Unit | `npm test -- activities.test.ts` | Needs creation |
| LEAD-01 | Property inquiry form submission | Unit | `npm test -- inquiry.test.ts` | Needs creation |
| LEAD-02 | Activity inquiry form submission | Unit | `npm test -- inquiry.test.ts` | Needs creation |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern="inquiry|activities" --passWithNoTests`
- **Per wave merge:** `npm test -- --passWithNoTests`
- **Phase gate:** Full suite green before `/gsd:verify-phase`

### Wave 0 Gaps
- [ ] `frontend/src/app/[tenant]/actions/inquiry.test.ts` — tests Server Action
- [ ] `payload/src/collections/Activities.test.ts` — tests collection config (if applicable)
- [ ] Test infrastructure check — verify jest.config exists

*(If no gaps: "None — existing test infrastructure covers all phase requirements")*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | Not required for public forms |
| V3 Session Management | No | Not required for public forms |
| V4 Access Control | Yes | Payload access control + overrideAccess |
| V5 Input Validation | Yes | Zod schema validation |
| V6 Cryptography | No | No sensitive data at this stage |

### Known Threat Patterns for Payload + Next.js Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Form injection | Tampering | Zod validation, Payload field types |
| Lead spam | Information Disclosure | Payload access control restricts reads to auth |
| XSS in form fields | Spoofing | React auto-escapes, Payload sanitization |

## Sources

### Primary (HIGH confidence)
- [Payload CMS Collections](https://payloadcms.com/docs/configuration/collections) - Collection config patterns
- [Payload CMS Local API](https://payloadcms.com/docs/local-api/overview) - `getPayload()` usage
- [Payload CMS Access Control](https://payloadcms.com/docs/access-control/overview) - Public create pattern
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Form submission patterns
- [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms) - useActionState with Server Actions

### Secondary (MEDIUM confidence)
- [Zod Documentation](https://zod.dev/) - Schema validation patterns
- [WebSearch: Payload CMS 3 relationship field](https://duckduckgo.com/?q=Payload+CMS+3+relationship+field+hasMany+configuration) - Relationship configuration
- [WebSearch: Next.js 14 Server Action form validation](https://duckduckgo.com/?q=Next.js+14+React+Server+Action+form+validation+Zod) - Form validation patterns

### Tertiary (LOW confidence)
- [Payload CMS REST API](https://payloadcms.com/docs/rest-api/overview) - Not used, documented for reference

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project, canonical patterns
- Architecture: HIGH - Server Actions + Local API is well-documented
- Pitfalls: MEDIUM - Based on Payload 2.x experience, 3.x may differ

**Research date:** 2026-06-01
**Valid until:** 2026-07-01 (30 days - stable domain)
