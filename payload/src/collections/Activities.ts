import type { CollectionConfig } from 'payload';

/**
 * Activities Collection
 * Airbnb experiences (tours, cooking classes, activities) that can be linked to properties.
 *
 * Access Control:
 * - read: Public (anyone can view published activities)
 * - create/update/delete: Authenticated users only (admin)
 *
 * @see Phase 3: Activities & Inquiry
 */
export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'createdAt'],
    listSearchableFields: ['title', 'description'],
    description: 'Airbnb experiences and activities',
  },
  access: {
    // Public read for published activities
    read: () => true,
    // Admin only - authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can update
    update: ({ req: { user } }) => Boolean(user),
    // Admin only - authenticated users can delete
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Tabs for organization
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Activity or experience name',
                placeholder: 'Sunset Beach Yoga Session',
              },
            },
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Brief tagline for listings (max 150 chars)',
                placeholder: 'A relaxing yoga experience as the sun goes down',
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Full description of the experience. Include what guests will do, learn, or experience.',
                placeholder: 'Describe the experience in detail. What will guests do? What makes this special? What should they expect?',
              },
            },
            {
              name: 'highlights',
              type: 'array',
              admin: {
                description: "Key selling points guests will love (e.g., 'Learn authentic recipes', 'Stunning ocean views', 'All equipment provided')",
              },
              fields: [
                {
                  name: 'highlight',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'duration',
              type: 'text',
              admin: {
                description: 'Duration of the experience (e.g., "2 hours", "Half day (4 hours)", "Full day (8 hours)")',
                placeholder: 'e.g., 2 hours, Half day (4 hours), Full day (8 hours)',
              },
            },
            {
              name: 'groupSize',
              type: 'group',
              fields: [
                {
                  name: 'minGuests',
                  type: 'number',
                  min: 1,
                  admin: {
                    label: 'Minimum Guests',
                    description: 'Minimum number of guests required for this experience',
                  },
                },
                {
                  name: 'maxGuests',
                  type: 'number',
                  min: 1,
                  admin: {
                    label: 'Maximum Guests',
                    description: 'Maximum number of guests allowed per booking',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
              admin: {
                description: 'Price per person. Enter the numeric value (e.g., 1500 for ₹1,500 per person)',
                placeholder: '1500',
              },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'INR',
              options: [
                { label: 'INR', value: 'INR' },
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
              ],
              admin: {
                description: 'Currency for pricing',
              },
            },
            {
              name: 'includes',
              type: 'textarea',
              admin: {
                description: 'What is included in the price. List items one per line or separated by commas.',
                placeholder: 'e.g., All ingredients, Recipe booklet, Take-home samples, Equipment rental',
              },
            },
            {
              name: 'cancellationPolicy',
              type: 'textarea',
              admin: {
                description: 'Cancellation and refund policy. Be clear about deadlines and conditions.',
                placeholder: 'e.g., Free cancellation up to 48 hours before the experience. No refund for cancellations within 48 hours.',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              isSortable: true,
              admin: {
                label: 'Experience Photos',
                description: 'Drag photos to reorder. The first photo is shown as the thumbnail in listings.',
              },
            },
            {
              name: 'featuredImage',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                label: 'Cover Photo',
                description: 'This image will be shown in search results and listings. Choose a high-quality photo that represents the experience.',
              },
            },
          ],
        },
        {
          label: 'Availability',
          fields: [
            {
              name: 'availability',
              type: 'json',
              admin: {
                description: 'Availability schedule (Phase 5 will add calendar UI)',
              },
            },
            {
              name: 'bookingLeadTime',
              type: 'number',
              admin: {
                label: 'Advance Notice Required',
                description: 'Minimum hours between booking and experience start. Guests cannot book within this window.',
              },
            },
          ],
        },
      ],
    },
    // Outside tabs - sidebar fields
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description: 'Draft = not visible on website. Published = live on website. Archived = hidden but retained.',
        position: 'sidebar',
      },
    },
    {
      name: 'linkedProperties',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      admin: {
        label: 'Related Properties',
        description: 'Link this experience to relevant properties for bundled bookings and cross-promotion.',
        position: 'sidebar',
      },
    },
  ],
  indexes: [
    { status: 1 },
    { price: 1 },
  ],
  timestamps: true,
};
