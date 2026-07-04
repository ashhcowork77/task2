import { cn } from '@/lib/utils';

interface PropertyCardSkeletonProps {
  className?: string;
}

/**
 * Loading skeleton for PropertyCard
 * Matches the layout of PropertyCard for consistent loading states
 */
export function PropertyCardSkeleton({ className }: PropertyCardSkeletonProps) {
  return (
    <article className={cn('border rounded-lg overflow-hidden bg-white', className)}>
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse">
        {/* BHK Badge Skeleton */}
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300 rounded-md animate-pulse" />
        {/* Rating Badge Skeleton */}
        <div className="absolute top-3 right-3 w-14 h-6 bg-gray-300 rounded-md animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />

        {/* Location Skeleton */}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>

        {/* Description Skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>

        {/* Price Skeleton */}
        <div className="mt-4 flex items-baseline gap-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-14" />
        </div>

        {/* Amenities Skeleton */}
        <div className="mt-3 flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
}
