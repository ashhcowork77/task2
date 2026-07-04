import type { FilterState } from '../stores/filterStore';

/**
 * Build Payload query from filter state
 * Transforms Zustand filter state into Payload CMS query parameters
 */
export function buildPropertyQuery(filters: FilterState): Record<string, unknown> {
  const query: Record<string, unknown> = {
    status: 'published', // Only published properties
    limit: 20,
  };

  // BHK types: comma-separated string
  if (filters.bhkTypes.length > 0) {
    query.bhkType = { in: filters.bhkTypes.join(',') };
  }

  // Property types: comma-separated string
  if (filters.propertyTypes.length > 0) {
    query.propertyType = { in: filters.propertyTypes.join(',') };
  }

  // Price range: use gte/lte operators
  if (filters.priceMin !== null || filters.priceMax !== null) {
    query.nightlyPrice = {};
    if (filters.priceMin !== null) {
      (query.nightlyPrice as Record<string, number>).gte = filters.priceMin;
    }
    if (filters.priceMax !== null) {
      (query.nightlyPrice as Record<string, number>).lte = filters.priceMax;
    }
  }

  // Furnishing status
  if (filters.furnishing) {
    query.furnishingStatus = filters.furnishing;
  }

  // Amenities: all must match (AND) or any match (OR) - implement AND
  if (filters.amenities.length > 0) {
    // Payload handles array intersection for hasMany select
    query.amenities = { in: filters.amenities.join(',') };
  }

  // Locality: partial match
  if (filters.locality) {
    query.locality = { like: `%${filters.locality}%` };
  }

  // Pet policy
  if (filters.petPolicy) {
    query.petPolicy = filters.petPolicy;
  }

  // Tenant preference
  if (filters.tenantPreference) {
    query.tenantPreference = filters.tenantPreference;
  }

  // Bedrooms
  if (filters.bedrooms !== null) {
    query.bedrooms = { gte: filters.bedrooms };
  }

  // Bathrooms
  if (filters.bathrooms !== null) {
    query.bathrooms = { gte: filters.bathrooms };
  }

  // Facing direction
  if (filters.facing) {
    query.facing = filters.facing;
  }

  // Sorting
  if (filters.sortBy === 'price_asc') {
    query.sort = 'nightlyPrice';
    query.order = 'asc';
  } else if (filters.sortBy === 'price_desc') {
    query.sort = 'nightlyPrice';
    query.order = 'desc';
  }

  return query;
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;

  if (filters.bhkTypes.length > 0) count++;
  if (filters.propertyTypes.length > 0) count++;
  if (filters.priceMin !== null || filters.priceMax !== null) count++;
  if (filters.furnishing) count++;
  if (filters.amenities.length > 0) count++;
  if (filters.locality) count++;
  if (filters.petPolicy) count++;
  if (filters.tenantPreference) count++;
  if (filters.bedrooms !== null) count++;
  if (filters.bathrooms !== null) count++;
  if (filters.facing) count++;

  return count;
}

/**
 * Get human-readable filter summary
 */
export function getFilterSummary(filters: FilterState): string[] {
  const summary: string[] = [];

  if (filters.bhkTypes.length > 0) {
    summary.push(`${filters.bhkTypes.length} BHK type${filters.bhkTypes.length > 1 ? 's' : ''}`);
  }
  if (filters.propertyTypes.length > 0) {
    summary.push(`${filters.propertyTypes.length} property type${filters.propertyTypes.length > 1 ? 's' : ''}`);
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    const min = filters.priceMin ?? 0;
    const max = filters.priceMax ?? '∞';
    summary.push(`₹${min.toLocaleString()} - ₹${max === '∞' ? max : max.toLocaleString()}`);
  }
  if (filters.furnishing) {
    summary.push(filters.furnishing);
  }
  if (filters.amenities.length > 0) {
    summary.push(`${filters.amenities.length} amenity${filters.amenities.length > 1 ? 's' : ''}`);
  }
  if (filters.locality) {
    summary.push(filters.locality);
  }

  return summary;
}
