// POI cache management utilities
// Server-side only - uses Payload CMS API

import type { POICategory, POIResult } from './types';

const CACHE_TTL_DAYS = 7;

// Demo POI data for local development
const demoPOIs: Record<POICategory, POIResult[]> = {
  restaurant: [
    { name: 'Beach Shack Restaurant', address: '123 Beach Road', location: { lat: 15.5000, lng: 73.8300 }, rating: 4.5, types: ['restaurant'] },
    { name: 'Seaside Cafe', address: '45 Ocean Ave', location: { lat: 15.4980, lng: 73.8320 }, rating: 4.2, types: ['cafe', 'restaurant'] },
  ],
  bar: [
    { name: 'Sunset Bar', address: '78 Coastal Lane', location: { lat: 15.4990, lng: 73.8310 }, rating: 4.3, types: ['bar'] },
  ],
  park: [
    { name: 'Beach Park', address: '10 Oceanfront', location: { lat: 15.4970, lng: 73.8330 }, rating: 4.7, types: ['park'] },
  ],
  beach: [
    { name: 'North Beach', address: 'North Shore', location: { lat: 15.5010, lng: 73.8290 }, rating: 4.8, types: ['beach'] },
    { name: 'South Beach', address: 'South Shore', location: { lat: 15.4950, lng: 73.8350 }, rating: 4.6, types: ['beach'] },
  ],
};

/**
 * Get cached POI data or fetch from Google Places
 * For demo, returns demo data
 */
export async function getPOIs(
  propertyId: string,
  lat: number,
  lng: number,
  category: POICategory,
  radiusMeters: number = 5000
): Promise<POIResult[]> {
  // Return demo data for local development
  console.log(`[getPOIs] Returning demo data for ${category}`);
  return demoPOIs[category] || [];
}

/**
 * Invalidate POI cache for a property
 */
export async function invalidatePOICache(propertyId: string): Promise<void> {
  console.log(`[invalidatePOICache] Would invalidate cache for ${propertyId}`);
}

/**
 * Get all POI categories for a property
 */
export async function getAllPOIs(
  propertyId: string,
  lat: number,
  lng: number,
  radiusMeters: number = 5000
): Promise<Record<POICategory, POIResult[]>> {
  return demoPOIs;
}

/**
 * Clean up expired POI cache entries
 */
export async function cleanupExpiredCache(): Promise<number> {
  console.log('[cleanupExpiredCache] Would clean up expired entries');
  return 0;
}
