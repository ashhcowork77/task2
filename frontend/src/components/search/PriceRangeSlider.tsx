'use client';

import { useFilterStore } from '@/lib/stores/filterStore';
import { cn } from '@/lib/utils';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  currency?: string;
}

/**
 * Budget range input with min/max fields
 */
export function PriceRangeSlider({
  min = 0,
  max = 50000,
  step = 500,
  currency = '₹',
}: PriceRangeSliderProps) {
  const { priceMin, priceMax, setPriceMin, setPriceMax } = useFilterStore();

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceMin(value ? Number(value) : null);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceMax(value ? Number(value) : null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">
        Budget Range (per night)
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {currency}
          </span>
          <input
            type="number"
            value={priceMin ?? ''}
            onChange={handleMinChange}
            placeholder="Min"
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full pl-7 pr-3 py-2 border rounded-md text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            )}
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            {currency}
          </span>
          <input
            type="number"
            value={priceMax ?? ''}
            onChange={handleMaxChange}
            placeholder="Max"
            min={min}
            max={max}
            step={step}
            className={cn(
              'w-full pl-7 pr-3 py-2 border rounded-md text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            )}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {currency}
          {min.toLocaleString()}
        </span>
        <span>
          {currency}
          {max.toLocaleString()}+
        </span>
      </div>
    </div>
  );
}
