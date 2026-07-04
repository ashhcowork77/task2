// Inline types from shared package
// Using relative imports to avoid module resolution issues

// Property types matching Payload collection
export interface Address {
  street?: string;
  locality?: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
}

export interface Geolocation {
  lat: number;
  lng: number;
}

export interface PropertyMedia {
  id?: string;
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  address: Address;
  geolocation?: Geolocation;
  locality?: string;
  verticalType?: 'airbnb' | 'agent' | 'builder';
  listingIntent?: 'short_let' | 'sale' | 'rent' | 'sale_or_rent';
  listingStatus?: 'available' | 'under_offer' | 'sold' | 'rented' | 'off_market';
  bhkType?: '1_bhk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '4_plus_bhk' | 'studio' | 'villa' | 'penthouse';
  propertyType?: 'apartment' | 'house' | 'villa' | 'condo' | 'farmhouse' | 'plot' | 'office' | 'retail';
  furnishingStatus?: 'furnished' | 'semi_furnished' | 'unfurnished';
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  floor?: { current: number; total: number };
  facing?: string;
  nightlyPrice: number;
  salePrice?: number;
  monthlyRent?: number;
  priceLabel?: string;
  maintenanceCharges?: number;
  brokerageNote?: string;
  currency?: string;
  seasonalPricing?: Array<{
    seasonName: string;
    startDate: string;
    endDate: string;
    price: number;
  }>;
  minNights?: number;
  maxNights?: number;
  amenities?: string[];
  houseRules?: string;
  petPolicy?: 'pets_allowed' | 'pets_not_allowed' | 'cats_only' | 'dogs_only';
  tenantPreference?: 'families' | 'couples' | 'business_travelers' | 'anyone';
  possessionStatus?: 'ready_to_move' | 'under_construction' | 'resale' | 'new_launch';
  area?: {
    carpetSqFt?: number;
    builtUpSqFt?: number;
    plotSqFt?: number;
  };
  reraId?: string;
  propertyHighlights?: Array<{
    title: string;
    detail?: string;
  }>;
  agent?: {
    name?: string;
    role?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    licenseId?: string;
    bio?: string;
    headshot?: PropertyMedia;
  };
  leadRouting?: {
    primaryCta?: 'schedule_visit' | 'request_brochure' | 'call_agent' | 'whatsapp_agent' | 'seller_valuation';
    callTrackingNumber?: string;
    whatsappNumber?: string;
    assignedTo?: string;
    responseSla?: string;
  };
  campaign?: {
    adHeadline?: string;
    adDescription?: string;
    landingPageSlug?: string;
    utmCampaign?: string;
    sourceTags?: string[];
  };
  featuredImage?: PropertyMedia;
  gallery?: PropertyMedia[];
  status?: 'draft' | 'published' | 'archived';
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tenant types
export type VerticalType = 'airbnb' | 'agent' | 'builder';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  verticalType: VerticalType;
}

// Frontend-specific types
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
  limit?: number;
  pagingCounter?: number;
}
