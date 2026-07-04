import type { FilterState } from '../stores/filterStore';

/**
 * Search params interface for URL serialization
 */
export interface SearchParams {
  bhk?: string;        // comma-separated: "1_bhk,2_bhk"
  type?: string;        // comma-separated
  price_min?: string;   // number as string
  price_max?: string;
  furnishing?: string;
  amenities?: string;   // comma-separated
  locality?: string;
  pet?: string;
  tenant?: string;
  bedrooms?: string;
  bathrooms?: string;
  facing?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  // Radius-based geolocation search
  radius?: string;      // Search radius in km
  center_lat?: string; // Center latitude
  center_lng?: string; // Center longitude
}

/**
 * Convert filter state to search params
 */
export function stateToSearchParams(state: FilterState): SearchParams {
  const params: SearchParams = {};

  if (state.bhkTypes.length > 0) {
    params.bhk = state.bhkTypes.join(',');
  }

  if (state.propertyTypes.length > 0) {
    params.type = state.propertyTypes.join(',');
  }

  if (state.priceMin !== null) {
    params.price_min = String(state.priceMin);
  }

  if (state.priceMax !== null) {
    params.price_max = String(state.priceMax);
  }

  if (state.furnishing) {
    params.furnishing = state.furnishing;
  }

  if (state.amenities.length > 0) {
    params.amenities = state.amenities.join(',');
  }

  if (state.locality) {
    params.locality = state.locality;
  }

  if (state.petPolicy) {
    params.pet = state.petPolicy;
  }

  if (state.tenantPreference) {
    params.tenant = state.tenantPreference;
  }

  if (state.bedrooms !== null) {
    params.bedrooms = String(state.bedrooms);
  }

  if (state.bathrooms !== null) {
    params.bathrooms = String(state.bathrooms);
  }

  if (state.facing) {
    params.facing = state.facing;
  }

  if (state.sortBy !== 'newest') {
    params.sort = state.sortBy;
  }

  // Radius-based geolocation search
  if (state.radius !== null && state.centerLat !== null && state.centerLng !== null) {
    params.radius = String(state.radius);
    params.center_lat = String(state.centerLat);
    params.center_lng = String(state.centerLng);
  }

  return params;
}

/**
 * Convert search params to partial filter state
 */
export function searchParamsToState(params: SearchParams): Partial<FilterState> {
  const state: Partial<FilterState> = {};

  if (params.bhk) {
    state.bhkTypes = params.bhk.split(',');
  }

  if (params.type) {
    state.propertyTypes = params.type.split(',');
  }

  if (params.price_min) {
    state.priceMin = Number(params.price_min);
  }

  if (params.price_max) {
    state.priceMax = Number(params.price_max);
  }

  if (params.furnishing) {
    state.furnishing = params.furnishing;
  }

  if (params.amenities) {
    state.amenities = params.amenities.split(',');
  }

  if (params.locality) {
    state.locality = params.locality;
  }

  if (params.pet) {
    state.petPolicy = params.pet;
  }

  if (params.tenant) {
    state.tenantPreference = params.tenant;
  }

  if (params.bedrooms) {
    state.bedrooms = Number(params.bedrooms);
  }

  if (params.bathrooms) {
    state.bathrooms = Number(params.bathrooms);
  }

  if (params.facing) {
    state.facing = params.facing;
  }

  if (params.sort) {
    state.sortBy = params.sort;
  }

  // Radius-based geolocation search
  if (params.radius && params.center_lat && params.center_lng) {
    state.radius = Number(params.radius);
    state.centerLat = Number(params.center_lat);
    state.centerLng = Number(params.center_lng);
  }

  return state;
}

/**
 * Build search URL from filter state
 */
export function buildSearchURL(state: FilterState, basePath: string = '/properties'): string {
  const params = stateToSearchParams(state);
  const searchString = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return searchString ? `${basePath}?${searchString}` : basePath;
}

/**
 * Parse current URL search params
 */
export function parseURLSearchParams(): SearchParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const params: SearchParams = {};

  searchParams.forEach((value, key) => {
    switch (key) {
      case 'bhk':
        params.bhk = value;
        break;
      case 'type':
        params.type = value;
        break;
      case 'price_min':
        params.price_min = value;
        break;
      case 'price_max':
        params.price_max = value;
        break;
      case 'furnishing':
        params.furnishing = value;
        break;
      case 'amenities':
        params.amenities = value;
        break;
      case 'locality':
        params.locality = value;
        break;
      case 'pet':
        params.pet = value;
        break;
      case 'tenant':
        params.tenant = value;
        break;
      case 'bedrooms':
        params.bedrooms = value;
        break;
      case 'bathrooms':
        params.bathrooms = value;
        break;
      case 'facing':
        params.facing = value;
        break;
      case 'sort':
        if (value === 'price_asc' || value === 'price_desc' || value === 'newest') {
          params.sort = value;
        }
        break;
      case 'radius':
        params.radius = value;
        break;
      case 'center_lat':
        params.center_lat = value;
        break;
      case 'center_lng':
        params.center_lng = value;
        break;
    }
  });

  return params;
}
