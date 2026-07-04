'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSavedPropertiesStore } from '@/lib/stores/savedPropertiesStore';

interface SavePropertyButtonProps {
  propertyId: string;
  propertySlug?: string;
  propertyTitle: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export function SavePropertyButton({
  propertyId,
  propertySlug,
  propertyTitle,
  size = 'md',
  showCount = false,
  className,
}: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addProperty, removeProperty, isPropertySaved } = useSavedPropertiesStore();

  useEffect(() => {
    setIsSaved(isPropertySaved(propertyId));
  }, [propertyId, isPropertySaved]);

  const handleToggle = () => {
    setIsAnimating(true);

    if (isSaved) {
      removeProperty(propertyId);
      setIsSaved(false);
    } else {
      addProperty({
        id: propertyId,
        slug: propertySlug || propertyId,
        title: propertyTitle,
      });
      setIsSaved(true);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'group relative flex items-center justify-center rounded-full transition-all',
        sizeClasses[size],
        isSaved
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-500 shadow-lg backdrop-blur-sm',
        isAnimating && 'scale-110',
        className
      )}
      aria-label={isSaved ? 'Remove from saved' : 'Save property'}
    >
      <Heart
        className={cn(
          'transition-transform',
          isSaved && 'fill-current',
          isAnimating && 'animate-pulse'
        )}
        size={iconSizes[size]}
      />

      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {isSaved ? 'Saved' : 'Save'}
      </span>
    </button>
  );
}
