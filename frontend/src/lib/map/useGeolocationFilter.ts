import type { Where } from 'payload';

/**
 * Build a Payload Where clause for PostGIS radius search.
 *
 * Uses ST_DWithin for index-efficient filtering:
 * - ST_DWithin uses the spatial index (GiST) to pre-filter rows
 * - Much faster than ST_Distance which computes exact distance for every row
 *
 * @param centerLat - Center latitude
 * @param centerLng - Center longitude
 * @param radiusKm  - Search radius in kilometers
 * @returns Payload Where clause for radius filter
 *
 * @example
 * // Properties within 5km of Indiranagar, Bangalore
 * const where = buildRadiusWhere(12.9716, 77.6406, 5);
 */
export function buildRadiusWhere(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): Where {
  // Convert km to meters for PostGIS ST_DWithin
  const radiusMeters = radiusKm * 1000;

  return {
    and: [
      // Geolocation must exist
      {
        geolocation: {
          exists: true,
        },
      },
      // Radius filter using near operator
      {
        geolocation: {
          near: {
            latitude: centerLat,
            longitude: centerLng,
            // Payload 3.x translates this to ST_DWithin
            // The 'distance' field specifies max distance in meters
            distance: radiusMeters,
          },
        },
      },
    ],
  };
}

/**
 * Build complete geolocation query combining radius with other filters
 *
 * @param centerLat - Center latitude
 * @param centerLng - Center longitude
 * @param radiusKm  - Search radius in kilometers
 * @param otherFilters - Additional Where clauses to AND with
 * @returns Combined Where clause
 */
export function buildGeolocationQuery(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  otherFilters: Where[] = []
): Where {
  const radiusFilter = buildRadiusWhere(centerLat, centerLng, radiusKm);

  if (otherFilters.length === 0) {
    return radiusFilter;
  }

  return {
    and: [radiusFilter, ...otherFilters],
  };
}

/**
 * Calculate distance between two points using Haversine formula
 * Used for sorting or displaying distances
 *
 * @param lat1 - Point 1 latitude
 * @param lng1 - Point 1 longitude
 * @param lat2 - Point 2 latitude
 * @param lng2 - Point 2 longitude
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Validate coordinates are within valid ranges
 *
 * @param lat - Latitude (-90 to 90)
 * @param lng - Longitude (-180 to 180)
 * @returns true if valid
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
