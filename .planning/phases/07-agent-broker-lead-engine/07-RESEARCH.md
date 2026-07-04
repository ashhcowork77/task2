# Phase 7 Research: Agent & Broker Lead Engine

## Research Question

What should a website + CMS + lead-generation product for real-estate agents and brokerages actually solve, and how should it plug into search ads, performance marketing, portal leads, and owned follow-up?

## Sources Checked

- User-provided `deep-research-report-2.md`, especially 99acres/MagicBricks pain around low-quality leads, poor support, opaque package ROI, and portal dependency.
- NAR 2025 home buyer/seller highlights: annual buyer/seller behavior report, July 2024-June 2025 transaction window. Source: https://www.nar.realtor/research-and-statistics/research-reports/highlights-from-the-profile-of-home-buyers-and-sellers
- Google Ads Commerce Blog on enhanced real-estate Local Services Ads for home listings. Source: https://blog.google/products/ads-commerce/new-real-estate-ads-formats/
- Google personalized ads policy FAQ for housing/employment/credit restrictions. Source: https://support.google.com/adspolicy/answer/9997418
- Meta housing special ad category help pages from search-accessible snippets. Source: https://www.facebook.com/business/help/1198401317374558
- Compass agent marketing/technology pages. Source: https://www.compass.com/agents-compass/marketing/
- Keller Williams Command CRM article. Source: https://outfront.kw.com/technology/kw-command-new-enhancements-elevate-the-ultimate-real-estate-crm-for-agents-and-teams/
- RE/MAX technology positioning. Source: https://join.remax.com/technology/
- Homes.com agent advertising page. Source: https://www.homes.com/advertise/agents/
- Sierra Interactive real-estate CRM/IDX/ad management pages. Source: https://www.sierrainteractive.com/
- Real Geeks website, CRM, and lead-generation pages. Source: https://www.realgeeks.com/ and https://www.realgeeks.com/lead-generation-for-real-estate/
- BoldTrail/Inside Real Estate platform and lead-engine pages. Source: https://insiderealestate.com/solution/ and https://boldtrail.com/generate-real-estate-leads/
- Luxury Presence plans and paid ads pages. Source: https://www.luxurypresence.com/plans/ and https://www.luxurypresence.com/paid-ads-management/
- Indian portal/product pages: 99acres buy services, MagicBricks advertise/post property, Housing.com seller pages, NoBroker seller plan pages.

## What Is Known

1. The customer problem is not "agents need a prettier website." It is "agents spend on portals, ads, and referrals, but the lead path is scattered, slow, low-trust, and hard to attribute."
2. Large brokerages sell an integrated operating stack: CRM, listing marketing, branded agent pages, referral networks, ad tools, analytics, and support.
3. Lead-gen SaaS competitors converge on the same core bundle: IDX/listing website, CRM, automated follow-up, paid search/social campaigns, retargeting, reporting, and onboarding.
4. Portal pain in the Indian context is strongly tied to fake/low-quality leads, relationship managers disappearing after payment, paywalls around contact access, package upsells, and weak performance transparency.
5. Search ads and social ads for housing require compliance awareness. Google and Meta both restrict housing-related targeting in at least some markets, especially the US/Canada. Product design should favor compliant capture, contextual landing pages, first-party audiences, and source-level attribution rather than fragile demographic targeting.
6. The buyer/seller journey is local, trust-heavy, and high consideration. The website must support both hot listing visitors and cold/warm seller leads researching whether to appoint an agent.

## Competitor/Funnel Patterns

| Player | Pattern observed | Product implication |
|---|---|---|
| Compass | Brand templates, expert guidance, referral network, integrated CRM claims | Smaller brokers need brand authority and CRM-like follow-up without joining a giant brokerage. |
| Keller Williams | Command positions CRM as a hub for lead gen, listing marketing, and client interactions | Lead source, follow-up, and listing promotion should live together. |
| RE/MAX | Tech stack marketed as time-saving and transaction-growing | Sell operational relief, not only more traffic. |
| Homes.com | Listing boost, retargeting, direct listing-agent connection, lead vetting, analytics, in-house consultant | "Your listing, your lead" is a powerful broker-friendly frame. |
| Sierra Interactive | Website + CRM + automation + ads, organic and paid lead generation | Owned website should be the source of truth for campaigns and nurture. |
| Real Geeks | Website, CRM, local lead packages, Google PPC, social ads, retargeting, AI assistant | The MVP should expose the same building blocks even if automation is stubbed. |
| BoldTrail | AI CRM, IDX sites, lead generation services, automated follow-up | The product needs an automation surface and future integration hooks. |
| Luxury Presence | Agent subdomain sites, property sites, Digital CMA, paid ads, approval controls, performance dashboard | Seller valuation/CMA is a key seller-lead magnet. |
| 99acres/MagicBricks | Visibility, response promises, paid packages, relationship manager upsells | Our product should counter with transparent lead source, qualification, and follow-up reporting. |

