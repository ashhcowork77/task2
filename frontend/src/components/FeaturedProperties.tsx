import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Property } from '@/types';
import { PropertyCard } from './PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
  className?: string;
}

/**
 * Featured properties grid section for home page
 * Server Component - receives pre-fetched properties
 */
export function FeaturedProperties({ properties, className }: FeaturedPropertiesProps) {
  if (properties.length === 0) {
    return (
      <section className={className}>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Properties</h2>
            <p className="text-gray-500">No properties available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 mt-1">Handpicked properties for your stay</p>
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={index < 3}
            />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Properties
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
