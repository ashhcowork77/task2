import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { MapPin, Home, Building2, TrendingUp } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { LocalityPageHeader } from '@/components/LocalityPageHeader';
import type { Property } from '@/types';

// Mock data - in production this would fetch from Payload CMS
const MOCK_LOCALITIES: Record<string, {
  name: string;
  city: string;
  description: string;
  stats: {
    properties: number;
    avgPrice: string;
    trending: string;
  };
}> = {
  'whitefield': {
    name: 'Whitefield',
    city: 'Bangalore',
    description: 'A bustling IT hub with excellent connectivity, modern infrastructure, and premium residential options. Home to major tech parks and multinational corporations.',
    stats: {
      properties: 245,
      avgPrice: '₹85L',
      trending: 'Rising',
    },
  },
  'electronic-city': {
    name: 'Electronic City',
    city: 'Bangalore',
    description: 'Bangalore\'s premier IT destination with world-class infrastructure, hosting major tech companies and offering excellent residential options for professionals.',
    stats: {
      properties: 189,
      avgPrice: '₹62L',
      trending: 'Stable',
    },
  },
  'hsr-layout': {
    name: 'HSR Layout',
    city: 'Bangalore',
    description: 'A well-planned residential area with excellent amenities, popular restaurants, and proximity to IT hubs. Known for its tree-lined streets and community feel.',
    stats: {
      properties: 156,
      avgPrice: '₹78L',
      trending: 'Rising',
    },
  },
  'indiranagar': {
    name: 'Indiranagar',
    city: 'Bangalore',
    description: 'A premium residential locality known for its vibrant lifestyle, upscale restaurants, boutique shops, and excellent connectivity to central Bangalore.',
    stats: {
      properties: 134,
      avgPrice: '₹1.2Cr',
      trending: 'High Demand',
    },
  },
  'koramangala': {
    name: 'Koramangala',
    city: 'Bangalore',
    description: 'A sought-after residential and commercial hub with a perfect blend of urban conveniences, dining options, and proximity to business districts.',
    stats: {
      properties: 167,
      avgPrice: '₹1.1Cr',
      trending: 'Stable',
    },
  },
  'marathahalli': {
    name: 'Marathahalli',
    city: 'Bangalore',
    description: 'A major residential and commercial hub with excellent connectivity to ORR and IT hubs. Offers diverse housing options from apartments to villas.',
    stats: {
      properties: 198,
      avgPrice: '₹72L',
      trending: 'Rising',
    },
  },
  'sarjapur-road': {
    name: 'Sarjapur Road',
    city: 'Bangalore',
    description: 'A rapidly developing area with upcoming infrastructure, IT parks, and excellent residential projects. Perfect for those seeking modern homes at competitive prices.',
    stats: {
      properties: 212,
      avgPrice: '₹68L',
      trending: 'Growing',
    },
  },
  'yelahanka': {
    name: 'Yelahanka',
    city: 'Bangalore',
    description: 'A peaceful residential area with good schools, parks, and proximity to the airport. Offers spacious independent houses and modern apartments.',
    stats: {
      properties: 87,
      avgPrice: '₹55L',
      trending: 'Stable',
    },
  },
};

// Mock properties for locality
const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'Luxury 3 BHK Villa in Whitefield',
    description: 'Spacious modern villa with private garden, modular kitchen, and premium fixtures throughout.',
    shortDescription: 'Modern villa with private garden in Whitefield',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Whitefield' },
    locality: 'Whitefield',
    bedrooms: 3,
    bathrooms: 3,
    nightlyPrice: 850000,
    salePrice: 8500000,
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    amenities: ['pool', 'gym', 'parking', 'security', 'garden'],
    slug: 'villa-in-whitefield',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 'prop-002',
    title: 'Modern 2 BHK Apartment Electronic City',
    description: 'Contemporary 2 BHK apartment with premium amenities, perfect for IT professionals.',
    shortDescription: 'Contemporary apartment near major tech parks',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Electronic City' },
    locality: 'Electronic City',
    bedrooms: 2,
    bathrooms: 2,
    nightlyPrice: 620000,
    salePrice: 6200000,
    propertyType: 'apartment',
    furnishingStatus: 'semi_furnished',
    amenities: ['gym', 'pool', 'parking', 'clubhouse'],
    slug: 'apartment-in-electronic-city',
    status: 'published',
    createdAt: '2024-01-14',
  },
  {
    id: 'prop-003',
    title: 'Premium 4 BHK Penthouse Indiranagar',
    description: 'Stunning penthouse with panoramic city views, private terrace, and luxury finishes.',
    shortDescription: 'Penthouse with terrace and city views',
    address: { city: 'Bangalore', state: 'Karnataka', locality: 'Indiranagar' },
    locality: 'Indiranagar',
    bedrooms: 4,
    bathrooms: 4,
    nightlyPrice: 1200000,
    salePrice: 12000000,
    propertyType: 'apartment',
    furnishingStatus: 'furnished',
    amenities: ['terrace', 'gym', 'security', 'servant quarters'],
    slug: 'penthouse-in-indiranagar',
    status: 'published',
    createdAt: '2024-01-13',
  },
];

interface LocalityPageProps {
  params: Promise<{
    locality: string;
  }>;
}

export async function generateMetadata({ params }: LocalityPageProps): Promise<Metadata> {
  const { locality } = await params;
  const localityData = MOCK_LOCALITIES[locality];

  if (!localityData) {
    return { title: 'Locality Not Found' };
  }

  const title = `Properties in ${localityData.name}, ${localityData.city} | Find Your Dream Home`;
  const description = `Explore ${localityData.stats.properties} properties in ${localityData.name}, ${localityData.city}. ${localityData.description} Average price: ${localityData.stats.avgPrice}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function LocalityPage({ params }: LocalityPageProps) {
  const { locality } = await params;
  const localityData = MOCK_LOCALITIES[locality];

  if (!localityData) {
    notFound();
  }

  // Filter properties for this locality
  const properties = MOCK_PROPERTIES.filter(
    (p) => p.locality?.toLowerCase() === localityData.name.toLowerCase()
  );

  // If no specific properties, show all (for demo)
  const displayProperties = properties.length > 0 ? properties : MOCK_PROPERTIES;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <LocalityPageHeader
        locality={localityData.name}
        city={localityData.city}
        description={localityData.description}
        stats={localityData.stats}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10">
        {/* Section Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
              {displayProperties.length} Properties Found
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-gray-900">
              Properties in {localityData.name}
            </h2>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={index < 3}
            />
          ))}
        </div>

        {/* Empty State */}
        {displayProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">No properties yet</h3>
            <p className="mt-2 text-gray-500">
              We&apos;re working on adding more properties in {localityData.name}. Check back soon!
            </p>
          </div>
        )}

        {/* Locality Info */}
        <section className="mt-20 rounded-2xl bg-gray-50 p-8">
          <h3 className="text-2xl font-semibold text-gray-900">About {localityData.name}</h3>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            {localityData.description}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{localityData.stats.properties}+</p>
                <p className="text-sm text-gray-500">Properties Listed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{localityData.stats.avgPrice}</p>
                <p className="text-sm text-gray-500">Average Price</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{localityData.stats.trending}</p>
                <p className="text-sm text-gray-500">Market Status</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
