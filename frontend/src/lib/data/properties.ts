import { cache } from 'react';
import type { PaginatedResponse, Property } from '@/types';

type PayloadClient = Awaited<ReturnType<typeof import('payload')['getPayload']>>;

const demoProperties: Property[] = [
  {
    id: 'villa-solace',
    slug: 'villa-solace',
    title: 'Villa Solace',
    description:
      'A private pool villa in peaceful Assagao with generous living spaces, shaded verandas and garden views. Designed for groups who want a quiet North Goa base with the comfort of a hosted stay.',
    shortDescription:
      'A private pool villa in peaceful Assagao with generous living spaces and garden views.',
    address: {
      city: 'Mapusa',
      state: 'Goa',
      locality: 'Assagao',
      country: 'India',
    },
    locality: 'Assagao',
    geolocation: { lat: 15.5989, lng: 73.7696 },
    bhkType: 'villa',
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 10,
    nightlyPrice: 18000,
    currency: 'INR',
    minNights: 2,
    amenities: ['wifi', 'ac', 'parking', 'pool', 'kitchen'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=85&auto=format&fit=crop',
      alt: 'Villa Solace private pool',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=85&auto=format&fit=crop',
        alt: 'Villa Solace pool',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=85&auto=format&fit=crop',
        alt: 'Villa Solace living room',
      },
    ],
    status: 'published',
  },
  {
    id: 'rosa-blanca',
    slug: 'rosa-blanca',
    title: 'Rosa Blanca',
    description:
      'A Portuguese-style Anjuna villa with an infinity pool, gardens and generous gathering spaces for families, celebrations and long weekends near the coast.',
    shortDescription:
      'A Portuguese-style Anjuna villa with an infinity pool, gardens, and grand gathering spaces.',
    address: {
      city: 'Mapusa',
      state: 'Goa',
      locality: 'Anjuna',
      country: 'India',
    },
    locality: 'Anjuna',
    geolocation: { lat: 15.5752, lng: 73.7407 },
    bhkType: 'villa',
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 12,
    nightlyPrice: 25000,
    currency: 'INR',
    minNights: 2,
    amenities: ['wifi', 'ac', 'parking', 'pool', 'tv'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
      alt: 'Rosa Blanca villa exterior',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
        alt: 'Rosa Blanca exterior',
      },
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85&auto=format&fit=crop',
        alt: 'Rosa Blanca dining experience',
      },
    ],
    status: 'published',
  },
  {
    id: 'nova-solace',
    slug: 'nova-solace',
    title: 'Nova Solace',
    description:
      'A modern Chapora villa with a plunge pool, calm interiors and easy access to Vagator beach, Chapora fort and North Goa evenings.',
    shortDescription:
      'A modern Chapora villa with a plunge pool near Vagator beach and the fort.',
    address: {
      city: 'Mapusa',
      state: 'Goa',
      locality: 'Vagator',
      country: 'India',
    },
    locality: 'Vagator',
    geolocation: { lat: 15.5981, lng: 73.7448 },
    bhkType: 'villa',
    propertyType: 'villa',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 8,
    nightlyPrice: 14000,
    currency: 'INR',
    minNights: 2,
    amenities: ['wifi', 'ac', 'parking', 'pool'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=85&auto=format&fit=crop',
      alt: 'Nova Solace modern exterior',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=85&auto=format&fit=crop',
        alt: 'Nova Solace exterior',
      },
      {
        url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=85&auto=format&fit=crop',
        alt: 'Nova Solace pool',
      },
    ],
    status: 'published',
  },
];

