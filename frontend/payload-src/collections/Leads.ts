import type { CollectionConfig } from 'payload';
import { sendLeadWebhook } from '../../src/lib/webhook';

/**
 * Leads Collection
 * Captures inquiry data from property inquiry forms.
 *
 * Access Control:
 * - create: Public (anyone can submit an inquiry)
 * - read/update/delete: Authenticated users only (admin)
 *
 * @see D-09: Leads collection for inquiry capture
 * @see D-12: Owner role with full access
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'leadIntent', 'phone', 'source', 'score', 'status', 'createdAt'],
    description: 'Captures and qualifies buyer, renter, seller, and activity leads',
  },
  access: {
    // Public create - anyone can submit an inquiry form
    create: () => true,
    // Admin only - authenticated users can read leads
    read: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can update leads
    update: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can delete leads
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Guest or lead name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Contact email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Phone number with country code',
      },
    },
    {
      name: 'leadIntent',
      type: 'select',
      defaultValue: 'property_inquiry',
      options: [
        { label: 'Property Inquiry', value: 'property_inquiry' },
        { label: 'Schedule Visit', value: 'schedule_visit' },
        { label: 'Buyer Match', value: 'buyer_match' },
        { label: 'Rental Inquiry', value: 'rental_inquiry' },
        { label: 'Seller Valuation', value: 'seller_valuation' },
        { label: 'Brokerage Consultation', value: 'brokerage_consultation' },
        { label: 'Activity Inquiry', value: 'activity_inquiry' },
      ],
      admin: {
        description: 'What the lead is trying to do',
      },
    },
    {
      name: 'budget',
      type: 'text',
      admin: {
        description: 'Budget range captured from the lead form',
      },
    },
    {
      name: 'timeline',
      type: 'select',
      options: [
        { label: 'Immediately', value: 'immediately' },
        { label: 'This Month', value: 'this_month' },
        { label: '1-3 Months', value: '1_3_months' },
        { label: '3-6 Months', value: '3_6_months' },
        { label: '6+ Months', value: '6_plus_months' },
        { label: 'Researching', value: 'researching' },
      ],
      admin: {
        description: 'Buying, renting, or selling timeline',
      },
    },
    {
      name: 'preferredLocality',
      type: 'text',
      admin: {
        description: 'Preferred area or seller property locality',
      },
    },
    {
      name: 'propertyUse',
      type: 'select',
      options: [
        { label: 'Own Stay', value: 'own_stay' },
        { label: 'Investment', value: 'investment' },
        { label: 'Rental Income', value: 'rental_income' },
        { label: 'Commercial Use', value: 'commercial_use' },
        { label: 'Not Sure', value: 'not_sure' },
      ],
      admin: {
        description: 'Why the lead wants the property',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Inquiry message from guest',
      },
    },
    {
      name: 'propertyReference',
      type: 'relationship',
      relationTo: 'properties',
      admin: {
        description: 'Property this lead inquired about',
      },
    },
    {
      name: 'activityReference',
      type: 'relationship',
      relationTo: 'activities',
      admin: {
        description: 'Activity this lead inquired about',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        {
          label: 'New',
          value: 'new',
        },
        {
          label: 'Contacted',
          value: 'contacted',
        },
        {
          label: 'Visit Scheduled',
          value: 'visit_scheduled',
        },
        {
          label: 'Follow-up',
          value: 'follow_up',
        },
        {
          label: 'Qualified',
          value: 'qualified',
        },
        {
          label: 'Converted',
          value: 'converted',
        },
        {
          label: 'Lost',
          value: 'lost',
        },
        {
          label: 'Unqualified',
          value: 'unqualified',
        },
      ],
      admin: {
        description: 'Lead status in the sales pipeline',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this lead',
        position: 'sidebar',
      },
    },
    {
      name: 'score',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Lead quality score from 0-100',
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'text',
      admin: {
        description: 'Agent or team member responsible for this lead',
        position: 'sidebar',
      },
    },
    {
      name: 'nextFollowUpAt',
      type: 'date',
      admin: {
        description: 'Next scheduled follow-up',
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        {
          label: 'Property Inquiry',
          value: 'property_inquiry',
        },
        {
          label: 'Contact Form',
          value: 'contact_form',
        },
        {
          label: 'Activity Inquiry',
          value: 'activity_inquiry',
        },
        {
          label: 'Organic Search',
          value: 'organic_search',
        },
        {
          label: 'Google Search Ads',
          value: 'google_search_ads',
        },
        {
          label: 'Meta Ads',
          value: 'meta_ads',
        },
        {
          label: 'Portal Lead',
          value: 'portal_lead',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
        {
          label: 'Referral',
          value: 'referral',
        },
        {
          label: 'Direct',
          value: 'direct',
        },
      ],
      admin: {
        description: 'Source channel of the inquiry',
        position: 'sidebar',
      },
    },
    {
      name: 'campaign',
      type: 'group',
      admin: {
        description: 'Attribution context for paid search, social, portal, and WhatsApp campaigns',
      },
      fields: [
        { name: 'utmSource', type: 'text' },
        { name: 'utmMedium', type: 'text' },
        { name: 'utmCampaign', type: 'text' },
        { name: 'utmContent', type: 'text' },
        { name: 'utmTerm', type: 'text' },
        { name: 'landingPage', type: 'text' },
        { name: 'referrer', type: 'text' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.status === 'new') {
          console.log(`[Leads] New lead created: ${doc.name} <${doc.email}>`);

          // Fire webhook to external CRM (non-blocking)
          const config = {
            url: process.env.LEAD_WEBHOOK_URL ?? '',
            secret: process.env.LEAD_WEBHOOK_SECRET,
          };

          if (config.url) {
            sendLeadWebhook(config, doc as Record<string, unknown>).catch((err) =>
              console.error('[Leads] Webhook error:', err),
            );
          }
        }

        return doc;
      },
    ],
  },
  timestamps: true,
};
