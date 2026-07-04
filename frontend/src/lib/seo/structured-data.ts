/**
 * Schema.org structured data utilities
 * Generates JSON-LD markup for search engine rich results
 */

import type { Property } from '@/types';

/**
 * RealEstateListing schema for property pages
 */
export function getRealEstateListingSchema(property: Property): object {
  const location = property.address
    ? [
        property.address.locality,
        property.address.city,
        property.address.state,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.shortDescription || property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/properties/${property.slug || property.id}`,
    image: property.featuredImage?.url || undefined,
    address: property.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: property.address.street,
          addressLocality: property.address.city,
          addressRegion: property.address.state,
          postalCode: property.address.zipCode,
          addressCountry: property.address.country || 'IN',
        }
      : undefined,
    geo: property.geolocation
      ? {
          '@type': 'GeoCoordinates',
          latitude: property.geolocation.lat,
          longitude: property.geolocation.lng,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: property.salePrice || property.nightlyPrice,
      priceCurrency: property.currency || 'INR',
      availability:
        property.listingStatus === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
    },
    numberOfRooms: property.bedrooms
      ? {
          '@type': 'QuantitativeValue',
          value: property.bedrooms,
        }
      : undefined,
    amenityFeature: property.amenities?.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
  };
}

/**
 * LocalBusiness schema for homepage
 */
export function getLocalBusinessSchema(config: {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
  hours?: string;
  geo?: { lat: number; lng: number };
  priceRange?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: config.name,
    description: config.description,
    url: config.url || process.env.NEXT_PUBLIC_SITE_URL,
    logo: config.logo,
    telephone: config.phone,
    email: config.email,
    address: config.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: config.address.street,
          addressLocality: config.address.city,
          addressRegion: config.address.state,
          postalCode: config.address.zipCode,
          addressCountry: config.address.country || 'IN',
        }
      : undefined,
    geo: config.geo
      ? {
          '@type': 'GeoCoordinates',
          latitude: config.geo.lat,
          longitude: config.geo.lng,
        }
      : undefined,
    openingHoursSpecification: config.hours
      ? {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:00',
          closes: '19:00',
        }
      : undefined,
    priceRange: config.priceRange || '$$',
  };
}

/**
 * AggregateRating schema for testimonials/reviews
 */
export function getAggregateRatingSchema(config: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
  itemReviewed?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: config.ratingValue,
    bestRating: config.bestRating || 5,
    worstRating: config.worstRating || 1,
    reviewCount: config.reviewCount,
    itemReviewed: config.itemReviewed,
  };
}

/**
 * BreadcrumbList schema for navigation breadcrumb trails
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage schema for FAQ sections
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Person schema for agent profiles
 */
export function getPersonSchema(config: {
  name: string;
  description?: string;
  image?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  worksFor?: string;
  url?: string;
  sameAs?: string[];
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    description: config.description,
    image: config.image,
    email: config.email,
    telephone: config.phone,
    jobTitle: config.jobTitle,
    worksFor: config.worksFor
      ? {
          '@type': 'Organization',
          name: config.worksFor,
        }
      : undefined,
    url: config.url,
    sameAs: config.sameAs,
  };
}

/**
 * Generate script tag for JSON-LD
 */
export function getJsonLdScript(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Create multiple schemas for a page
 */
export function createMultiSchema(...schemas: object[]): string {
  return schemas.map((schema) => getJsonLdScript(schema)).join('\n');
}