const demoAgentProperties: Property[] = [
  {
    id: 'indiranagar-skyline-residence',
    slug: 'indiranagar-skyline-residence',
    title: 'Skyline Residence, Indiranagar',
    description:
      'A bright 3 BHK resale apartment on a quiet Indiranagar cross road, with a wide balcony, two covered parks and quick access to 100 Feet Road, metro, schools and restaurants. The home is positioned for buyers who want a central address without taking on renovation uncertainty.',
    shortDescription:
      'Ready-to-move 3 BHK resale apartment near 100 Feet Road with balcony, parking and metro access.',
    address: {
      city: 'Bengaluru',
      state: 'Karnataka',
      locality: 'Indiranagar',
      country: 'India',
    },
    locality: 'Indiranagar',
    geolocation: { lat: 12.9784, lng: 77.6408 },
    verticalType: 'agent',
    listingIntent: 'sale',
    listingStatus: 'available',
    possessionStatus: 'ready_to_move',
    bhkType: '3_bhk',
    propertyType: 'apartment',
    furnishingStatus: 'semi_furnished',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 0,
    nightlyPrice: 0,
    salePrice: 24500000,
    priceLabel: '₹2.45 Cr',
    maintenanceCharges: 9500,
    currency: 'INR',
    area: {
      carpetSqFt: 1480,
      builtUpSqFt: 1820,
    },
    amenities: ['parking', 'security', 'gym', 'balcony'],
    reraId: 'PRM/KA/RERA/1251/446/AGT/2026',
    propertyHighlights: [
      { title: 'Ready to move', detail: 'Verified resale inventory' },
      { title: 'Metro access', detail: 'Under 900 m from Indiranagar metro' },
      { title: 'Seller brief', detail: 'Flexible visit windows this week' },
    ],
    agent: {
      name: 'Aarav Mehta',
      role: 'Principal Broker',
      phone: '+91 98765 43110',
      email: 'aarav@northline.example',
      whatsapp: '+91 98765 43110',
      licenseId: 'KA-RERA-AGT-2046',
      bio: 'Aarav works with resale homeowners and upgrade buyers across East Bengaluru, with a focus on verified inventory and faster visit-to-offer follow-up.',
    },
    leadRouting: {
      primaryCta: 'schedule_visit',
      callTrackingNumber: '+91 80456 77881',
      whatsappNumber: '+91 98765 43110',
      assignedTo: 'Aarav Mehta',
      responseSla: 'Call-back within 15 minutes during business hours',
    },
    campaign: {
      adHeadline: '3 BHK resale home in Indiranagar',
      adDescription: 'Schedule a private visit for a verified ready-to-move 3 BHK near 100 Feet Road.',
      landingPageSlug: 'indiranagar-3bhk-resale',
      utmCampaign: 'blr-east-resale',
      sourceTags: ['organic_search', 'google_search_ads', 'whatsapp'],
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=85&auto=format&fit=crop',
      alt: 'Modern apartment living room',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=85&auto=format&fit=crop',
        alt: 'Skyline Residence living room',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=85&auto=format&fit=crop',
        alt: 'Skyline Residence kitchen and dining',
      },
    ],
    status: 'published',
  },
  {
    id: 'whitefield-rental-loft',
    slug: 'whitefield-rental-loft',
    title: 'Whitefield Garden Loft',
    description:
      'A furnished 2 BHK rental apartment near ITPL and the metro corridor, designed for professionals who need a clean move-in path, reliable society amenities and responsive owner coordination.',
    shortDescription:
      'Furnished 2 BHK rental near ITPL with society amenities and fast move-in support.',
    address: {
      city: 'Bengaluru',
      state: 'Karnataka',
      locality: 'Whitefield',
      country: 'India',
    },
    locality: 'Whitefield',
    geolocation: { lat: 12.9698, lng: 77.7499 },
    verticalType: 'agent',
    listingIntent: 'rent',
    listingStatus: 'available',
    possessionStatus: 'ready_to_move',
    bhkType: '2_bhk',
    propertyType: 'apartment',
    furnishingStatus: 'furnished',
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 0,
    nightlyPrice: 0,
    monthlyRent: 78000,
    priceLabel: '₹78,000 / month',
    maintenanceCharges: 7000,
    currency: 'INR',
    area: {
      carpetSqFt: 1040,
      builtUpSqFt: 1280,
    },
    amenities: ['wifi', 'parking', 'security', 'gym', 'balcony'],
    propertyHighlights: [
      { title: 'Move-in ready', detail: 'Furnished and professionally cleaned' },
      { title: 'Commute fit', detail: 'Near ITPL and metro corridor' },
      { title: 'Lead route', detail: 'Tenant visits routed to rental desk' },
    ],
    agent: {
      name: 'Nisha Rao',
      role: 'Rental Specialist',
      phone: '+91 98765 43220',
      email: 'nisha@northline.example',
      whatsapp: '+91 98765 43220',
      licenseId: 'KA-RERA-AGT-2132',
      bio: 'Nisha handles rental qualification, owner coordination and same-day visit slots for East Bengaluru relocation clients.',
    },
    leadRouting: {
      primaryCta: 'schedule_visit',
      callTrackingNumber: '+91 80456 77882',
      whatsappNumber: '+91 98765 43220',
      assignedTo: 'Nisha Rao',
      responseSla: 'Rental desk replies within 10 minutes during business hours',
    },
    campaign: {
      adHeadline: 'Furnished 2 BHK rental near ITPL',
      adDescription: 'Book a verified visit and get move-in details before you travel.',
      landingPageSlug: 'whitefield-furnished-rental',
      utmCampaign: 'blr-whitefield-rentals',
      sourceTags: ['google_search_ads', 'meta_ads', 'portal_lead'],
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&auto=format&fit=crop',
      alt: 'Furnished apartment interior',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&auto=format&fit=crop',
        alt: 'Whitefield Garden Loft living area',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=85&auto=format&fit=crop',
        alt: 'Whitefield Garden Loft bedroom',
      },
    ],
    status: 'published',
  },
  {
    id: 'sarjapur-villa-plot',
    slug: 'sarjapur-villa-plot',
    title: 'Sarjapur Villa Plot',
    description:
      'A gated villa plot in a growth corridor with clean title, internal roads, club access and strong long-term demand from families moving toward Sarjapur, HSR and the Outer Ring Road.',
    shortDescription:
      'Gated villa plot with clean title, club access and strong Sarjapur growth corridor demand.',
    address: {
      city: 'Bengaluru',
      state: 'Karnataka',
      locality: 'Sarjapur Road',
      country: 'India',
    },
    locality: 'Sarjapur Road',
    geolocation: { lat: 12.8616, lng: 77.7862 },
    verticalType: 'agent',
    listingIntent: 'sale',
    listingStatus: 'available',
    possessionStatus: 'resale',
    bhkType: 'villa',
    propertyType: 'plot',
    bedrooms: 0,
    bathrooms: 0,
    maxGuests: 0,
    nightlyPrice: 0,
    salePrice: 16800000,
    priceLabel: '₹1.68 Cr',
    currency: 'INR',
    area: {
      plotSqFt: 2400,
    },
    amenities: ['security', 'garden'],
    reraId: 'PRM/KA/RERA/1251/308/PR/2024',
    propertyHighlights: [
      { title: 'Clean title pack', detail: 'Document checklist ready before visit' },
      { title: 'Gated community', detail: 'Internal roads, club and security' },
      { title: 'Investor path', detail: 'Comparable transactions available on call' },
    ],
    agent: {
      name: 'Kabir Sethi',
      role: 'Land & Villa Plot Advisor',
      phone: '+91 98765 43330',
      email: 'kabir@northline.example',
      whatsapp: '+91 98765 43330',
      licenseId: 'KA-RERA-AGT-2237',
      bio: 'Kabir helps buyers compare plotted communities, documentation quality and resale velocity before committing to a site visit.',
    },
    leadRouting: {
      primaryCta: 'request_brochure',
      callTrackingNumber: '+91 80456 77883',
      whatsappNumber: '+91 98765 43330',
      assignedTo: 'Kabir Sethi',
      responseSla: 'Document pack sent the same business day',
    },
    campaign: {
      adHeadline: 'Gated villa plot on Sarjapur Road',
      adDescription: 'Request the title checklist and comparable transactions before you visit.',
      landingPageSlug: 'sarjapur-villa-plot',
      utmCampaign: 'sarjapur-plotted-development',
      sourceTags: ['organic_search', 'meta_ads', 'referral'],
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=85&auto=format&fit=crop',
      alt: 'Open land with green surroundings',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=85&auto=format&fit=crop',
        alt: 'Sarjapur Villa Plot landscape',
      },
      {
        url: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1400&q=85&auto=format&fit=crop',
        alt: 'Gated residential approach road',
      },
    ],
    status: 'published',
  },
];

