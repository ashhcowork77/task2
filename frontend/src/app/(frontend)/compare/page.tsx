'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PropertyCompare } from '@/components/PropertyCompare';
import type { Property } from '@/types';

// Mock data for demo
const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxury 3 BHK Villa in Whitefield',
    description: 'Spacious modern villa with private garden',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Whitefield' },
    locality: 'Whitefield',
    bedrooms: 3,
    bathrooms: 3,
    salePrice: 8500000,
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    amenities: ['pool', 'gym', 'parking', 'security', 'garden'],
    slug: 'villa-in-whitefield',
    status: 'published',
  },
  {
    id: 'prop-002',
    title: 'Modern 2 BHK Apartment Electronic City',
    description: 'Contemporary apartment near tech parks',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Electronic City' },
    locality: 'Electronic City',
    bedrooms: 2,
    bathrooms: 2,
    salePrice: 6200000,
    propertyType: 'apartment',
    furnishingStatus: 'semi_furnished',
    amenities: ['gym', 'pool', 'parking', 'clubhouse'],
    slug: 'apartment-in-electronic-city',
    status: 'published',
  },
  {
    id: 'prop-003',
    title: 'Premium 4 BHK Penthouse Indiranagar',
    description: 'Stunning penthouse with city views',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Indiranagar' },
    locality: 'Indiranagar',
    bedrooms: 4,
    bathrooms: 4,
    salePrice: 12000000,
    propertyType: 'apartment',
    furnishingStatus: 'furnished',
    amenities: ['terrace', 'gym', 'security', 'servant quarters'],
    slug: 'penthouse-in-indiranagar',
    status: 'published',
  },
];

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoadingState />}>
      <CompareContent />
    </Suspense>
  );
}

function CompareLoadingState() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg border border-gray-200 bg-gray-100" />
            <div>
              <div className="h-8 w-48 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-32 rounded bg-gray-200" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    </main>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const propertyIds = searchParams.get('properties')?.split(',') || [];

  // Filter mock properties based on IDs, or show all if no IDs
  const propertiesToCompare = propertyIds.length > 0
    ? MOCK_PROPERTIES.filter((p) => propertyIds.includes(p.id))
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/properties"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compare Properties</h1>
              <p className="text-sm text-gray-500">
                {propertiesToCompare.length > 0
                  ? `Comparing ${propertiesToCompare.length} properties`
                  : 'Select properties to compare'}
              </p>
            </div>
          </div>
        </div>

        {/* Compare Component */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <PropertyCompare properties={propertiesToCompare} />
        </div>

        {/* Empty State */}
        {propertiesToCompare.length === 0 && (
          <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Scale className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-gray-900">No properties selected</h3>
            <p className="mt-2 max-w-md mx-auto text-gray-500">
              Add properties to compare from the property listing page or your saved properties.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/saved"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Saved Properties
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="font-semibold text-gray-900">Comparison Tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
              Highlighted rows indicate the best value for that metric
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
              Compare properties with similar BHK types for accurate comparison
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
              Consider location, amenities, and future development plans
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
