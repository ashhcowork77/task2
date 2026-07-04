import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CompareProperty {
  id: string;
  slug: string;
  title: string;
  addedAt: string;
}

interface CompareState {
  compareList: CompareProperty[];
  addProperty: (property: Omit<CompareProperty, 'addedAt'>) => boolean;
  removeProperty: (propertyId: string) => void;
  isPropertyInCompare: (propertyId: string) => boolean;
  clearAll: () => void;
  getCount: () => number;
  canAddMore: () => boolean;
}

const MAX_COMPARE_ITEMS = 3;

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareList: [],

      addProperty: (property) => {
        const state = get();

        // Check if already in compare list
        if (state.compareList.some((p) => p.id === property.id)) {
          return false;
        }

        // Check max limit
        if (state.compareList.length >= MAX_COMPARE_ITEMS) {
          return false;
        }

        set((state) => ({
          compareList: [
            ...state.compareList,
            {
              ...property,
              addedAt: new Date().toISOString(),
            },
          ],
        }));

        return true;
      },

      removeProperty: (propertyId) => {
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== propertyId),
        }));
      },

      isPropertyInCompare: (propertyId) => {
        return get().compareList.some((p) => p.id === propertyId);
      },

      clearAll: () => {
        set({ compareList: [] });
      },

      getCount: () => {
        return get().compareList.length;
      },

      canAddMore: () => {
        return get().compareList.length < MAX_COMPARE_ITEMS;
      },
    }),
    {
      name: 'compare-properties',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ compareList: state.compareList }),
    }
  )
);

/**
 * Hook to check if a property is in compare list
 */
export function useIsPropertyInCompare(propertyId: string): boolean {
  return useCompareStore((state) =>
    state.compareList.some((p) => p.id === propertyId)
  );
}

/**
 * Hook to get compare list count
 */
export function useCompareCount(): number {
  return useCompareStore((state) => state.compareList.length);
}