let payloadInstance: PayloadClient | null = null;

function isProductionBuild() {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim();

  if (!value || value === '""' || value === "''") {
    return null;
  }

  try {
    const parsed = new URL(value.replace(/^['"]|['"]$/g, ''));
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function createPaginatedResponse<T>(
  docs: T[],
  limit: number,
  page: number,
): PaginatedResponse<T> {
  const totalDocs = docs.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    pagingCounter: totalDocs > 0 ? (page - 1) * limit + 1 : 0,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
  };
}

function getDemoProperties(options?: { limit?: number; page?: number }) {
  const limit = options?.limit ?? 20;
  const page = options?.page ?? 1;
  const start = (page - 1) * limit;
  const docs = demoProperties.slice(start, start + limit);

  return createPaginatedResponse(docs, limit, page);
}

async function getPayloadInstance() {
  if (isProductionBuild() || !getDatabaseUrl()) {
    return null;
  }

  if (!payloadInstance) {
    const [{ getPayload }, configModule] = await Promise.all([
      import('payload'),
      import('../../../payload.config'),
    ]);

    payloadInstance = await getPayload({ config: configModule.default });
  }

  return payloadInstance;
}

export const getPublishedProperties = cache(async (options?: {
  limit?: number;
  page?: number;
}): Promise<PaginatedResponse<Property>> => {
  const limit = options?.limit ?? 20;
  const page = options?.page ?? 1;
  const fallback = getDemoProperties({ limit, page });

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { status: { equals: 'published' } },
          { verticalType: { equals: 'airbnb' } },
        ],
      },
      limit,
      page,
      sort: '-createdAt',
      depth: 2,
    });

    return result.docs.length > 0
      ? (result as unknown as PaginatedResponse<Property>)
      : fallback;
  } catch (error) {
    console.error('Error fetching properties from Payload:', error);
    return fallback;
  }
});

