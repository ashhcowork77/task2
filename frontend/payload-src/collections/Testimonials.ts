import type { CollectionConfig } from 'payload';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },

  admin: {
    useAsTitle: 'clientName',
    description: 'Manage client testimonials that appear on the website.',
    defaultColumns: ['clientName', 'rating', 'propertyType', 'status', 'createdAt'],
    listSearchableFields: ['clientName', 'quote'],
  },

  access: {
    read: ({ req: { user } }) => {
      // Public can read published testimonials
      if (!user) return { status: { equals: 'published' } };
      return true;
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    // Client Information
    {
      name: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the client who gave the testimonial',
      },
    },
    {
      name: 'clientPhoto',
      label: 'Client Photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Photo of the client (optional)',
      },
    },
    {
      name: 'clientLocation',
      label: 'Client Location',
      type: 'text',
      admin: {
        description: 'City or area where the client is based',
      },
    },

    // Testimonial Content
    {
      name: 'quote',
      label: 'Testimonial Quote',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
        description: 'The main testimonial text',
      },
    },

    // Rating
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Star rating from 1 to 5',
      },
    },

    // Property Details
    {
      name: 'propertyType',
      label: 'Property Type',
      type: 'select',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Plot/Land', value: 'plot' },
        { label: 'Rental', value: 'rental' },
      ],
    },
    {
      name: 'propertyReference',
      label: 'Property Reference',
      type: 'text',
      admin: {
        description: 'Reference to the property if applicable (e.g., 3 BHK Villa in Whitefield)',
      },
    },

    // Agent Attribution
    {
      name: 'agentName',
      label: 'Agent Name',
      type: 'text',
      admin: {
        description: 'Name of the agent who handled this client',
      },
    },

    // Date
    {
      name: 'date',
      label: 'Testimonial Date',
      type: 'date',
      admin: {
        description: 'When the testimonial was received',
      },
    },

    // Status
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Only published testimonials are shown on the website',
      },
    },

    // Featured
    {
      name: 'featured',
      label: 'Featured Testimonial',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured testimonials are highlighted on the website',
      },
    },
    {
      name: 'featuredOrder',
      label: 'Featured Order',
      type: 'number',
      admin: {
        description: 'Order for featured testimonials (lower = higher priority)',
        condition: (_, siblingData) => siblingData?.featured === true,
      },
    },

    // Source
    {
      name: 'source',
      label: 'Source',
      type: 'select',
      options: [
        { label: 'Direct Feedback', value: 'direct' },
        { label: 'Google Review', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Justdial', value: 'justdial' },
        { label: ' Sulekha', value: 'sulekha' },
        { label: 'MagicBricks', value: 'magicbricks' },
        { label: '99acres', value: '99acres' },
        { label: 'Referral', value: 'referral' },
      ],
    },

    // Additional Context
    {
      name: 'transactionType',
      label: 'Transaction Type',
      type: 'select',
      options: [
        { label: 'Purchase', value: 'purchase' },
        { label: 'Sale', value: 'sale' },
        { label: 'Rent', value: 'rent' },
        { label: 'Investment', value: 'investment' },
        { label: 'Consultation', value: 'consultation' },
      ],
    },
    {
      name: 'transactionValue',
      label: 'Transaction Value',
      type: 'text',
      admin: {
        description: 'Value of the transaction (e.g., ₹85 Lakhs)',
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set date if not provided
        if (!data.date) {
          data.date = new Date().toISOString();
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`[Testimonials] Testimonial ${operation}: ${doc.clientName} (${doc.status})`);
      },
    ],
  },

  indexes: [
    {
      fields: ['status', 'featured', 'featuredOrder'],
    },
    {
      fields: ['rating'],
    },
    {
      fields: ['date'],
    },
  ],
};
