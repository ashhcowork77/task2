'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star } from 'lucide-react';
import { POICategoryFilter } from './POICategoryFilter';
import type { POICategory, POIResult } from '@/lib/poi/types';
import { cn } from '@/lib/utils';

interface POIOverlayProps {
  propertyId: string;
  lat: number;
  lng: number;
  className?: string;
}

// Mock data for demo - in production, this comes from getPOIs()
const MOCK_POIS: Record<POICategory, POIResult[]> = {
  restaurant: [
    {
      name: 'Truffles',
      address: 'Koramangala, Bangalore',
      location: { lat: 12.9352, lng: 77.6245 },
      rating: 4.5,
      types: ['restaurant', 'cafe'],
    },
    {
      name: 'Empire Restaurant',
      address: 'Indiranagar, Bangalore',
      location: { lat: 12.9716, lng: 77.6406 },
      rating: 4.2,
      types: ['restaurant'],
    },
  ],
  bar: [
    {
      name: 'Toit Brewpub',
      address: 'Indiranagar, Bangalore',
      location: { lat: 12.9716, lng: 77.638 },
      rating: 4.4,
      types: ['bar', 'pub'],
    },
  ],
  park: [
    {
      name: 'Cubbon Park',
      address: 'Bangalore City',
      location: { lat: 12.9755, lng: 77.5918 },
      rating: 4.6,
      types: ['park'],
    },
  ],
  beach: [
    {
      name: 'Marine Beach',
      address: 'Marina Beach, Chennai',
      location: { lat: 13.1067, lng: 80.292 },
      rating: 4.3,
      types: ['natural_feature', 'beach'],
    },
  ],
};

export function POIOverlay({
  propertyId,
  lat,
  lng,
  className,
}: POIOverlayProps) {
  const [activeCategories, setActiveCategories] = useState<POICategory[]>(['restaurant']);
  const [pois, setPOIs] = useState<Record<POICategory, POIResult[]>>(MOCK_POIS);
  const [isLoading, setIsLoading] = useState(false);

  // In production, fetch POIs from API:
  // useEffect(() => {
  //   async function fetchPOIs() {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(`/api/properties/${propertyId}/pois`);
  //       const data = await response.json();
  //       setPOIs(data);
  //     } catch (error) {
  //       console.error('Failed to fetch POIs:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchPOIs();
  // }, [propertyId]);

  const toggleCategory = (category: POICategory) => {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const counts = Object.fromEntries(
    Object.entries(pois).map(([key, value]) => [key, value.length])
  ) as Record<POICategory, number>;

  const visiblePOIs = activeCategories.flatMap((category) =>
    pois[category].map((poi, index) => ({ ...poi, category, key: `${category}-${index}` }))
  );

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Nearby Places</h3>
        <span className="text-sm text-gray-500">
          {activeCategories.length} categories
        </span>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <POICategoryFilter
          activeCategories={activeCategories}
          onToggle={toggleCategory}
          counts={counts}
        />
      </div>

      {/* POI List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : visiblePOIs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No places found in selected categories
          </div>
        ) : (
          visiblePOIs.map((poi) => <POIItem key={poi.key} poi={poi} />)
        )}
      </div>
    </div>
  );
}

function POIItem({ poi }: { poi: POIResult }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <MapPin className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{poi.name}</h4>
        <p className="text-sm text-gray-500 truncate">{poi.address}</p>
        <div className="flex items-center gap-3 mt-1">
          {poi.rating && (
            <span className="flex items-center gap-1 text-sm text-amber-600">
              <Star className="w-3 h-3 fill-current" />
              {poi.rating.toFixed(1)}
            </span>
          )}
          {poi.types?.[0] && (
            <span className="text-xs text-gray-400 capitalize">
              {poi.types[0].replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