export const getFeaturedProperties = cache(async (): Promise<Property[]> => {
  const fallback = demoProperties.slice(0, 6);

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { status: { equals: 'published' } },
          { verticalType: { equals: 'airbnb' } },
        ],
      },
      limit: 6,
      sort: '-createdAt',
      depth: 2,
    });

    return result.docs.length > 0
      ? (result.docs as unknown as Property[])
      : fallback;
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return fallback;
  }
});

export const getPropertyBySlug = cache(async (slug: string): Promise<Property | null> => {
  const fallback = demoProperties.find(
    (property) => property.slug === slug || property.id === slug,
  ) ?? null;

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const titleFromSlug = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { verticalType: { equals: 'airbnb' } },
          {
            or: [
              { title: { equals: titleFromSlug } },
              { slug: { equals: slug } },
              { title: { like: slug.replace(/-/g, ' ') } },
            ],
          },
        ],
      },
      limit: 1,
      depth: 2,
    });

    return (result.docs[0] as unknown as Property | undefined) ?? fallback;
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    return fallback;
  }
});

export const getAgentListings = cache(async (options?: {
  limit?: number;
  page?: number;
}): Promise<PaginatedResponse<Property>> => {
  const limit = options?.limit ?? 20;
  const page = options?.page ?? 1;
  const fallback = createPaginatedResponse(demoAgentProperties, limit, page);

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { status: { equals: 'published' } },
          { verticalType: { equals: 'agent' } },
        ],
      },
      limit,
      page,
      sort: '-createdAt',
      depth: 2,
    });

    return result.docs.length > 0
      ? (result as unknown as PaginatedResponse<Property>)
      : fallback;
  } catch (error) {
    console.error('Error fetching agent listings from Payload:', error);
    return fallback;
  }
});

export const getFeaturedAgentListings = cache(async (): Promise<Property[]> => {
  const fallback = demoAgentProperties.slice(0, 3);

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { status: { equals: 'published' } },
          { verticalType: { equals: 'agent' } },
        ],
      },
      limit: 3,
      sort: '-createdAt',
      depth: 2,
    });

    return result.docs.length > 0
      ? (result.docs as unknown as Property[])
      : fallback;
  } catch (error) {
    console.error('Error fetching featured agent listings:', error);
    return fallback;
  }
});

export const getAgentListingBySlug = cache(async (slug: string): Promise<Property | null> => {
  const fallback = demoAgentProperties.find(
    (property) => property.slug === slug || property.id === slug,
  ) ?? null;

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { verticalType: { equals: 'agent' } },
          {
            or: [
              { slug: { equals: slug } },
              { title: { like: slug.replace(/-/g, ' ') } },
            ],
          },
        ],
      },
      limit: 1,
      depth: 2,
    });

    return (result.docs[0] as unknown as Property | undefined) ?? fallback;
  } catch (error) {
    console.error('Error fetching agent listing by slug:', error);
    return fallback;
  }
});

export const getPropertiesByBHKType = cache(async (bhkType: string): Promise<Property[]> => {
  const fallback = demoProperties.filter((property) => property.bhkType === bhkType);

  try {
    const payload = await getPayloadInstance();

    if (!payload) {
      return fallback;
    }

    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { bhkType: { equals: bhkType } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 50,
      sort: '-createdAt',
    });

    return result.docs.length > 0
      ? (result.docs as unknown as Property[])
      : fallback;
  } catch (error) {
    console.error('Error fetching properties by BHK type:', error);
    return fallback;
  }
});
