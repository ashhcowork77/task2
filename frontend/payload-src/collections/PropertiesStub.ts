import { CollectionConfig } from 'payload';

/**
 * Properties Collection — Airbnb + Agent/Broker Verticals
 *
 * Full-featured collection for managing short-let, sale, and rent properties.
 * Fields organized in tabs for optimal admin UX.
 *
 * Demo client: Not Just A Stay
 *
 * @see .planning/phases/02-data-layer/2.1-PLAN.md
 */
export const PropertiesStub: CollectionConfig = {
  slug: 'properties',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'verticalType', 'status', 'listingIntent', 'locality'],
    listSearchableFields: ['title', 'locality'],
    pagination: {
      defaultLimit: 20,
    },
  },

  access: {
    read: () => true, // Public read for published properties
    create: ({ req: { user } }) => Boolean(user), // Admin only
    update: ({ req: { user } }) => Boolean(user), // Admin only
    delete: ({ req: { user } }) => Boolean(user), // Admin only
  },

  fields: [
    // ============================================================
    // TABS ORGANIZATION
    // ============================================================
    {
      type: 'tabs',
      tabs: [
        // --------------------------------------------------------
        // Tab 1: Basic Info
        // --------------------------------------------------------
        {
          label: 'Basic Info',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Property name displayed to guests',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'URL-friendly identifier (e.g., luna-blanca)',
              },
            },
            {
              name: 'verticalType',
              type: 'select',
              defaultValue: 'airbnb',
              required: true,
              options: [
                { label: 'Airbnb / Short-let', value: 'airbnb' },
                { label: 'Agent / Broker', value: 'agent' },
                { label: 'Builder / Developer', value: 'builder' },
              ],
              admin: {
                description: 'Controls which website vertical and lead flow this property belongs to',
              },
            },
            {
              name: 'listingIntent',
              type: 'select',
              defaultValue: 'short_let',
              options: [
                { label: 'Short-let / Stay', value: 'short_let' },
                { label: 'For Sale', value: 'sale' },
                { label: 'For Rent', value: 'rent' },
                { label: 'Sale or Rent', value: 'sale_or_rent' },
              ],
              admin: {
                description: 'Primary commercial intent for this listing',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Full description of the property',
              },
            },
            {
              name: 'shortDescription',
              type: 'text',
              admin: {
                description: 'Brief tagline for listings (max 150 chars)',
                placeholder: 'A cozy 2-bedroom apartment near the beach',
              },
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 2: Location
        // --------------------------------------------------------
        {
          label: 'Location',
          fields: [
            {
              name: 'address',
              type: 'group',
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
                  required: true,
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
                  defaultValue: 'India',
                  admin: {
                    description: 'Country',
                  },
                },
              ],
            },
            {
              name: 'geolocation',
              type: 'point', // PostGIS geometry point for geospatial queries
              admin: {
                description: 'Latitude/longitude coordinates for the map pin',
              },
            },
            {
              name: 'locality',
              type: 'text',
              admin: {
                description: 'Neighborhood or area name (e.g., "Koramangala")',
              },
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 3: Property Details
        // --------------------------------------------------------
        {
          label: 'Property Details',
          fields: [
            {
              name: 'bhkType',
              type: 'select',
              options: [
                { label: '1 BHK', value: '1_bhk' },
                { label: '2 BHK', value: '2_bhk' },
                { label: '3 BHK', value: '3_bhk' },
                { label: '4+ BHK', value: '4_plus_bhk' },
                { label: 'Studio', value: 'studio' },
                { label: 'Villa', value: 'villa' },
                { label: 'Penthouse', value: 'penthouse' },
              ],
              admin: {
                description: 'Number of bedrooms, hall, kitchen',
              },
            },
            {
              name: 'propertyType',
              type: 'select',
              options: [
                { label: 'Apartment', value: 'apartment' },
                { label: 'House', value: 'house' },
                { label: 'Villa', value: 'villa' },
                { label: 'Condo', value: 'condo' },
                { label: 'Farmhouse', value: 'farmhouse' },
                { label: 'Plot / Land', value: 'plot' },
                { label: 'Office', value: 'office' },
                { label: 'Retail', value: 'retail' },
              ],
              admin: {},
            },
            {
              name: 'furnishingStatus',
              type: 'select',
              options: [
                { label: 'Furnished', value: 'furnished' },
                { label: 'Semi-Furnished', value: 'semi_furnished' },
                { label: 'Unfurnished', value: 'unfurnished' },
              ],
              admin: {},
            },
            {
              name: 'bedrooms',
              type: 'number',
              min: 0,
              defaultValue: 1,
              admin: {
                description: 'Number of bedrooms',
              },
            },
            {
              name: 'bathrooms',
              type: 'number',
              min: 0,
              defaultValue: 1,
              admin: {
                description: 'Number of bathrooms',
              },
            },
            {
              name: 'maxGuests',
              type: 'number',
              min: 1,
              defaultValue: 2,
              admin: {
                description: 'Maximum number of guests allowed',
              },
            },
            {
              name: 'floor',
              type: 'group',
              label: 'Floor Information',
              fields: [
                {
                  name: 'current',
                  type: 'number',
                  min: 0,
                  admin: {
                    description: 'Current floor number (0 for ground floor)',
                  },
                },
                {
                  name: 'total',
                  type: 'number',
                  min: 1,
                  admin: {
                    description: 'Total number of floors in the building',
                  },
                },
              ],
            },
            {
              name: 'facing',
              type: 'select',
              options: [
                { label: 'North', value: 'north' },
                { label: 'South', value: 'south' },
                { label: 'East', value: 'east' },
                { label: 'West', value: 'west' },
                { label: 'North-East', value: 'north_east' },
                { label: 'North-West', value: 'north_west' },
                { label: 'South-East', value: 'south_east' },
                { label: 'South-West', value: 'south_west' },
              ],
              admin: {
                description: 'Direction the property faces',
              },
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 4: Pricing
        // --------------------------------------------------------
        {
          label: 'Pricing',
          fields: [
            {
              name: 'nightlyPrice',
              type: 'number',
              required: true,
              admin: {
                description: 'Base price per night (e.g., 2500 for ₹2,500)',
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
            },
            {
              name: 'seasonalPricing',
              type: 'array',
              admin: {
                description: 'Special pricing for different seasons',
              },
              fields: [
                {
                  name: 'seasonName',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., "Summer", "Holiday Season"',
                  },
                },
                {
                  name: 'startDate',
                  type: 'date',
                  required: true,
                  admin: {
                    description: 'Season start date',
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  required: true,
                  admin: {
                    description: 'Season end date',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Price per night during this season',
                  },
                },
              ],
            },
            {
              name: 'minNights',
              type: 'number',
              defaultValue: 1,
              min: 1,
              admin: {
                description: 'Minimum number of nights to book',
                placeholder: 'e.g., 2 for minimum 2 nights stay',
              },
            },
            {
              name: 'maxNights',
              type: 'number',
              min: 1,
              admin: {
                description: 'Maximum number of nights allowed',
                placeholder: 'Leave empty for no limit',
              },
            },
            {
              name: 'salePrice',
              type: 'number',
              admin: {
                description: 'Sale price for agent/broker listings',
                placeholder: 'e.g., 12500000 for ₹1.25 Cr',
              },
            },
            {
              name: 'monthlyRent',
              type: 'number',
              admin: {
                description: 'Monthly rent for agent/broker rental listings',
                placeholder: 'e.g., 85000',
              },
            },
            {
              name: 'priceLabel',
              type: 'text',
              admin: {
                description: 'Optional public price label such as "Price on request" or "₹1.25 Cr"',
              },
            },
            {
              name: 'maintenanceCharges',
              type: 'number',
              admin: {
                description: 'Monthly maintenance charges, if applicable',
              },
            },
            {
              name: 'brokerageNote',
              type: 'text',
              admin: {
                description: 'Brokerage or fee note shown internally or on listing pages',
              },
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 5: Amenities & Rules
        // --------------------------------------------------------
        {
          label: 'Amenities & Rules',
          fields: [
            {
              name: 'amenities',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'WiFi', value: 'wifi' },
                { label: 'Air Conditioning', value: 'ac' },
                { label: 'Pool', value: 'pool' },
                { label: 'Kitchen', value: 'kitchen' },
                { label: 'Parking', value: 'parking' },
                { label: 'Washer', value: 'washer' },
                { label: 'Dryer', value: 'dryer' },
                { label: 'TV', value: 'tv' },
                { label: 'Gym', value: 'gym' },
                { label: 'Beach Access', value: 'beach_access' },
                { label: 'Hot Tub', value: 'hot_tub' },
                { label: 'BBQ Grill', value: 'bbq_grill' },
                { label: 'Fireplace', value: 'fireplace' },
                { label: 'Garden', value: 'garden' },
                { label: 'Balcony', value: 'balcony' },
                { label: 'Terrace', value: 'terrace' },
                { label: 'Security', value: 'security' },
                { label: 'First Aid Kit', value: 'first_aid_kit' },
                { label: 'Smoke Detector', value: 'smoke_detector' },
                { label: 'Water Heater', value: 'water_heater' },
              ],
              admin: {
                description: 'Select all amenities available at this property',
              },
            },
            {
              name: 'houseRules',
              type: 'textarea',
              admin: {
                description: 'Rules and guidelines for guests',
                placeholder: 'e.g., No smoking inside, Quiet hours after 10 PM',
              },
            },
            {
              name: 'petPolicy',
              type: 'select',
              options: [
                { label: 'Allowed', value: 'pets_allowed' },
                { label: 'Not Allowed', value: 'pets_not_allowed' },
                { label: 'Cats Welcome', value: 'cats_only' },
                { label: 'Dogs Welcome', value: 'dogs_only' },
              ],
              admin: {},
            },
            {
              name: 'tenantPreference',
              type: 'select',
              options: [
                { label: 'Families with Kids', value: 'families' },
                { label: 'Couples', value: 'couples' },
                { label: 'Business Travelers', value: 'business_travelers' },
                { label: 'Anyone', value: 'anyone' },
              ],
              admin: {
                description: 'Preferred guest type for this property',
              },
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 6: Agent Listing & Lead Gen
        // --------------------------------------------------------
        {
          label: 'Agent Listing & Lead Gen',
          fields: [
            {
              name: 'listingStatus',
              type: 'select',
              defaultValue: 'available',
              options: [
                { label: 'Available', value: 'available' },
                { label: 'Under Offer', value: 'under_offer' },
                { label: 'Sold', value: 'sold' },
                { label: 'Rented', value: 'rented' },
                { label: 'Off Market', value: 'off_market' },
              ],
              admin: {
                description: 'Public sales/rental availability status',
              },
            },
            {
              name: 'possessionStatus',
              type: 'select',
              options: [
                { label: 'Ready to Move', value: 'ready_to_move' },
                { label: 'Under Construction', value: 'under_construction' },
                { label: 'Resale', value: 'resale' },
                { label: 'New Launch', value: 'new_launch' },
              ],
              admin: {
                description: 'Helps buyers qualify the listing quickly',
              },
            },
            {
              name: 'area',
              type: 'group',
              fields: [
                {
                  name: 'carpetSqFt',
                  type: 'number',
                  admin: { description: 'Carpet area in sq ft' },
                },
                {
                  name: 'builtUpSqFt',
                  type: 'number',
                  admin: { description: 'Built-up area in sq ft' },
                },
                {
                  name: 'plotSqFt',
                  type: 'number',
                  admin: { description: 'Plot area in sq ft' },
                },
              ],
            },
            {
              name: 'reraId',
              type: 'text',
              admin: {
                description: 'RERA/project registration or disclosure ID, where applicable',
              },
            },
            {
              name: 'propertyHighlights',
              type: 'array',
              admin: {
                description: 'Short conversion-focused facts for listing pages and ads',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'detail',
                  type: 'text',
                },
              ],
            },
            {
              name: 'agent',
              type: 'group',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'role', type: 'text' },
                { name: 'phone', type: 'text' },
                { name: 'email', type: 'email' },
                { name: 'whatsapp', type: 'text' },
                { name: 'licenseId', type: 'text' },
                { name: 'bio', type: 'textarea' },
                {
                  name: 'headshot',
                  type: 'relationship',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'leadRouting',
              type: 'group',
              fields: [
                {
                  name: 'primaryCta',
                  type: 'select',
                  defaultValue: 'schedule_visit',
                  options: [
                    { label: 'Schedule Visit', value: 'schedule_visit' },
                    { label: 'Request Brochure', value: 'request_brochure' },
                    { label: 'Call Agent', value: 'call_agent' },
                    { label: 'WhatsApp Agent', value: 'whatsapp_agent' },
                    { label: 'Seller Valuation', value: 'seller_valuation' },
                  ],
                },
                { name: 'callTrackingNumber', type: 'text' },
                { name: 'whatsappNumber', type: 'text' },
                { name: 'assignedTo', type: 'text' },
                {
                  name: 'responseSla',
                  type: 'text',
                  defaultValue: 'Call-back within 15 minutes during business hours',
                },
              ],
            },
            {
              name: 'campaign',
              type: 'group',
              fields: [
                { name: 'adHeadline', type: 'text' },
                { name: 'adDescription', type: 'textarea' },
                { name: 'landingPageSlug', type: 'text' },
                { name: 'utmCampaign', type: 'text' },
                {
                  name: 'sourceTags',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'Organic Search', value: 'organic_search' },
                    { label: 'Google Search Ads', value: 'google_search_ads' },
                    { label: 'Meta Ads', value: 'meta_ads' },
                    { label: 'Portal Lead', value: 'portal_lead' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Referral', value: 'referral' },
                  ],
                },
              ],
            },
          ],
        },

        // --------------------------------------------------------
        // Tab 7: Media
        // --------------------------------------------------------
        {
          label: 'Media',
          fields: [
            {
              name: 'gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: 'Property photos (drag to reorder)',
              },
            },
            {
              name: 'featuredImage',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                description: 'This image will be shown as the main photo in search results and listings',
              },
            },
          ],
        },
      ],
    },

    // ============================================================
    // SIDEBAR FIELDS
    // ============================================================
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
        position: 'sidebar',
        description: 'Draft = not visible to guests, Published = live on website',
      },
    },
    {
      name: 'availabilityCalendar',
      type: 'json',
      admin: {
        description: 'Reserved for Phase 4 - availability calendar',
        readOnly: true,
      },
    },
  ],
};
