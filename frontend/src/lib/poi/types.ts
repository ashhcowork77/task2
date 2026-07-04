// POI type definitions

export type POICategory = 'restaurant' | 'bar' | 'park' | 'beach';

export interface POIResult {
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  types: string[];
  placeId?: string;
  openingHours?: string[];
  photos?: string[];
}

export interface POICacheEntry {
  id: string;
  property: string;
  poiType: POICategory;
  centerLat: number;
  centerLng: number;
  data: POIResult[];
  expiresAt: string;
}

// Google Places API type mapping
export const POI_CATEGORY_LABELS: Record<POICategory, string> = {
  restaurant: 'Restaurants & Cafes',
  bar: 'Bars & Nightlife',
  park: 'Parks & Recreation',
  beach: 'Beaches & Scenic',
};

export const POI_CATEGORY_ICONS: Record<POICategory, string> = {
  restaurant: 'utensils',
  bar: 'wine',
  park: 'trees',
  beach: 'umbrella',
};
