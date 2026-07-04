import { Metadata } from 'next';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { getPublishedProperties } from '@/lib/data/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { Reveal } from '@/components/Reveal';

interface PropertiesPageProps {
  searchParams: Promise<{
    location?: string;
    guests?: string;
    page?: string;
  }>;
}

export async function generateMetadata({}: PropertiesPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notjustastay.com';
  return {
    title: 'Private Villas in North Goa | Not Just A Stay',
    description:
      'Browse hosted private villas across Assagao, Anjuna and Vagator with pools, local experiences and direct stay requests.',
    openGraph: {
      title: 'Private Villas in North Goa | Not Just A Stay',
      type: 'website',
      url: `${baseUrl}/properties`,
    },
  };
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const { location, guests, page } = await searchParams;
  const result = await getPublishedProperties({ limit: 20, page: Number(page) || 1 });
  const properties = result.docs;

  return (
    <main className="min-h-screen bg-[#F8F8F8] text-[#141414]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-32 md:grid-cols-12 md:px-10 md:pb-28 md:pt-40">
        <Reveal className="md:col-span-7">
          <p className="mb-5 text-[12px] font-semibold uppercase text-[#A1834C]">Hosted private villas</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            Find the North Goa stay your group can settle into.
          </h1>
        </Reveal>
        <Reveal delay={150} className="space-y-6 md:col-span-4 md:col-start-9 md:pt-14">
          <p className="text-lg leading-8 text-[#6f6f6f]">
            Browse a compact collection of private villas with hosted arrival, pools, flexible stays and curated local experiences.
          </p>
          <div className="grid grid-cols-3 border-y border-black/10 py-5 text-sm">
            <div>
              <p className="text-2xl font-medium">{result.totalDocs}</p>
              <p className="mt-1 text-[#8b8b8b]">Villas</p>
            </div>
            <div>
              <p className="text-2xl font-medium">3</p>
              <p className="mt-1 text-[#8b8b8b]">Locations</p>
            </div>
            <div>
              <p className="text-2xl font-medium">24 hr</p>
              <p className="mt-1 text-[#8b8b8b]">Host care</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-black/10 bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 text-sm text-[#6f6f6f]">
          <span className="inline-flex items-center gap-2 bg-[#F8F8F8] px-4 py-2">
            <MapPin className="h-4 w-4 text-[#A1834C]" />
            {location || 'North Goa'}
          </span>
          <span className="inline-flex items-center gap-2 bg-[#F8F8F8] px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#A1834C]" />
            Pool villas
          </span>
          <span className="inline-flex items-center gap-2 bg-[#F8F8F8] px-4 py-2">
            <CalendarDays className="h-4 w-4 text-[#A1834C]" />
            {guests ? `${guests} guests` : 'Flexible dates'}
          </span>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <Reveal className="mb-12 grid gap-5 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <p className="text-[12px] font-semibold uppercase text-[#A1834C]">Collection</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
              Villas ready for direct stay requests.
            </h2>
          </div>
          <p className="text-sm leading-7 text-[#6f6f6f] md:col-span-4 md:col-start-9">
            Each listing keeps the practical details close to the image: location, nightly rate, guest capacity and the fastest path to enquire.
          </p>
        </Reveal>

        {properties.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center">
            <h3 className="text-2xl font-medium tracking-tight">No villas found</h3>
            <p className="mt-3 text-[#6f6f6f]">Try a different location or speak with the host team.</p>
          </div>
        )}

        {result.totalPages > 1 && (
          <Pagination currentPage={result.page} totalPages={result.totalPages} />
        )}
      </section>
    </main>
  );
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <nav className="mt-10 flex justify-center gap-3" aria-label="Pagination">
      {currentPage > 1 && (
        <a href={`?page=${currentPage - 1}`} className="border border-black/10 px-5 py-3 text-sm font-semibold uppercase hover:bg-white">
          Previous
        </a>
      )}
      <span className="px-5 py-3 text-sm text-[#6f6f6f]">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <a href={`?page=${currentPage + 1}`} className="border border-black/10 px-5 py-3 text-sm font-semibold uppercase hover:bg-white">
          Next
        </a>
      )}
    </nav>
  );
}
