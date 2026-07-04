import type { CollectionConfig } from 'payload';

/**
 * POI Cache Collection
 *
 * Stores cached Google Places API results per property and POI type.
 * Automatically expires after 7 days via beforeChange hook.
 *
 * Cache key: property_id + poiType (unique constraint)
 */
export const POICache: CollectionConfig = {
  slug: 'poi-cache',

  // No admin UI - this is an internal cache table
  admin: {
    useAsTitle: 'property',
    hidden: ({ user }) => !user, // Hidden from admin if no access
  },

  access: {
    read: () => true, // Public read for cached data
    create: () => true, // Allow server-side creation
    update: () => true, // Allow server-side updates
    delete: () => true, // Allow server-side cleanup
  },

  fields: [
    {
      name: 'property',
      type: 'relationship',
      relationTo: 'properties',
      required: true,
      admin: {
        description: 'Property this POI data is for',
      },
    },
    {
      name: 'poiType',
      type: 'select',
      options: [
        { label: 'Restaurants & Cafes', value: 'restaurant' },
        { label: 'Bars & Nightlife', value: 'bar' },
        { label: 'Parks & Recreation', value: 'park' },
        { label: 'Beaches & Scenic', value: 'beach' },
      ],
      required: true,
      admin: {
        description: 'Type of POI',
      },
    },
    {
      name: 'centerLat',
      type: 'number', // Cached center for invalidation
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'centerLng',
      type: 'number', // Cached center for invalidation
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'data',
      type: 'json', // Cached Google Places results
      required: true,
      admin: {
        description: 'Cached POI data from Google Places API',
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Cache expiration date (auto-set to 7 days)',
        readOnly: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],

  indexes: [
    // Composite unique index for cache key
    {
      fields: {
        property: 1,
        poiType: 1,
      },
      unique: true,
    },
    // Index for TTL queries
    {
      fields: {
        expiresAt: 1,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set expiration to 7 days from now
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        data.expiresAt = expires;
        return data;
      },
    ],
  },
};
