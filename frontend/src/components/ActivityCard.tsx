import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import type { Activity } from '@/lib/data/activities';

interface ActivityCardProps {
  activity: Activity;
  priority?: boolean;
}

export function ActivityCard({ activity, priority = false }: ActivityCardProps) {
  const { slug, title, shortDescription, duration, groupSize, price, currency = 'INR', featuredImage } = activity;
  const href = `/activities/${slug || activity.id}`;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
  const groupSizeText = groupSize?.minGuests && groupSize?.maxGuests
    ? `${groupSize.minGuests}-${groupSize.maxGuests} guests`
    : groupSize?.maxGuests
      ? `Up to ${groupSize.maxGuests} guests`
      : null;

  return (
    <article className="group bg-white">
      {featuredImage?.url && (
        <Link href={href} className="relative block aspect-square overflow-hidden bg-neutral-200">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
        </Link>
      )}

      <div className="p-6">
        <Link href={href} className="transition-colors hover:text-[#A1834C]">
          <h3 className="text-2xl font-medium leading-tight tracking-tight text-[#141414]">
            {title}
          </h3>
        </Link>

        {shortDescription && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#6f6f6f]">
            {shortDescription}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-4 border-t border-black/10 pt-4 text-[11px] font-semibold text-[#141414]">
          {duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#A5A5A5]" />
              {duration}
            </span>
          )}
          {groupSizeText && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#A5A5A5]" />
              {groupSizeText}
            </span>
          )}
          <span>{formattedPrice} / person</span>
        </div>
      </div>
    </article>
  );
}
