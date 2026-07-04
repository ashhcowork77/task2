'use client';

import { useSavedPropertiesStore } from '@/lib/stores/savedPropertiesStore';
import { Heart, Trash2, MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SavedPropertiesList() {
  const { savedProperties, removeProperty, clearAll } = useSavedPropertiesStore();

  if (savedProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Heart className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="mt-6 text-xl font-medium text-gray-900">No saved properties yet</h3>
        <p className="mt-2 max-w-md text-gray-500">
          When you find a property you like, click the heart icon to save it here for easy access later.
        </p>
        <Link
          href="/properties"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          <MapPin className="h-4 w-4" />
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="font-medium text-gray-900">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearAll}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
          <Link
            href="/properties"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <MapPin className="h-4 w-4" />
            Add More
          </Link>
        </div>
      </div>

      {/* Saved Properties Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedProperties.map((property, index) => (
          <div
            key={property.id}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg"
          >
            {/* Property Image Placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="flex h-full items-center justify-center">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Property Info */}
            <div className="p-5">
              <Link href={`/properties/${property.slug}`} className="block">
                <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {property.title}
                </h3>
              </Link>

              <p className="mt-2 text-sm text-gray-500">
                Saved on {new Date(property.savedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/properties/${property.slug}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Details
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => removeProperty(property.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Section */}
      {savedProperties.length >= 2 && savedProperties.length <= 4 && (
        <div className="flex items-center justify-center rounded-xl bg-blue-50 p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Ready to compare?</p>
              <p className="text-sm text-gray-500">
                Compare {savedProperties.length} saved properties side by side
              </p>
            </div>
            <Link
              href={`/compare?properties=${savedProperties.map((p) => p.id).join(',')}`}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
