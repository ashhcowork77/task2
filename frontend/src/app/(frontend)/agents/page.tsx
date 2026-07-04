import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, Clock, LineChart, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import { AgentLeadForm } from '@/components/agent/AgentLeadForm';
import { AgentListingCard } from '@/components/agent/AgentListingCard';
import { Reveal } from '@/components/Reveal';
import { getFeaturedAgentListings } from '@/lib/data/properties';

const heroImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2400&q=85&auto=format&fit=crop';
const advisorImage = 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1600&q=85&auto=format&fit=crop';

const leadEngineItems = [
  {
    icon: MessageCircle,
    title: 'WhatsApp and call-ready routing',
    text: 'Each listing can store call tracking numbers, WhatsApp contacts and assigned agents.',
  },
  {
    icon: BarChart3,
    title: 'Campaign attribution fields',
    text: 'UTM source, campaign, landing page and referrer context travel with every lead.',
  },
  {
    icon: Clock,
    title: 'Qualification before callback',
    text: 'Budget, timeline, intent and locality help the team prioritize high-intent buyers and sellers.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust near the decision',
    text: 'Agent licence, RERA notes, verified inventory and response promises sit close to CTAs.',
  },
];

export const metadata = {
  title: 'Northline Realty | Agent Website and Lead Engine Demo',
  description:
    'A CMS-powered real estate agent website with listings, seller valuation, buyer lead capture, and campaign attribution.',
};

export default async function AgentsHomePage() {
  const listings = await getFeaturedAgentListings();

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-[#141414]">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src={heroImage}
          alt="Real estate agent showing a modern home"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 via-[#111827]/45 to-[#111827]/10" />
        <div className="relative z-10 grid min-h-screen items-center gap-10 px-5 pb-12 pt-28 md:grid-cols-12 md:px-10 md:pb-16 md:pt-28">
          <Reveal className="md:col-span-7">
            <p className="mb-5 text-[12px] font-bold uppercase text-emerald-200">Northline Realty demo</p>
            <h1 className="max-w-5xl text-5xl font-medium leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
              Verified homes, faster calls, cleaner lead follow-up.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              A broker-owned property website that lists inventory, qualifies buyers and sellers, and keeps campaign source data attached to every enquiry.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/agents/listings" className="inline-flex items-center gap-2 bg-white px-7 py-4 text-sm font-semibold uppercase text-[#141414] transition-colors hover:bg-emerald-200">
                <Search className="h-4 w-4" />
                Browse listings
              </Link>
              <Link href="/agents/sell" className="inline-flex items-center gap-2 border border-white/35 px-7 py-4 text-sm font-semibold uppercase text-white backdrop-blur-md transition-colors hover:bg-white hover:text-[#141414]">
                Value my property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-4 md:col-start-9">
            <AgentLeadForm
              eyebrow="Buyer match"
              title="Get a shortlist before you visit"
              submitLabel="Get matching homes"
              defaultIntent="buyer_match"
              showMessage={false}
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-black/10 bg-white px-5 py-6 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            ['48', 'active buyer briefs'],
            ['15 min', 'target call-back SLA'],
            ['7', 'source channels tracked'],
            ['3', 'campaign-ready landing paths'],
          ].map(([value, label]) => (
            <div key={label} className="border-l border-black/10 pl-5">
              <p className="text-3xl font-medium tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-[#6f6f6f]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <Reveal className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-[12px] font-semibold uppercase text-[#0F766E]">Live inventory</p>
            <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight md:text-6xl">
              Property pages that keep the lead with the listing agent.
            </h2>
          </div>
          <p className="text-sm leading-7 text-[#6f6f6f] md:col-span-4 md:col-start-9">
            Each listing can be used as an organic page, a search-ad landing page, a WhatsApp follow-up link, or a retargeting destination.
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {listings.map((property, index) => (
            <Reveal key={property.id} delay={index * 120}>
              <AgentListingCard property={property} priority={index === 0} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/agents/listings" className="inline-flex items-center gap-2 bg-[#141414] px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#0F766E]">
            View all listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="lead-engine" className="grid border-y border-black/10 bg-[#111827] text-white md:grid-cols-2">
        <div className="relative min-h-[520px]">
          <Image src={advisorImage} alt="Broker reviewing property marketing results" fill className="object-cover" unoptimized />
        </div>
        <div className="flex items-center px-5 py-20 md:px-16 md:py-28">
          <Reveal className="max-w-xl">
            <p className="text-[12px] font-bold uppercase text-emerald-200">Lead operating system</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-6xl">
              Built for the follow-up gap after the enquiry.
            </h2>
            <div className="mt-10 grid gap-5">
              {leadEngineItems.map(({ icon: Icon, title, text }) => (
                <div key={title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-white/15 pt-5">
                  <Icon className="mt-1 h-5 w-5 text-emerald-200" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/65">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="attribution" className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <Reveal className="md:col-span-5">
          <p className="text-[12px] font-semibold uppercase text-[#0F766E]">Seller acquisition</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            A separate path for property owners.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#5f6460]">
            Buyer enquiries alone do not build a brokerage. The seller valuation route gives search ads, social ads and referrals a dedicated conversion path.
          </p>
          <Link href="/agents/sell" className="mt-9 inline-flex items-center gap-2 bg-[#141414] px-7 py-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#0F766E]">
            Open seller page
            <LineChart className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal delay={130} className="grid gap-5 md:col-span-6 md:col-start-7">
          {[
            ['Search ads', 'Locality landing pages for "sell flat in Indiranagar" and "property valuation near me".'],
            ['Listing ads', 'Every property page can carry ad headline, description and campaign tags.'],
            ['Retargeting', 'Visitors who inspect listings can be routed back to buyer match or seller valuation offers.'],
            ['Portal defense', 'Portal leads can be imported or tagged so the broker can compare lead quality by source.'],
          ].map(([title, text]) => (
            <div key={title} className="border-t border-black/10 bg-white p-6">
              <h3 className="text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6f6f6f]">{text}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
