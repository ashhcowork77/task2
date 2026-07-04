import Link from 'next/link';
import { Bath, Bed, MapPin, Maximize2, Users } from 'lucide-react';
import type { Property } from '@/types';
import { cn } from '@/lib/utils';
import { getStableImageUrl } from '@/lib/media';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  className?: string;
}

function formatPrice(value: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function hrefFor(property: Property) {
  return `/properties/${property.slug || property.id}`;
}

function Stat({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value?: string | number;
}) {
  if (!value) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#141414]">
      <Icon className="h-3.5 w-3.5 text-[#A5A5A5]" />
      {value}
    </span>
  );
}

export function PropertyCard({ property, priority = false, className }: PropertyCardProps) {
  const imageUrl = getStableImageUrl(property.featuredImage?.url, property.title);
  const location = [property.locality || property.address?.locality, property.address?.city]
    .filter(Boolean)
    .join(', ');

  return (
    <article className={cn('group bg-white', className)}>
      <Link href={hrefFor(property)} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={property.featuredImage?.alt || property.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-5 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase text-white/70">From</p>
              <p className="text-2xl font-medium">{formatPrice(property.nightlyPrice, property.currency)}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center bg-white/90 text-[#141414] backdrop-blur-md">
              <Maximize2 className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={hrefFor(property)} className="transition-colors hover:text-[#A1834C]">
              <h3 className="text-2xl font-medium leading-tight tracking-tight text-[#141414]">
                {property.title}
              </h3>
            </Link>
            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6f6f6f]">
                <MapPin className="h-4 w-4 text-[#A1834C]" />
                {location}
              </p>
            )}
          </div>
        </div>

        {property.shortDescription && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6f6f6f]">
            {property.shortDescription}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-black/10 pt-4">
          <Stat icon={Bed} value={property.bedrooms ? `${property.bedrooms} beds` : undefined} />
          <Stat icon={Bath} value={property.bathrooms ? `${property.bathrooms} baths` : undefined} />
          <Stat icon={Users} value={property.maxGuests ? `${property.maxGuests} guests` : undefined} />
        </div>
      </div>
    </article>
  );
}
