# Phase 7 SPEC: Agent & Broker Lead Engine

**Status:** locked for implementation  
**Generated:** 2026-06-16  
**GSD mode:** auto, based on user request + codebase scouting + market research

## Objective

Create a copyable real-estate-agent vertical on top of the completed Airbnb MVP. The vertical must prove that an agent or brokerage can run an owned website with CMS-managed listings, lead capture, qualification, and campaign attribution instead of relying only on portal-paid leads.

## Ambiguity Report

| Dimension | Score | Notes |
|---|---:|---|
| Goal clarity | 0.88 | User explicitly wants the agent/broker solution, CMS listing site, lead generation, and paid/search ad readiness. |
| Boundary clarity | 0.78 | MVP can reuse the existing Payload/Next foundation; full CRM, WhatsApp API, paid ad API buying, and multi-tenant SaaS remain out of scope. |
| Constraint clarity | 0.72 | Must stay inside Next.js/Payload/Tailwind patterns and preserve the current Airbnb demo. |
| Acceptance clarity | 0.80 | Done means visible agent routes, CMS fields, lead-gen forms, and build verification pass. |
| **Ambiguity** | **0.20** | Gate passed. |

## In Scope

- Add agent/broker-specific property fields to the existing `properties` collection.
- Extend `leads` so enquiries can be qualified by intent, budget, timeline, source, campaign, and follow-up status.
- Add TypeScript types for agent listings and lead qualification fields.
- Add demo agent/broker inventory data that works without a database connection.
- Build public SSR routes:
  - `/agents`
  - `/agents/listings`
  - `/agents/listings/[id]`
  - `/agents/sell`
- Add buyer, seller, and listing-specific lead forms that pass structured details to the server action.
- Add conversion-ready UX patterns: prominent phone/WhatsApp-style CTAs, seller valuation, buyer match request, listing visit request, trust/process proof, and campaign-source capture.
- Preserve existing Airbnb routes and data behavior.

## Out Of Scope

- Real ad platform integrations with Google, Meta, or portal APIs.
- Live WhatsApp Business API messaging.
- Full CRM pipeline UI beyond Payload-admin lead fields.
- Multi-tenant account signup, custom domains, and per-agent self-onboarding.
- MLS/IDX/Indian portal feed imports.
- Payment collection, commissions, document signing, or transaction management.

## Requirements

### R1: Agent inventory can be managed from CMS

- Current state: `properties` is optimized for short-let/Airbnb inventory with nightly pricing, guest counts, amenities, and stay rules.
- Target state: the same collection supports sale/rent listings with agent/broker fields, listing intent, sale/rent pricing, RERA/disclosure identifiers, highlights, campaign hooks, and lead routing metadata.
- Acceptance:
  - [ ] Payload collection contains a vertical selector and agent/broker field groups.
  - [ ] Existing Airbnb fields still compile and remain usable.
  - [ ] `defaultColumns` make sense for mixed property inventory.

### R2: Leads support qualification and attribution

- Current state: `leads` captures name, email, phone, message, reference, status, source, and notes.
- Target state: leads also capture buyer/seller/renter intent, budget, timeline, preferred locality, source channel, UTM fields, lead score, and next follow-up.
- Acceptance:
  - [ ] Public lead creation remains allowed.
  - [ ] Admin users can see qualification fields in Payload.
  - [ ] Existing activity/property inquiry flows still validate.

### R3: Agent storefront demonstrates the owned lead path

- Current state: public storefront is written for Not Just A Stay.
- Target state: `/agents` shows a working brokerage-style website with visible listings, search/qualification prompts, seller valuation, buyer match, and lead capture.
- Acceptance:
  - [ ] `/agents` renders without a database.
  - [ ] First viewport contains a clear real-estate search/lead action, not just a marketing hero.
  - [ ] The page includes proof/process blocks and multiple lead routes.

### R4: Listing pages convert visits into qualified enquiries

- Current state: villa detail pages ask for stay details.
- Target state: agent listing detail pages show sale/rent economics, property facts, agent proof, source-aware visit request form, and similar next actions.
- Acceptance:
  - [ ] `/agents/listings` renders cards with sale/rent prices and listing status.
  - [ ] `/agents/listings/[id]` renders detail content with buyer visit request form.
  - [ ] Forms include intent, budget/timeline context, and property reference.

### R5: Campaign readiness is visible in code and UX

- Current state: public lead action logs basic data.
- Target state: server actions accept campaign-ready context and the UI has a seller lead route that can be used as a search/social landing page.
- Acceptance:
  - [ ] `submitAgentLead` validates and logs structured lead data.
  - [ ] `/agents/sell` can function as a search-ad landing page for valuation leads.
  - [ ] TypeScript build passes.

## Done Criteria

- [ ] Planning artifacts exist for Phase 7.
- [ ] Agent/broker collection and lead fields are implemented.
- [ ] Public agent routes render with fallback data.
- [ ] Existing Airbnb pages are not removed.
- [ ] `npm run build` in `frontend/` completes or any failure is documented with a concrete blocker.

