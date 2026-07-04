'use client';

import { useState } from 'react';
import { X, Plus, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompareStore } from '@/lib/stores/compareStore';
import type { Property } from '@/types';

interface PropertyCompareProps {
  properties: Property[];
  className?: string;
}

interface CompareRow {
  label: string;
  key: string;
  format?: (value: unknown) => string;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: 'Price', key: 'salePrice' },
  { label: 'Property Type', key: 'propertyType' },
  { label: 'BHK Type', key: 'bhkType' },
  { label: 'Bedrooms', key: 'bedrooms' },
  { label: 'Bathrooms', key: 'bathrooms' },
  { label: 'Carpet Area', key: 'area.carpetSqFt', format: (v) => v ? `${v} sq.ft` : '-' },
  { label: 'Built-up Area', key: 'area.builtUpSqFt', format: (v) => v ? `${v} sq.ft` : '-' },
  { label: 'Furnishing', key: 'furnishingStatus' },
  { label: 'Facing', key: 'facing' },
  { label: 'Floor', key: 'floor' },
  { label: 'Possession', key: 'possessionStatus' },
  { label: 'RERA ID', key: 'reraId' },
  { label: 'Locality', key: 'locality' },
  { label: 'City', key: 'address.city' },
];

function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return result;
}

function formatValue(value: unknown, format?: (value: unknown) => string): string {
  if (value === undefined || value === null) return '-';
  if (format) return format(value);
  if (typeof value === 'string') return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  if (typeof value === 'number') return value.toLocaleString('en-IN');
  return String(value);
}

export function PropertyCompare({ properties, className }: PropertyCompareProps) {
  const { removeProperty, addProperty, isPropertyInCompare, compareList } = useCompareStore();
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const formatPrice = (value: number | undefined) => {
    if (!value) return '-';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const getRowHighlight = (key: string): 'best' | 'worst' | null => {
    if (properties.length < 2) return null;

    if (key === 'salePrice') {
      const prices = properties.map((p) => p.salePrice || p.nightlyPrice || 0);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return null;
      return 'best';
    }

    return null;
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <ArrowRight className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="mt-6 text-xl font-medium text-gray-900">No properties to compare</h3>
        <p className="mt-2 max-w-md text-gray-500">
          Add at least 2 properties to start comparing. Go to any property page and click &quot;Compare&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[800px]">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white p-4 text-left text-sm font-medium text-gray-500">
              Property
            </th>
            {properties.map((property) => (
              <th key={property.id} className="relative bg-white p-4 text-center">
                <button
                  onClick={() => removeProperty(property.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="space-y-3">
                  <div className="mx-auto h-32 w-32 overflow-hidden rounded-lg bg-gray-200">
                    {property.featuredImage?.url ? (
                      <img
                        src={property.featuredImage.url}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{property.title}</h3>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row, rowIndex) => {
            const highlight = getRowHighlight(row.key);

            return (
              <tr
                key={row.key}
                className={cn(
                  'border-t border-gray-100 transition-colors',
                  highlightedRow === rowIndex && 'bg-blue-50'
                )}
                onMouseEnter={() => setHighlightedRow(rowIndex)}
                onMouseLeave={() => setHighlightedRow(null)}
              >
                <td className="sticky left-0 bg-white p-4 text-sm font-medium text-gray-700">
                  {row.label}
                </td>
                {properties.map((property) => {
                  const value = getNestedValue(property, row.key);
                  const isBest = highlight === 'best' &&
                    row.key === 'salePrice' &&
                    value === Math.min(...properties.map((p) => {
                      const v = getNestedValue(p, row.key) as number;
                      return v || 0;
                    }));

                  return (
                    <td
                      key={property.id}
                      className={cn(
                        'p-4 text-center text-sm',
                        isBest && 'bg-green-50 text-green-700 font-medium'
                      )}
                    >
                      {row.key === 'salePrice' || row.key === 'nightlyPrice'
                        ? formatPrice(value as number)
                        : formatValue(value, row.format)}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Amenities Row */}
          <tr className="border-t border-gray-100">
            <td className="sticky left-0 bg-white p-4 text-sm font-medium text-gray-700">
              Amenities
            </td>
            {properties.map((property) => (
              <td key={property.id} className="p-4 text-center">
                <div className="flex flex-wrap justify-center gap-1">
                  {property.amenities?.slice(0, 5).map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {amenity.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {property.amenities && property.amenities.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{property.amenities.length - 5} more
                    </span>
                  )}
                  {!property.amenities?.length && '-'}
                </div>
              </td>
            ))}
          </tr>

          {/* Action Row */}
          <tr className="border-t border-gray-100">
            <td className="sticky left-0 bg-white p-4"></td>
            {properties.map((property) => (
              <td key={property.id} className="p-4 text-center">
                <a
                  href={`/properties/${property.slug || property.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
