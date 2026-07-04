import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Bath, Bed, CalendarClock, CheckCircle2, MapPin, Phone, Ruler, ShieldCheck } from 'lucide-react';
import { AgentLeadForm } from '@/components/agent/AgentLeadForm';
import { formatListingPrice } from '@/components/agent/AgentListingCard';
import { PropertyGallery } from '@/components/PropertyGallery';
import { Reveal } from '@/components/Reveal';
import { getAgentListingBySlug } from '@/lib/data/properties';
import { getStableImageUrl } from '@/lib/media';
import type { Property } from '@/types';

interface AgentListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

type GalleryImage = { url: string; alt?: string };

export async function generateMetadata({ params }: AgentListingPageProps) {
  const { id } = await params;
  const property = await getAgentListingBySlug(id);

  if (!property) return { title: 'Listing Not Found' };

  return {
    title: `${property.title} | Northline Realty`,
    description: property.shortDescription || property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.shortDescription || property.description.slice(0, 160),
      images: property.featuredImage ? [property.featuredImage.url] : [],
    },
  };
}

export default async function AgentListingPage({ params }: AgentListingPageProps) {
  const { id } = await params;
  const property = await getAgentListingBySlug(id);

  if (!property) notFound();

  const images = getGalleryImages(property);
  const heroImage = images[0];
  const location = [property.locality || property.address?.locality, property.address?.city, property.address?.state]
    .filter(Boolean)
    .join(', ');
  const area = property.area?.builtUpSqFt || property.area?.carpetSqFt || property.area?.plotSqFt;

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-[#141414]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-32 md:grid-cols-12 md:px-10 md:pb-24 md:pt-40">
        <Reveal className="md:col-span-5">
          <p className="text-[12px] font-bold uppercase text-[#0F766E]">
            {property.listingIntent === 'rent' ? 'Rental listing' : 'Sale listing'}
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
            {property.title}
          </h1>
          {location && (
            <p className="mt-6 flex items-center gap-2 text-base text-[#5f6460]">
              <MapPin className="h-4 w-4 text-[#0F766E]" />
              {location}
            </p>
          )}
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f6460]">
            {property.shortDescription || property.description}
          </p>
          <p className="mt-8 text-4xl font-medium tracking-tight">{formatListingPrice(property)}</p>
        </Reveal>

        <Reveal delay={140} className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200 md:aspect-[1.1/1]">
            <Image
              src={heroImage.url}
              alt={heroImage.alt || property.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
              unoptimized
            />
            <div className="absolute bottom-5 left-5 bg-white/92 px-4 py-3 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase text-[#6f6f6f]">Lead route</p>
              <p className="text-sm font-semibold">{property.leadRouting?.responseSla || 'Call-back scheduled after enquiry'}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-32">
        <div className="space-y-10 md:col-span-7">
          <Reveal as="section" className="grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Bed} label="Bedrooms" value={property.bedrooms ? String(property.bedrooms) : 'Site'} />
            <Stat icon={Bath} label="Baths" value={property.bathrooms ? String(property.bathrooms) : 'NA'} />
            <Stat icon={Ruler} label="Area" value={area ? `${area.toLocaleString('en-IN')} sq ft` : 'On request'} />
            <Stat icon={ShieldCheck} label="Status" value={property.listingStatus?.replace(/_/g, ' ') || 'Available'} />
          </Reveal>

          <Reveal as="section" className="border-t border-black/10 pt-10">
            <div className="grid gap-6 md:grid-cols-12">
              <h2 className="text-3xl font-medium tracking-tight md:col-span-5 md:text-5xl">
                The details buyers ask before booking a visit.
              </h2>
              <div className="space-y-5 text-base leading-8 text-[#5f6460] md:col-span-7">
                <p>{property.description}</p>
                {property.reraId && <p>Disclosure ID: {property.reraId}</p>}
              </div>
            </div>
          </Reveal>

          {property.propertyHighlights && property.propertyHighlights.length > 0 && (
            <Reveal as="section" className="border-t border-black/10 pt-10">
              <p className="text-[12px] font-bold uppercase text-[#0F766E]">Why it is on the shortlist</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {property.propertyHighlights.map((highlight) => (
                  <div key={highlight.title} className="bg-white p-6 ring-1 ring-black/5">
                    <CheckCircle2 className="h-5 w-5 text-[#0F766E]" />
                    <h3 className="mt-4 text-xl font-medium tracking-tight">{highlight.title}</h3>
                    {highlight.detail && <p className="mt-2 text-sm leading-6 text-[#6f6f6f]">{highlight.detail}</p>}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal as="section" id="gallery" className="border-t border-black/10 pt-10">
            <p className="text-[12px] font-bold uppercase text-[#0F766E]">Gallery</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">Inspect before you schedule</h2>
            <div className="mt-6">
              <PropertyGallery images={images} title={property.title} />
            </div>
          </Reveal>
        </div>

        <aside id="request" className="md:col-span-5 lg:col-span-4 lg:col-start-9">
          <div className="sticky top-24 space-y-4">
            <AgentLeadForm
              eyebrow="Listing enquiry"
              title="Schedule a private visit"
              submitLabel="Request visit slot"
              propertyId={String(property.id)}
              propertyTitle={property.title}
              defaultIntent={property.listingIntent === 'rent' ? 'rental_inquiry' : 'schedule_visit'}
              defaultLocality={property.locality || property.address?.locality || ''}
              compact
            />
            <div className="bg-white p-6 ring-1 ring-black/5">
              <p className="text-[12px] font-bold uppercase text-[#6f6f6f]">Assigned agent</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">{property.agent?.name || 'Northline Realty Desk'}</h3>
              <p className="mt-1 text-sm text-[#6f6f6f]">{property.agent?.role || 'Listing team'}</p>
              {property.agent?.bio && <p className="mt-4 text-sm leading-6 text-[#6f6f6f]">{property.agent.bio}</p>}
              <a href={`tel:${property.agent?.phone || '+918045677881'}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase text-[#0F766E]">
                <Phone className="h-4 w-4" />
                Call listing desk
              </a>
            </div>
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 backdrop-blur-md md:hidden">
        <a href="#request" className="flex items-center justify-between bg-[#141414] px-5 py-4 text-white">
          <span className="text-sm font-semibold uppercase">Request visit</span>
          <span className="text-sm">{formatListingPrice(property)}</span>
        </a>
      </div>
    </main>
  );
}

function getGalleryImages(property: Property): GalleryImage[] {
  const featured = property.featuredImage?.url
    ? [{
        ...property.featuredImage,
        url: getStableImageUrl(property.featuredImage.url, property.title),
      }]
    : [];

  const gallery = (property.gallery || [])
    .filter((image) => image?.url)
    .map((image) => ({
      ...image,
      url: getStableImageUrl(image.url, property.title),
    }));

  const deduped = [...featured, ...gallery].filter((image, index, all) => (
    all.findIndex((candidate) => candidate.url === image.url) === index
  ));

  return deduped.length > 0 ? deduped : [{
    url: getStableImageUrl(null, property.title),
    alt: property.title,
  }];
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5 ring-1 ring-black/5">
      <Icon className="mb-4 h-5 w-5 text-[#0F766E]" />
      <p className="text-[11px] font-bold uppercase text-[#7b807d]">{label}</p>
      <p className="mt-1 text-lg font-medium capitalize">{value}</p>
    </div>
  );
}
