import Link from 'next/link';
import { ArrowRight, Building2, Filter, MapPin } from 'lucide-react';
import { AgentListingCard } from '@/components/agent/AgentListingCard';
import { AgentLeadForm } from '@/components/agent/AgentLeadForm';
import { Reveal } from '@/components/Reveal';
import { getAgentListings } from '@/lib/data/properties';

interface AgentListingsPageProps {
  searchParams: Promise<{
    page?: string;
    location?: string;
    intent?: string;
  }>;
}

export const metadata = {
  title: 'Verified Sale and Rent Listings | Northline Realty',
  description: 'Browse agent-managed sale and rent listings with visit requests, buyer matching and campaign-ready lead capture.',
};

export default async function AgentListingsPage({ searchParams }: AgentListingsPageProps) {
  const { page, location, intent } = await searchParams;
  const result = await getAgentListings({ limit: 20, page: Number(page) || 1 });
  const listings = result.docs;

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-[#141414]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-32 md:grid-cols-12 md:px-10 md:pb-20 md:pt-40">
        <Reveal className="md:col-span-7">
          <p className="text-[12px] font-bold uppercase text-[#0F766E]">Agent-managed inventory</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            Browse verified homes without losing the lead trail.
          </h1>
        </Reveal>
        <Reveal delay={140} className="space-y-6 md:col-span-4 md:col-start-9 md:pt-12">
          <p className="text-lg leading-8 text-[#5f6460]">
            Sale, rent and investment listings are structured for buyer qualification, source attribution and fast agent routing.
          </p>
          <div className="grid grid-cols-3 border-y border-black/10 py-5 text-sm">
            <div>
              <p className="text-2xl font-medium">{result.totalDocs}</p>
              <p className="mt-1 text-[#7b807d]">Listings</p>
            </div>
            <div>
              <p className="text-2xl font-medium">3</p>
              <p className="mt-1 text-[#7b807d]">Lead paths</p>
            </div>
            <div>
              <p className="text-2xl font-medium">15m</p>
              <p className="mt-1 text-[#7b807d]">SLA</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-black/10 bg-white px-5 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 text-sm text-[#5f6460]">
          <span className="inline-flex items-center gap-2 bg-[#F6F7F4] px-4 py-2">
            <MapPin className="h-4 w-4 text-[#0F766E]" />
            {location || 'Bengaluru'}
          </span>
          <span className="inline-flex items-center gap-2 bg-[#F6F7F4] px-4 py-2">
            <Building2 className="h-4 w-4 text-[#0F766E]" />
            {intent || 'Sale and rent'}
          </span>
          <span className="inline-flex items-center gap-2 bg-[#F6F7F4] px-4 py-2">
            <Filter className="h-4 w-4 text-[#0F766E]" />
            Verified inventory
          </span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <div className="md:col-span-8">
          <div className="grid gap-8 md:grid-cols-2">
            {listings.map((property, index) => (
              <Reveal key={property.id} delay={index * 100}>
                <AgentListingCard property={property} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="md:col-span-4">
          <div className="sticky top-24 space-y-5">
            <AgentLeadForm
              eyebrow="Buyer desk"
              title="Need a matched shortlist?"
              submitLabel="Build my shortlist"
              defaultIntent="buyer_match"
              defaultLocality={location || 'Bengaluru'}
              compact
            />
            <div className="bg-[#111827] p-6 text-white">
              <p className="text-[12px] font-bold uppercase text-emerald-200">For sellers</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">Want to know what your property can command?</h3>
              <Link href="/agents/sell" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase text-emerald-200">
                Get valuation route
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

