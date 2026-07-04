# Phase 7 PLAN: Agent & Broker Lead Engine

## Goal

Ship a first working agent/broker vertical on the existing MVP foundation.

## Work Items

### 7.1 CMS And Types

- Extend `frontend/payload-src/collections/PropertiesStub.ts` with vertical, sale/rent, agent, campaign, and lead-routing fields.
- Extend `frontend/payload-src/collections/Leads.ts` with qualification, source, UTM, score, and follow-up fields.
- Update `frontend/src/types/index.ts` with agent listing and lead-related fields.

### 7.2 Data And Actions

- Add agent fallback listings to `frontend/src/lib/data/properties.ts`.
- Add fetch helpers for agent listings and details.
- Extend schemas/actions with `agentLeadSchema` and `submitAgentLead`.

### 7.3 Public Agent Storefront

- Add `frontend/src/app/(frontend)/agents/page.tsx`.
- Add `frontend/src/app/(frontend)/agents/listings/page.tsx`.
- Add `frontend/src/app/(frontend)/agents/listings/[id]/page.tsx`.
- Add `frontend/src/app/(frontend)/agents/sell/page.tsx`.
- Add dedicated agent lead form and listing card components.

### 7.4 Verification

- Run frontend build.
- Start local dev server if build passes or failures are non-runtime.
- Inspect the new routes visually.
- Record limitations and next iteration.

## Acceptance Checks

- `/agents` works without a database and shows real property inventory.
- `/agents/listings` shows sale/rent cards.
- `/agents/listings/[id]` shows property facts and a buyer/visit lead form.
- `/agents/sell` shows a seller valuation lead path suitable for paid search/social.
- `npm run build` passes or has a documented external blocker.

