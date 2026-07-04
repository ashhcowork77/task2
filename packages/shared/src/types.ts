// Tenant types (MULTI-04 stub)
export type VerticalType = 'airbnb' | 'agent' | 'builder';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  verticalType: VerticalType;
  // Branding fields (Phase 2): logo, primaryColor, tagline
}

// Property types (PROP-02 stub)
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Geolocation {
  lat: number;
  lng: number;
}

// Media/Image type from Payload uploads
export interface PropertyMedia {
  id: string;
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

// Full Property type matching Payload collection
export interface Property {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  address: Address;
  geolocation: Geolocation;
  locality?: string;
  // BHK and property details
  bhkType?: '1_bhk' | '2_bhk' | '3_bhk' | '4_plus_bhk' | 'studio' | 'villa' | 'penthouse';
  propertyType?: 'apartment' | 'house' | 'villa' | 'condo' | 'farmhouse';
  furnishingStatus?: 'furnished' | 'semi_furnished' | 'unfurnished';
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  floor?: { current: number; total: number };
  facing?: string;
  // Pricing
  nightlyPrice: number;
  currency?: string;
  seasonalPricing?: Array<{
    seasonName: string;
    startDate: string;
    endDate: string;
    price: number;
  }>;
  minNights?: number;
  maxNights?: number;
  // Amenities & Rules
  amenities?: string[];
  houseRules?: string;
  petPolicy?: 'pets_allowed' | 'pets_not_allowed' | 'cats_only' | 'dogs_only';
  tenantPreference?: 'families' | 'couples' | 'business_travelers' | 'anyone';
  // Media
  featuredImage?: PropertyMedia;
  gallery?: PropertyMedia[];
  // Status
  status?: 'draft' | 'published' | 'archived';
  slug?: string;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Export all types
export type { Tenant, Property, PropertyMedia, Address, Geolocation, VerticalType };
