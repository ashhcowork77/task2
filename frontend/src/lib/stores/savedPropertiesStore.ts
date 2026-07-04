import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SavedProperty {
  id: string;
  slug: string;
  title: string;
  savedAt: string;
}

interface SavedPropertiesState {
  savedProperties: SavedProperty[];
  addProperty: (property: Omit<SavedProperty, 'savedAt'>) => void;
  removeProperty: (propertyId: string) => void;
  isPropertySaved: (propertyId: string) => boolean;
  clearAll: () => void;
  getCount: () => number;
}

export const useSavedPropertiesStore = create<SavedPropertiesState>()(
  persist(
    (set, get) => ({
      savedProperties: [],

      addProperty: (property) => {
        set((state) => {
          // Check if already saved
          if (state.savedProperties.some((p) => p.id === property.id)) {
            return state;
          }
          return {
            savedProperties: [
              ...state.savedProperties,
              {
                ...property,
                savedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeProperty: (propertyId) => {
        set((state) => ({
          savedProperties: state.savedProperties.filter((p) => p.id !== propertyId),
        }));
      },

      isPropertySaved: (propertyId) => {
        return get().savedProperties.some((p) => p.id === propertyId);
      },

      clearAll: () => {
        set({ savedProperties: [] });
      },

      getCount: () => {
        return get().savedProperties.length;
      },
    }),
    {
      name: 'saved-properties',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ savedProperties: state.savedProperties }),
    }
  )
);

/**
 * Hook to check if a property is saved
 */
export function useIsPropertySaved(propertyId: string): boolean {
  return useSavedPropertiesStore((state) =>
    state.savedProperties.some((p) => p.id === propertyId)
  );
}

/**
 * Hook to get saved properties count
 */
export function useSavedPropertiesCount(): number {
  return useSavedPropertiesStore((state) => state.savedProperties.length);
}
