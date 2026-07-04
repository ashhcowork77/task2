'use client';

import { useFilterStore } from '@/lib/stores/filterStore';
import { FilterChip } from './FilterChip';

// Label mappings for display
const BHK_LABELS: Record<string, string> = {
  '1_bhk': '1 BHK',
  '2_bhk': '2 BHK',
  '3_bhk': '3 BHK',
  '4_plus_bhk': '4+ BHK',
  studio: 'Studio',
  villa: 'Villa',
};

const FURNISHING_LABELS: Record<string, string> = {
  furnished: 'Furnished',
  semi_furnished: 'Semi-Furnished',
  unfurnished: 'Unfurnished',
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  ac: 'AC',
  pool: 'Pool',
  kitchen: 'Kitchen',
  parking: 'Parking',
  tv: 'TV',
  gym: 'Gym',
  beach_access: 'Beach',
  hot_tub: 'Hot Tub',
  bbq_grill: 'BBQ',
  fireplace: 'Fireplace',
  garden: 'Garden',
  balcony: 'Balcony',
  terrace: 'Terrace',
  security: 'Security',
};

const PET_POLICY_LABELS: Record<string, string> = {
  pets_allowed: 'Pets Allowed',
  pets_not_allowed: 'No Pets',
  cats_only: 'Cats Only',
  dogs_only: 'Dogs Only',
};

const TENANT_PREFERENCE_LABELS: Record<string, string> = {
  families: 'Families',
  couples: 'Couples',
  business_travelers: 'Business',
  anyone: 'Anyone',
};

/**
 * Display active filters as removable chips
 */
export function ActiveFilters() {
  const {
    bhkTypes,
    removeBHK,
    propertyTypes,
    removePropertyType,
    furnishing,
    setFurnishing,
    amenities,
    removeAmenity,
    locality,
    setLocality,
    petPolicy,
    setPetPolicy,
    tenantPreference,
    setTenantPreference,
    priceMin,
    priceMax,
    setPriceMin,
    setPriceMax,
    clearAll,
  } = useFilterStore();

  const filters: { label: string; onRemove: () => void }[] = [];

  // BHK types
  bhkTypes.forEach((bhk) => {
    filters.push({
      label: BHK_LABELS[bhk] || bhk,
      onRemove: () => removeBHK(bhk),
    });
  });

  // Property types
  propertyTypes.forEach((type) => {
    filters.push({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      onRemove: () => removePropertyType(type),
    });
  });

  // Furnishing
  if (furnishing) {
    filters.push({
      label: FURNISHING_LABELS[furnishing] || furnishing,
      onRemove: () => setFurnishing(null),
    });
  }

  // Amenities
  amenities.forEach((amenity) => {
    filters.push({
      label: AMENITY_LABELS[amenity] || amenity,
      onRemove: () => removeAmenity(amenity),
    });
  });

  // Locality
  if (locality) {
    filters.push({
      label: locality,
      onRemove: () => setLocality(null),
    });
  }

  // Pet policy
  if (petPolicy) {
    filters.push({
      label: PET_POLICY_LABELS[petPolicy] || petPolicy,
      onRemove: () => setPetPolicy(null),
    });
  }

  // Tenant preference
  if (tenantPreference) {
    filters.push({
      label: TENANT_PREFERENCE_LABELS[tenantPreference] || tenantPreference,
      onRemove: () => setTenantPreference(null),
    });
  }

  // Price range
  if (priceMin !== null || priceMax !== null) {
    const min = priceMin ?? 0;
    const max = priceMax ?? '∞';
    filters.push({
      label: `₹${min.toLocaleString()} - ${max === '∞' ? max : '₹' + Number(max).toLocaleString()}`,
      onRemove: () => {
        setPriceMin(null);
        setPriceMax(null);
      },
    });
  }

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500">Active:</span>
      {filters.map((f, i) => (
        <FilterChip key={i} label={f.label} onRemove={f.onRemove} />
      ))}
      <button
        onClick={clearAll}
        className="text-sm text-red-600 hover:text-red-700 ml-2"
        type="button"
      >
        Clear All
      </button>
    </div>
  );
}
