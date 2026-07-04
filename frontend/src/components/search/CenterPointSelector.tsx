'use client';

import { useState } from 'react';
import { MapPin, Crosshair, Locate } from 'lucide-react';
import { useFilterStore } from '@/lib/stores/filterStore';
import { cn } from '@/lib/utils';

interface CenterPointSelectorProps {
  className?: string;
}

// Default center: Bangalore, India
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export function CenterPointSelector({ className }: CenterPointSelectorProps) {
  const { centerLat, centerLng, setCenter, clearCenter } = useFilterStore();
  const [inputValue, setInputValue] = useState('');

  const isSet = centerLat !== null && centerLng !== null;

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enter coordinates manually.');
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse "lat, lng" format
    const parts = inputValue.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [lat, lng] = parts;
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setCenter(lat, lng);
        setInputValue('');
        return;
      }
    }

    alert(
      'Please enter valid coordinates in format: latitude, longitude\nExample: 12.9716, 77.5946'
    );
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Search Center</span>
      </div>

      {/* Current center display */}
      {isSet && (
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Crosshair className="w-4 h-4" />
            <span>
              {centerLat!.toFixed(4)}, {centerLng!.toFixed(4)}
            </span>
          </div>
          <button
            onClick={clearCenter}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Change
          </button>
        </div>
      )}

      {/* Coordinate input */}
      {!isSet && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="12.9716, 77.5946"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Set
          </button>
        </form>
      )}

      {/* Geolocation button */}
      {!isSet && (
        <button
          onClick={handleGeolocate}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Locate className="w-4 h-4" />
          <span>Use my current location</span>
        </button>
      )}
    </div>
  );
}
