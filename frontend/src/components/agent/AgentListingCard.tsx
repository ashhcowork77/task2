import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Bath, Bed, MapPin, Ruler, ShieldCheck } from 'lucide-react';
import type { Property } from '@/types';
import { getStableImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';

interface AgentListingCardProps {
  property: Property;
  priority?: boolean;
  className?: string;
}

export function AgentListingCard({ property, priority = false, className }: AgentListingCardProps) {
  const href = `/agents/listings/${property.slug || property.id}`;
  const imageUrl = getStableImageUrl(property.featuredImage?.url, property.title);
  const location = [property.locality || property.address?.locality, property.address?.city]
    .filter(Boolean)
    .join(', ');
  const area = property.area?.builtUpSqFt || property.area?.carpetSqFt || property.area?.plotSqFt;

  return (
    <article className={cn('group bg-white ring-1 ring-black/5', className)}>
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
          <Image
            src={imageUrl}
            alt={property.featuredImage?.alt || property.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="bg-white/92 px-3 py-2 text-[11px] font-semibold uppercase text-[#141414] backdrop-blur-md">
              {formatIntent(property)}
            </span>
            {property.listingStatus && (
              <span className="bg-[#0F766E] px-3 py-2 text-[11px] font-semibold uppercase text-white">
                {property.listingStatus.replace(/_/g, ' ')}
              </span>
            )}
          </div>
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-white text-[#141414]">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <Link href={href} className="transition-colors hover:text-[#0F766E]">
              <h3 className="text-2xl font-medium leading-tight tracking-tight text-[#141414]">
                {property.title}
              </h3>
            </Link>
            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#6f6f6f]">
                <MapPin className="h-4 w-4 text-[#0F766E]" />
                {location}
              </p>
            )}
          </div>
          <p className="shrink-0 text-right text-xl font-medium text-[#141414]">
            {formatListingPrice(property)}
          </p>
        </div>

        {property.shortDescription && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6f6f6f]">
            {property.shortDescription}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/10 pt-4 text-[12px] font-semibold text-[#141414] sm:grid-cols-4">
          <Fact icon={Bed} value={property.bedrooms ? `${property.bedrooms} beds` : undefined} />
          <Fact icon={Bath} value={property.bathrooms ? `${property.bathrooms} baths` : undefined} />
          <Fact icon={Ruler} value={area ? `${area.toLocaleString('en-IN')} sq ft` : undefined} />
          <Fact icon={ShieldCheck} value={property.reraId ? 'Verified' : 'Listed'} />
        </div>
      </div>
    </article>
  );
}

export function formatListingPrice(property: Property) {
  if (property.priceLabel) return property.priceLabel;

  if (property.salePrice) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(property.salePrice);
  }

  if (property.monthlyRent) {
    return `${new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(property.monthlyRent)} / mo`;
  }

  return 'Price on request';
}

function formatIntent(property: Property) {
  if (property.listingIntent === 'rent') return 'For rent';
  if (property.listingIntent === 'sale') return 'For sale';
  if (property.listingIntent === 'sale_or_rent') return 'Sale or rent';
  return 'Listing';
}

function Fact({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value?: string;
}) {
  if (!value) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-[#0F766E]" />
      {value}
    </span>
  );
}

