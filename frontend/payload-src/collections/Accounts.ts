import type { CollectionConfig } from 'payload';

/**
 * Accounts Collection — Not Just A Stay Branding
 *
 * Single-account collection for the Not Just A Stay demo client (MVP).
 * Stores business branding information that applies across the entire site.
 *
 * Access Control:
 * - All operations restricted to authenticated admin users
 * - delete: () => false (account cannot be deleted)
 *
 * @see D-11: Single Accounts collection for Not Just A Stay
 * @see D-04: Single account for MVP
 */
export const Accounts: CollectionConfig = {
  slug: 'accounts',

  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'email'],
    description: 'Business account settings for Not Just A Stay',
  },

  access: {
    // Admin only - authenticated users can read account info
    read: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can create accounts
    create: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can update accounts
    update: ({ req: { user } }) => Boolean(user),
    // Never delete - prevents accidental account removal
    delete: () => false,
  },

  fields: [
    // ============================================================
    // BASIC INFO
    // ============================================================
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Business or brand name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Primary contact email address',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short tagline for the website (max 100 chars)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'About the business',
      },
    },

    // ============================================================
    // BRANDING
    // ============================================================
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Business logo image',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Favicon image (16x16, 32x32, or 48x48)',
      },
    },
    {
      name: 'primaryColor',
      type: 'text',
      admin: {
        description: 'Primary brand color (hex code, e.g., #2563EB)',
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      admin: {
        description: 'Secondary brand color (hex code)',
      },
    },

    // ============================================================
    // SOCIAL LINKS
    // ============================================================
    {
      name: 'socialLinks',
      type: 'group',
      admin: {
        description: 'Social media profile links',
      },
      fields: [
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook page URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X profile URL',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn profile URL',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          admin: {
            description: 'YouTube channel URL',
          },
        },
      ],
    },

    // ============================================================
    // ADDRESS
    // ============================================================
    {
      name: 'address',
      type: 'group',
      admin: {
        description: 'Business address',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City name',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State or region',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          admin: {
            description: 'Postal code',
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            description: 'Country',
          },
        },
      ],
    },

    // ============================================================
    // WEBSITE SETTINGS
    // ============================================================
    {
      name: 'websiteUrl',
      type: 'text',
      admin: {
        description: 'Primary website URL',
      },
    },
    {
      name: 'supportEmail',
      type: 'email',
      admin: {
        description: 'Support contact email',
      },
    },
  ],

  timestamps: true,
};