## Buyer Diagnosis

### First beachhead

Small-to-mid-market agent teams and boutique brokerages with active resale/rental inventory, some ad budget, and frustration with portal package ROI.

### Primary jobs

- Show credible inventory without sending buyers away to a portal.
- Capture buyer/renter leads with enough context to prioritize follow-up.
- Capture seller leads through valuation, "sell my property," and market appraisal pages.
- Know which listing, ad, keyword, social creative, portal, or referral generated the lead.
- Follow up quickly enough that paid leads do not go cold.
- Prove performance to brokerage owners and property sellers.

### Main objections

- "Portals already have traffic."
- "Website leads are low quality."
- "I do not have time to manage another tool."
- "Paid ads burn money."
- "Can this help me win listings, not only buyers?"
- "Will it work in my city/locality?"

## Compactum Pass 1: Raw Solution

Initial solution: build an agent website with CMS-managed sale/rent listings, buyer enquiry forms, seller valuation page, and lead records.

Framework verdict: useful but not enough. It sounds like a website project, while the buyer pays for better lead economics. It needs attribution, qualification, follow-up, and seller-acquisition surfaces.

## Compactum Pass 2: Offer And Funnel Repair

Reposition as an "owned lead engine for agents and brokers."

Must include:

- Listing CMS and branded property pages.
- Buyer/renter capture on every listing.
- Seller valuation/CMA page as a separate campaign landing path.
- Lead qualification fields: intent, budget, timeline, locality, financing/readiness.
- Source tracking: organic, paid search, paid social, portal, referral, WhatsApp, direct.
- Follow-up fields in Payload: status, score, next action, next follow-up.
- Proof and trust: RERA/licence fields, agent profile, sold/rented stats, response promise, process.
- Campaign structure: listing ads, locality ads, seller valuation ads, retargeting.

Framework verdict: stronger. It addresses the stopping point after enquiry and the business owner's doubt about ROI.

## Compactum Pass 3: MVP Cut

Build now:

- Agent/broker demo storefront.
- Listing list and detail routes with demo fallback data.
- Seller valuation route.
- Agent lead form and server action.
- CMS fields for agent listings and lead quality.
- Planning docs recording the strategy.

Defer:

- True CRM dashboard outside Payload.
- WhatsApp Business API.
- Google/Meta API integrations.
- Portal imports.
- Multi-tenant signup.

Framework verdict: passes. It creates a visible buyer path and enough operational structure to sell the next iteration.

## Product Strategy

**Position:** We do not replace property portals. We make agents less dependent on them by turning every listing, search visit, ad click, referral, and WhatsApp conversation into an owned, trackable lead path.

**Public promise:** A professional property website with CMS, lead capture, qualification, and campaign tracking for agents and brokers who want more control over enquiries.

**Internal mechanism:** owned inventory pages + first-party lead capture + source attribution + qualification + fast follow-up + seller lead magnet.

## Recommended Product Modules

1. Listing CMS
   - Sale/rent status, price, locality, RERA/license disclosure, photos, facts, highlights.
2. Lead Capture
   - Buyer visit request, renter enquiry, seller valuation, investment brief, WhatsApp/call routes.
3. Lead Qualification
   - Intent, budget, timeline, location preference, financing state, source, score.
4. Campaign Pages
   - Listing-specific landing pages, locality pages, seller valuation pages, open house pages.
5. Follow-Up OS
   - Payload lead status, next follow-up, notes, assigned agent, source reporting.
6. Proof Layer
   - Agent profile, sold/rented count, response promise, testimonials/case studies, verified listings.
7. Future Integrations
   - WhatsApp Business API, call tracking, Google Ads offline conversion import, Meta CAPI, portal lead import, CRM export.

## Risks And Constraints

- Housing ad targeting restrictions can affect paid-search/social tactics by market; avoid product claims that require non-compliant demographic targeting.
- Portal lead quality complaints are directional evidence, not a statistically representative sample.
- "Guaranteed leads" should not be used publicly until real performance data exists.
- Any RERA/license and compliance display must be populated by the client and verified before publication.
- The MVP logs lead data; database-backed creation depends on Payload/database runtime setup.

