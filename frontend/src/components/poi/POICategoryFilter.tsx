'use client';

import { Utensils, Wine, Trees, Umbrella } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { POICategory } from '@/lib/poi/types';

interface POICategoryFilterProps {
  activeCategories: POICategory[];
  onToggle: (category: POICategory) => void;
  counts?: Record<POICategory, number>;
}

const CATEGORY_CONFIG: Record<POICategory, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}> = {
  restaurant: { icon: Utensils, label: 'Food', color: 'text-orange-600' },
  bar: { icon: Wine, label: 'Nightlife', color: 'text-purple-600' },
  park: { icon: Trees, label: 'Parks', color: 'text-green-600' },
  beach: { icon: Umbrella, label: 'Beaches', color: 'text-blue-600' },
};

export function POICategoryFilter({
  activeCategories,
  onToggle,
  counts,
}: POICategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(CATEGORY_CONFIG) as POICategory[]).map((category) => {
        const config = CATEGORY_CONFIG[category];
        const Icon = config.icon;
        const isActive = activeCategories.includes(category);
        const count = counts?.[category];

        return (
          <button
            key={category}
            onClick={() => onToggle(category)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-white' : config.color)} />
            <span>{config.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  isActive ? 'bg-blue-500' : 'bg-gray-200'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
