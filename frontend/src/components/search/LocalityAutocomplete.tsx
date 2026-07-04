'use client';

import { MapPin } from 'lucide-react';
import { useFilterStore } from '@/lib/stores/filterStore';
import { cn } from '@/lib/utils';

/**
 * Locality/neighborhood search input
 */
export function LocalityAutocomplete() {
  const { locality, setLocality } = useFilterStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocality(value || null);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="locality-input"
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        <MapPin className="w-4 h-4" />
        Locality / Neighborhood
      </label>
      <input
        id="locality-input"
        type="text"
        value={locality ?? ''}
        onChange={handleChange}
        placeholder="e.g., Koramangala, Whitefield"
        className={cn(
          'w-full px-3 py-2 border rounded-md text-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'placeholder:text-gray-400'
        )}
      />
    </div>
  );
}
