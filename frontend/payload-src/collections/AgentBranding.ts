import type { CollectionConfig } from 'payload';

export const AgentBranding: CollectionConfig = {
  slug: 'agent-branding',
  labels: {
    singular: 'Agent Branding',
    plural: 'Agent Branding',
  },

  // Single instance collection (no create/update multiple times)
  admin: {
    useAsTitle: 'businessName',
    description: 'Configure branding settings for the agent portal and public-facing pages.',
    defaultColumns: ['businessName', 'contactEmail', 'updatedAt'],
  },

  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    // Primary Business Info
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'text',
      required: true,
      admin: {
        description: 'The official business name displayed across the platform.',
      },
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Primary logo for the business. Recommended: PNG or SVG with transparent background.',
      },
    },
    {
      name: 'favicon',
      label: 'Favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Small icon shown in browser tabs. Recommended: 32x32 or 64x64 PNG/ICO.',
      },
    },

    // Brand Colors
    {
      name: 'brandColor',
      label: 'Primary Brand Color',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary brand color in hex format (e.g., #1A1A1A). Used for buttons, links, and accents.',
      },
      validate: (val: unknown) => {
        if (!val) return true;
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val as string) || 'Must be a valid hex color (e.g., #1A1A1A)';
      },
    },
    {
      name: 'secondaryColor',
      label: 'Secondary Brand Color',
      type: 'text',
      admin: {
        description: 'Secondary color for supporting elements. Should complement the primary color.',
      },
      validate: (val: unknown) => {
        if (!val) return true;
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val as string) || 'Must be a valid hex color (e.g., #1A1A1A)';
      },
    },

    // Contact Information
    {
      name: 'contactGroup',
      label: 'Contact Information',
      type: 'group',
      fields: [
        {
          name: 'email',
          label: 'Contact Email',
          type: 'email',
          required: true,
          admin: {
            description: 'Primary email for inquiries and lead notifications.',
          },
        },
        {
          name: 'phone',
          label: 'Contact Phone',
          type: 'text',
          admin: {
            description: 'Displayed phone number for contact purposes.',
          },
        },
        {
          name: 'whatsapp',
          label: 'WhatsApp Number',
          type: 'text',
          admin: {
            description: 'WhatsApp number with country code (e.g., +91 98765 43210). Used for WhatsApp integrations.',
          },
        },
        {
          name: 'callTracking',
          label: 'Call Tracking Number',
          type: 'text',
          admin: {
            description: 'Virtual number for tracking call sources. Configure with your call tracking provider.',
          },
        },
        {
          name: 'address',
          label: 'Business Address',
          type: 'textarea',
          admin: {
            rows: 3,
            description: 'Physical office address displayed on contact pages.',
          },
        },
      ],
    },

    // Social Links
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          label: 'LinkedIn',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/yourprofile',
          },
        },
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'text',
          admin: {
            placeholder: 'https://instagram.com/yourprofile',
          },
        },
        {
          name: 'twitter',
          label: 'X (Twitter)',
          type: 'text',
          admin: {
            placeholder: 'https://x.com/yourprofile',
          },
        },
        {
          name: 'facebook',
          label: 'Facebook',
          type: 'text',
          admin: {
            placeholder: 'https://facebook.com/yourpage',
          },
        },
        {
          name: 'youtube',
          label: 'YouTube',
          type: 'text',
          admin: {
            placeholder: 'https://youtube.com/@yourchannel',
          },
        },
      ],
    },

    // Email Templates
    {
      name: 'emailTemplateHeader',
      label: 'Email Header',
      type: 'textarea',
      admin: {
        rows: 5,
        description: 'HTML content for email template headers. Include logo and branding.',
      },
    },
    {
      name: 'emailTemplateFooter',
      label: 'Email Footer',
      type: 'textarea',
      admin: {
        rows: 5,
        description: 'HTML content for email template footers. Include contact info and unsubscribe link.',
      },
    },

    // Additional Branding
    {
      name: 'tagline',
      label: 'Brand Tagline',
      type: 'text',
      admin: {
        description: 'Short tagline displayed alongside the business name.',
      },
    },
    {
      name: 'aboutText',
      label: 'About Us Text',
      type: 'textarea',
      admin: {
        rows: 5,
        description: 'About section text for the business profile page.',
      },
    },

    // Status
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
      admin: {
        description: 'Controls whether branding is applied to the live site.',
      },
    },
  ],

  hooks: {
    afterChange: [
      ({ doc }) => {
        console.log(`[AgentBranding] Branding settings updated for: ${doc.businessName}`);
      },
    ],
  },
};
