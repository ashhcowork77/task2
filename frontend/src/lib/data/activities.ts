import { cache } from 'react';
import type { PaginatedResponse } from '@/types';

/**
 * Activity type based on Payload Activities collection
 */
interface Activity {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  highlights?: Array<{ highlight: string }>;
  duration?: string;
  groupSize?: { minGuests?: number; maxGuests?: number };
  price: number;
  currency?: string;
  includes?: string;
  cancellationPolicy?: string;
  featuredImage?: { url: string; alt?: string };
  gallery?: Array<{ url: string; alt?: string }>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

// Demo activities for local development
const demoActivities: Activity[] = [
  {
    id: '1',
    title: 'Sunset Beach Yoga',
    shortDescription: 'Relaxing yoga session as the sun sets over the ocean',
    description: 'Experience the perfect blend of wellness and natural beauty with our sunset beach yoga session. Our certified instructors guide you through calming asanas while you listen to the waves and watch the sky painted in hues of orange and pink.',
    highlights: [
      { highlight: 'Professional certified yoga instructor' },
      { highlight: 'Stunning ocean views' },
      { highlight: 'All skill levels welcome' },
      { highlight: 'Yoga mats provided' },
    ],
    duration: '2 hours',
    groupSize: { minGuests: 2, maxGuests: 15 },
    price: 1500,
    currency: 'INR',
    includes: 'Yoga mat, water bottle, fresh coconut water, towel',
    cancellationPolicy: 'Free cancellation up to 24 hours before the experience',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      alt: 'Beach yoga session',
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', alt: 'Beach yoga' },
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Local Cooking Class',
    shortDescription: 'Learn authentic regional cuisine from local chefs',
    description: 'Dive into the rich culinary traditions of the region with our hands-on cooking class. Learn family recipes passed down through generations and discover the secrets behind authentic flavors.',
    highlights: [
      { highlight: 'Learn 3-4 traditional recipes' },
      { highlight: 'Take home recipe booklet' },
      { highlight: 'Enjoy your cooked meal' },
      { highlight: 'Visit local spice market' },
    ],
    duration: '4 hours',
    groupSize: { minGuests: 2, maxGuests: 10 },
    price: 2500,
    currency: 'INR',
    includes: 'All ingredients, recipe booklet, lunch',
    cancellationPolicy: 'Free cancellation up to 48 hours before',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      alt: 'Cooking class',
    },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', alt: 'Cooking' },
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Fetch all published activities
 * Uses React cache() to deduplicate requests during SSR
 */
export const getPublishedActivities = cache(async (): Promise<Activity[]> => {
  // Return demo data for local development
  return demoActivities;
});

/**
 * Fetch a single activity by slug
 * Uses React cache() to deduplicate requests during SSR
 */
export const getActivityBySlug = cache(async (slug: string): Promise<Activity | null> => {
  const activity = demoActivities.find(
    a => a.title.toLowerCase().replace(/\s+/g, '-') === slug ||
         a.id === slug
  );
  return activity ?? null;
});

export type { Activity };
