// Google Places API client
// Server-side only - never import in client components

import type { POICategory, POIResult } from './types';

const CACHE_TTL_DAYS = 7;
const DEFAULT_RADIUS_METERS = 5000; // 5km radius

// Google Places type mapping
const TYPE_MAP: Record<POICategory, string> = {
  restaurant: 'restaurant|cafe',
  bar: 'bar|night_club',
  park: 'park',
  beach: 'natural_feature',
};

interface GooglePlaceResult {
  name: string;
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  types?: string[];
  place_id?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  next_page_token?: string;
}

/**
 * Fetch nearby POIs from Google Places API
 * @param lat - Latitude
 * @param lng - Longitude
 * @param category - POI category type
 * @param radiusMeters - Search radius in meters (default 5000)
 * @returns Array of POI results
 */
export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  category: POICategory,
  radiusMeters: number = DEFAULT_RADIUS_METERS
): Promise<POIResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('GOOGLE_PLACES_API_KEY not configured');
    return [];
  }

  // Google Places Nearby Search endpoint
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');

  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radiusMeters.toString());
  url.searchParams.set('type', TYPE_MAP[category]);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`Google Places API error: ${response.status}`);
      return [];
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`Google Places API status: ${data.status}`);
      return [];
    }

    // Transform results
    const results: POIResult[] = data.results.map((place) => ({
      name: place.name,
      address: place.vicinity || '',
      location: {
        lat: place.geometry?.location.lat ?? 0,
        lng: place.geometry?.location.lng ?? 0,
      },
      rating: place.rating,
      types: place.types || [],
      placeId: place.place_id,
      openingHours: place.opening_hours?.weekday_text,
      photos: place.photos?.slice(0, 3).map((p) => {
        // Generate photo URL from reference
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${apiKey}`;
      }),
    }));

    return results;
  } catch (error) {
    console.error('Google Places API fetch error:', error);
    return [];
  }
}

/**
 * Check if POI cache is expired
 * @param expiresAt - Expiration date string
 * @returns true if cache is expired
 */
export function isCacheExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Calculate expiration date
 * @param days - Number of days until expiration
 * @returns Date string
 */
export function calculateExpiresAt(days: number = CACHE_TTL_DAYS): string {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires.toISOString();
}
