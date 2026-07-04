import type { Property } from '@/types';

/**
 * Options for generating property JSON-LD schema
 */
interface PropertyJsonLdOptions {
  property: Property;
  baseUrl: string;
}

/**
 * Generate RealEstateListing JSON-LD schema for property detail pages
 * @see https://schema.org/RealEstateListing
 */
export function generatePropertyJsonLd({ property, baseUrl }: PropertyJsonLdOptions) {
  const propertySlug = property.slug || '';
  const propertyUrl = `${baseUrl}/properties/${propertySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.shortDescription || property.description,
    url: propertyUrl,
    datePosted: property.createdAt,
    image: property.featuredImage?.url,
    offers: {
      '@type': 'Offer',
      price: property.nightlyPrice,
      priceCurrency: property.currency || 'INR',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address?.street,
      addressLocality: property.address?.city,
      addressRegion: property.address?.state,
      postalCode: property.address?.zipCode,
      addressCountry: property.address?.country || 'IN',
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD schema for breadcrumb navigation
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbJsonLd({
  property,
  baseUrl,
}: {
  property: Property;
  baseUrl: string;
}) {
  const propertySlug = property.slug || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Properties',
        item: `${baseUrl}/properties`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: property.title,
        item: `${baseUrl}/properties/${propertySlug}`,
      },
    ],
  };
}
