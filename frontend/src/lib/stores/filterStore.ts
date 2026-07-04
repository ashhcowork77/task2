import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Filter state interface for property search
 */
export interface FilterState {
  // BHK types: 1_bhk, 2_bhk, 3_bhk, etc.
  bhkTypes: string[];
  // Property types: apartment, house, villa, etc.
  propertyTypes: string[];
  // Price range
  priceMin: number | null;
  priceMax: number | null;
  // Furnishing status
  furnishing: string | null;
  // Amenities: wifi, ac, pool, etc.
  amenities: string[];
  // Locality/neighborhood
  locality: string | null;
  // Pet policy
  petPolicy: string | null;
  // Tenant preference
  tenantPreference: string | null;
  // Bedrooms count
  bedrooms: number | null;
  // Bathrooms count
  bathrooms: number | null;
  // Facing direction
  facing: string | null;
  // Sort order
  sortBy: 'price_asc' | 'price_desc' | 'newest';
  // Radius-based geolocation search
  radius: number | null;     // Search radius in km
  centerLat: number | null;  // Center latitude
  centerLng: number | null;  // Center longitude
}

interface FilterActions {
  // BHK toggle
  toggleBHK: (bhk: string) => void;
  // Property type toggle
  togglePropertyType: (type: string) => void;
  // Price range setters
  setPriceMin: (value: number | null) => void;
  setPriceMax: (value: number | null) => void;
  // Furnishing setter
  setFurnishing: (value: string | null) => void;
  // Amenity toggle
  toggleAmenity: (amenity: string) => void;
  // Locality setter
  setLocality: (value: string | null) => void;
  // Pet policy setter
  setPetPolicy: (value: string | null) => void;
  // Tenant preference setter
  setTenantPreference: (value: string | null) => void;
  // Bedrooms setter
  setBedrooms: (value: number | null) => void;
  // Bathrooms setter
  setBathrooms: (value: number | null) => void;
  // Facing setter
  setFacing: (value: string | null) => void;
  // Sort order setter
  setSortBy: (value: 'price_asc' | 'price_desc' | 'newest') => void;
  // Radius search setters
  setRadius: (value: number | null) => void;
  setCenter: (lat: number, lng: number) => void;
  clearCenter: () => void;
  // Clear all filters
  clearAll: () => void;
  // Remove single BHK
  removeBHK: (bhk: string) => void;
  // Remove single property type
  removePropertyType: (type: string) => void;
  // Remove single amenity
  removeAmenity: (amenity: string) => void;
}

type FilterStore = FilterState & FilterActions;

const initialState: FilterState = {
  bhkTypes: [],
  propertyTypes: [],
  priceMin: null,
  priceMax: null,
  furnishing: null,
  amenities: [],
  locality: null,
  petPolicy: null,
  tenantPreference: null,
  bedrooms: null,
  bathrooms: null,
  facing: null,
  sortBy: 'newest',
  radius: null,
  centerLat: null,
  centerLng: null,
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...initialState,

      toggleBHK: (bhk) =>
        set((state) => ({
          bhkTypes: state.bhkTypes.includes(bhk)
            ? state.bhkTypes.filter((b) => b !== bhk)
            : [...state.bhkTypes, bhk],
        })),

      togglePropertyType: (type) =>
        set((state) => ({
          propertyTypes: state.propertyTypes.includes(type)
            ? state.propertyTypes.filter((t) => t !== type)
            : [...state.propertyTypes, type],
        })),

      setPriceMin: (value) => set({ priceMin: value }),
      setPriceMax: (value) => set({ priceMax: value }),
      setFurnishing: (value) => set({ furnishing: value }),
      setLocality: (value) => set({ locality: value }),
      setPetPolicy: (value) => set({ petPolicy: value }),
      setTenantPreference: (value) => set({ tenantPreference: value }),
      setBedrooms: (value) => set({ bedrooms: value }),
      setBathrooms: (value) => set({ bathrooms: value }),
      setFacing: (value) => set({ facing: value }),
      setSortBy: (value) => set({ sortBy: value }),

      toggleAmenity: (amenity) =>
        set((state) => ({
          amenities: state.amenities.includes(amenity)
            ? state.amenities.filter((a) => a !== amenity)
            : [...state.amenities, amenity],
        })),

      removeBHK: (bhk) =>
        set((state) => ({
          bhkTypes: state.bhkTypes.filter((b) => b !== bhk),
        })),

      removePropertyType: (type) =>
        set((state) => ({
          propertyTypes: state.propertyTypes.filter((t) => t !== type),
        })),

      removeAmenity: (amenity) =>
        set((state) => ({
          amenities: state.amenities.filter((a) => a !== amenity),
        })),

      clearAll: () => set(initialState),

      setRadius: (value) => set({ radius: value }),
      setCenter: (lat, lng) => set({ centerLat: lat, centerLng: lng }),
      clearCenter: () => set({ centerLat: null, centerLng: null, radius: null }),
    }),
    {
      name: 'property-filters',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ...state }),
    }
  )
);

/**
 * Hook to check if any filters are active
 */
export function useHasActiveFilters(): boolean {
  const state = useFilterStore();
  return (
    state.bhkTypes.length > 0 ||
    state.propertyTypes.length > 0 ||
    state.priceMin !== null ||
    state.priceMax !== null ||
    state.furnishing !== null ||
    state.amenities.length > 0 ||
    state.locality !== null ||
    state.petPolicy !== null ||
    state.tenantPreference !== null ||
    state.bedrooms !== null ||
    state.bathrooms !== null ||
    state.facing !== null ||
    (state.radius !== null && state.centerLat !== null && state.centerLng !== null)
  );
}
