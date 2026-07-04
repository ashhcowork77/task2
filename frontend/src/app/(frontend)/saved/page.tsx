import { Metadata } from 'next';
import { Heart, Trash2, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PropertyCard } from '@/components/PropertyCard';
import { SavedPropertiesList } from '@/components/SavedPropertiesList';
import type { Property } from '@/types';

export const metadata: Metadata = {
  title: 'Saved Properties | Real Estate Agent',
  description: 'View and manage your saved properties',
};

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
              <p className="mt-1 text-gray-500">Properties you&apos;ve saved for later</p>
            </div>
          </div>
        </div>

        {/* Saved Properties List Component (Client Component) */}
        <SavedPropertiesList />
      </div>
    </main>
  );
}
