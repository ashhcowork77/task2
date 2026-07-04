import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapSkeletonProps {
  height?: string;
  className?: string;
}

/**
 * Loading skeleton for map placeholder
 * Shows while map is loading
 */
export function MapSkeleton({ height = 'h-[500px]', className = '' }: MapSkeletonProps) {
  return (
    <div className={cn('relative bg-gray-100 rounded-lg overflow-hidden', height, className)}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />

      {/* Centered placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>

      {/* Grid overlay for visual texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ccc 1px, transparent 1px),
            linear-gradient(to bottom, #ccc 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
