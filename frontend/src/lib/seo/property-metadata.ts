/**
 * SEO Metadata utilities for property pages
 * Generates Next.js metadata objects with proper OpenGraph and Twitter cards
 */

import type { Property } from '@/types';
import type { Metadata } from 'next';

interface PropertyMetadataOptions {
  property: Property;
  baseUrl?: string;
}

/**
 * Generate comprehensive metadata for a property page
 */
export function getPropertyMetadata({
  property,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '',
}: PropertyMetadataOptions): Metadata {
  const url = `${baseUrl}/properties/${property.slug || property.id}`;
  const imageUrl = property.featuredImage?.url;
  const description = property.shortDescription || property.description.slice(0, 160);
  const title = property.title;

  // Generate keywords from property attributes
  const keywords = [
    property.title,
    property.propertyType,
    property.bhkType,
    property.locality,
    property.address?.city,
    property.address?.state,
    'property for sale',
    'real estate',
    property.furnishingStatus,
    property.listingIntent,
  ]
    .filter(Boolean)
    .join(', ');

  // Format price for display
  const priceDisplay = property.salePrice
    ? `₹${property.salePrice.toLocaleString('en-IN')}`
    : property.monthlyRent
      ? `₹${property.monthlyRent.toLocaleString('en-IN')}/month`
      : property.nightlyPrice
        ? `₹${property.nightlyPrice.toLocaleString('en-IN')}`
        : 'Price on Request';

  return {
    title: `${title} | ${priceDisplay} - Real Estate`,
    description: `${description.slice(0, 155)}...`,
    keywords,
    authors: property.agent?.name ? [{ name: property.agent.name }] : undefined,

    // Canonical URL
    alternates: {
      canonical: url,
    },

    // OpenGraph / Facebook
    openGraph: {
      type: 'website',
      url,
      title: `${title} | ${priceDisplay}`,
      description: description.slice(0, 200),
      siteName: 'Real Estate Agent',
      locale: 'en_IN',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },

    // Twitter / X Card
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${priceDisplay}`,
      description: description.slice(0, 200),
      images: imageUrl ? [imageUrl] : undefined,
      creator: '@realestateagent',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional metadata
    other: {
      'og:type': 'product',
      'og:availability': property.listingStatus === 'available' ? 'instock' : 'out of stock',
      'product:price:amount': String(property.salePrice || property.monthlyRent || property.nightlyPrice),
      'product:price:currency': property.currency || 'INR',
    },
  };
}

/**
 * Generate metadata for locality pages
 */
export function getLocalityMetadata(params: {
  locality: string;
  city: string;
  propertyCount: number;
  avgPrice: string;
}): Metadata {
  const { locality, city, propertyCount, avgPrice } = params;
  const title = `Properties in ${locality}, ${city} | Real Estate Agent`;
  const description = `Explore ${propertyCount} properties for sale and rent in ${locality}, ${city}. Average price: ${avgPrice}. Find your dream home with verified listings, RERA approved projects, and expert guidance.`;

  return {
    title,
    description,
    keywords: [
      `properties in ${locality}`,
      `real estate ${city}`,
      `${locality} property`,
      `homes in ${locality}`,
      `buy property ${city}`,
      `rent ${locality}`,
    ].join(', '),

    alternates: {
      canonical: `/property-in/${locality.toLowerCase().replace(/\s+/g, '-')}`,
    },

    openGraph: {
      type: 'website',
      title,
      description: description.slice(0, 200),
      siteName: 'Real Estate Agent',
      locale: 'en_IN',
    },

    twitter: {
      card: 'summary',
      title,
      description: description.slice(0, 200),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  };
}

/**
 * Generate metadata for agent profile pages
 */
export function getAgentMetadata(params: {
  name: string;
  specialization?: string[];
  yearsExperience?: number;
  locality?: string;
}): Metadata {
  const { name, specialization, yearsExperience, locality } = params;
  const title = `${name} | Real Estate Agent`;
  const description = `Connect with ${name}, an experienced real estate professional${
    yearsExperience ? ` with ${yearsExperience}+ years of experience` : ''
  }${specialization?.length ? ` specializing in ${specialization.join(', ')}` : ''}${
    locality ? ` serving ${locality}` : ''
  }. View listings, schedule visits, and get expert property guidance.`;

  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      name,
      'real estate agent',
      'property consultant',
      ...(specialization || []),
      locality,
    ]
      .filter(Boolean)
      .join(', '),

    alternates: {
      canonical: `/agents/profile/${name.toLowerCase().replace(/\s+/g, '-')}`,
    },

    openGraph: {
      type: 'profile',
      title,
      description: description.slice(0, 200),
      siteName: 'Real Estate Agent',
      locale: 'en_IN',
    },

    twitter: {
      card: 'summary',
      title,
      description: description.slice(0, 200),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
