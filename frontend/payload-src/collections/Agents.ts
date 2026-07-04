import type { CollectionConfig } from 'payload';

export const Agents: CollectionConfig = {
  slug: 'agents',
  label: 'Agents',
  labelSingular: 'Agent',
  description: 'Real estate agent profiles with credentials and specializations',

  admin: {
    useAsTitle: 'name',
    description: 'Manage real estate agent profiles displayed on the website.',
    defaultColumns: ['name', 'email', 'specialization', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'reraId', 'licenseNumber'],
  },

  access: {
    read: () => true, // Public can view agents
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    // Basic Info
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      admin: {
        description: 'Agent\'s full legal name',
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      admin: {
        description: 'Primary contact email for the agent',
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary phone number with country code',
      },
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp Number',
      type: 'text',
      admin: {
        description: 'WhatsApp number for quick contact (e.g., +91 98765 43210)',
      },
    },

    // Professional Details
    {
      name: 'photo',
      label: 'Profile Photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Professional headshot of the agent',
      },
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      admin: {
        rows: 5,
        description: 'Agent biography and background information',
      },
    },

    // Credentials
    {
      name: 'reraId',
      label: 'RERA ID',
      type: 'text',
      admin: {
        description: 'RERA registration number (e.g., COM/A12345/1234567890)',
      },
    },
    {
      name: 'licenseNumber',
      label: 'License Number',
      type: 'text',
      admin: {
        description: 'Real estate license number',
      },
    },
    {
      name: 'yearsExperience',
      label: 'Years of Experience',
      type: 'number',
      min: 0,
      max: 50,
      admin: {
        description: 'Number of years in real estate',
      },
    },

    // Specializations
    {
      name: 'specialization',
      label: 'Specializations',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Plots & Land', value: 'plots' },
        { label: 'Rentals', value: 'rentals' },
        { label: 'Luxury Properties', value: 'luxury' },
        { label: 'New Projects', value: 'new_projects' },
        { label: 'Investment Properties', value: 'investment' },
        { label: 'Farmhouses', value: 'farmhouses' },
      ],
      admin: {
        description: 'Select all property types the agent specializes in',
      },
    },
    {
      name: 'serviceAreas',
      label: 'Service Areas',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'List of localities/areas the agent serves',
      },
    },

    // Agency Info
    {
      name: 'agency',
      label: 'Agency/Company',
      type: 'text',
      admin: {
        description: 'Name of the agency or company the agent works for',
      },
    },
    {
      name: 'agencyLogo',
      label: 'Agency Logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo of the agency or company',
      },
    },

    // Social Links
    {
      name: 'socialLinks',
      label: 'Social Media',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          label: 'LinkedIn',
          type: 'text',
        },
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'text',
        },
        {
          name: 'twitter',
          label: 'X (Twitter)',
          type: 'text',
        },
        {
          name: 'facebook',
          label: 'Facebook',
          type: 'text',
        },
        {
          name: 'youtube',
          label: 'YouTube',
          type: 'text',
        },
      ],
    },

    // Operating Hours
    {
      name: 'operatingHours',
      label: 'Operating Hours',
      type: 'group',
      fields: [
        {
          name: 'monday',
          label: 'Monday',
          type: 'text',
          admin: {
            placeholder: '9:00 AM - 7:00 PM',
          },
        },
        {
          name: 'tuesday',
          label: 'Tuesday',
          type: 'text',
          admin: {
            placeholder: '9:00 AM - 7:00 PM',
          },
        },
        {
          name: 'wednesday',
          label: 'Wednesday',
          type: 'text',
          admin: {
            placeholder: '9:00 AM - 7:00 PM',
          },
        },
        {
          name: 'thursday',
          label: 'Thursday',
          type: 'text',
          admin: {
            placeholder: '9:00 AM - 7:00 PM',
          },
        },
        {
          name: 'friday',
          label: 'Friday',
          type: 'text',
          admin: {
            placeholder: '9:00 AM - 7:00 PM',
          },
        },
        {
          name: 'saturday',
          label: 'Saturday',
          type: 'text',
          admin: {
            placeholder: '10:00 AM - 5:00 PM',
          },
        },
        {
          name: 'sunday',
          label: 'Sunday',
          type: 'text',
          admin: {
            placeholder: 'By Appointment',
          },
        },
      ],
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
        { label: 'On Leave', value: 'on_leave' },
      ],
      admin: {
        description: 'Controls whether the agent is displayed on the website',
      },
    },

    // Featured/Highlights
    {
      name: 'featured',
      label: 'Featured Agent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured agents are highlighted on the agents listing page',
      },
    },
    {
      name: 'featuredOrder',
      label: 'Featured Order',
      type: 'number',
      admin: {
        description: 'Order for featured agents (lower number = higher priority)',
        condition: (_, siblingData) => siblingData?.featured === true,
      },
    },

    // Slug for URL
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      admin: {
        description: 'URL-friendly identifier (e.g., john-doe)',
      },
    },

    // Related Properties
    {
      name: 'properties',
      label: 'Properties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      admin: {
        description: 'Properties listed by this agent',
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`[Agents] Agent ${operation}: ${doc.name} (${doc.id})`);
      },
    ],
  },

  indexes: [
    {
      fields: { status: 1, name: 1 },
    },
    {
      fields: { slug: 1 },
      unique: true,
    },
    {
      fields: { email: 1 },
      unique: true,
    },
  ],
};
