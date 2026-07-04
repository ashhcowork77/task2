'use client';

import { MapPin, Navigation } from 'lucide-react';
import { useFilterStore } from '@/lib/stores/filterStore';
import { cn } from '@/lib/utils';

interface RadiusSelectorProps {
  className?: string;
}

const RADIUS_OPTIONS = [
  { value: 1, label: '1 km', description: 'Walking distance' },
  { value: 2, label: '2 km', description: 'Short drive' },
  { value: 5, label: '5 km', description: 'Neighborhood' },
  { value: 10, label: '10 km', description: 'City area' },
  { value: 25, label: '25 km', description: 'Metro region' },
];

export function RadiusSelector({ className }: RadiusSelectorProps) {
  const { radius, setRadius, centerLat, centerLng } = useFilterStore();

  if (centerLat === null || centerLng === null) {
    return null; // No center point selected
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Search Radius</span>
        {radius !== null && (
          <span className="text-sm text-blue-600 font-medium">{radius} km</span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {RADIUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setRadius(option.value)}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg border transition-all',
              radius === option.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
            )}
            title={option.description}
          >
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Clear radius button */}
      {radius !== null && (
        <button
          onClick={() => setRadius(null)}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear radius filter
        </button>
      )}
    </div>
  );
}
