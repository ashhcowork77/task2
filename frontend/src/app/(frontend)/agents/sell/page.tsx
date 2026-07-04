import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BarChart3, Camera, CheckCircle2, ClipboardList, Megaphone } from 'lucide-react';
import { AgentLeadForm } from '@/components/agent/AgentLeadForm';
import { Reveal } from '@/components/Reveal';

const sellerHero = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2400&q=85&auto=format&fit=crop';
const inspectionImage = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1800&q=85&auto=format&fit=crop';

const sellerSteps = [
  {
    icon: BarChart3,
    title: 'Market read',
    text: 'Recent comparable demand, active competition and realistic range.',
  },
  {
    icon: Camera,
    title: 'Listing readiness',
    text: 'Photo, copy, documents and visit preparation before the campaign starts.',
  },
  {
    icon: Megaphone,
    title: 'Campaign mix',
    text: 'Portal, Google search, social retargeting and WhatsApp follow-up paths.',
  },
  {
    icon: ClipboardList,
    title: 'Follow-up system',
    text: 'Qualified lead routing, owner updates and next action tracking.',
  },
];

export const metadata = {
  title: 'Sell Your Property | Northline Realty',
  description: 'Request a property valuation and selling plan with source-tracked seller lead capture.',
};

export default function AgentSellerPage() {
  return (
    <main className="min-h-screen bg-[#F6F7F4] text-[#141414]">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image src={sellerHero} alt="Real estate seller consultation" fill priority className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/82 via-[#111827]/52 to-[#111827]/12" />
        <div className="relative z-10 grid min-h-[92vh] items-center gap-10 px-5 pb-12 pt-32 md:grid-cols-12 md:px-10 md:pt-32">
          <Reveal className="md:col-span-7">
            <p className="text-[12px] font-bold uppercase text-emerald-200">Seller valuation route</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-medium leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
              Know the selling path before you list on a portal.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78">
              Share your property details and get a market-backed plan for pricing, photography, listing distribution, visits and follow-up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/78">
              {['Indicative price range', 'Portal + search ad plan', 'Visit-readiness checklist'].map((item) => (
                <span key={item} className="border border-white/25 px-4 py-2 backdrop-blur-md">{item}</span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="md:col-span-4 md:col-start-9">
            <AgentLeadForm
              eyebrow="Owner enquiry"
              title="Request a valuation"
              submitLabel="Send property details"
              defaultIntent="seller_valuation"
              showMessage={false}
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-12 md:px-10 md:py-28">
        <Reveal className="md:col-span-5">
          <p className="text-[12px] font-bold uppercase text-[#0F766E]">Why owners respond</p>
          <h2 className="mt-3 text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            The page answers the question behind the click.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#5f6460]">
            Most sellers are not asking for a website. They want a serious answer to price, demand, time-to-sell and whether the agent has a plan beyond posting a listing.
          </p>
        </Reveal>

        <Reveal delay={120} className="grid gap-5 md:col-span-6 md:col-start-7">
          {sellerSteps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-black/10 bg-white p-6">
              <Icon className="mt-1 h-5 w-5 text-[#0F766E]" />
              <div>
                <h3 className="text-xl font-medium tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6f6f6f]">{text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="grid border-y border-black/10 bg-white md:grid-cols-2">
        <div className="relative min-h-[520px]">
          <Image src={inspectionImage} alt="Property exterior prepared for sale" fill className="object-cover" unoptimized />
        </div>
        <div className="flex items-center px-5 py-20 md:px-16 md:py-28">
          <Reveal className="max-w-xl">
            <p className="text-[12px] font-bold uppercase text-[#0F766E]">Owner-facing promise</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-tight md:text-6xl">
              Clear next steps instead of a vague listing package.
            </h2>
            <div className="mt-9 space-y-4">
              {[
                'Valuation request captured with location, budget band and timeline.',
                'Lead source is attached to the owner enquiry for campaign reporting.',
                'Broker can compare search ads, social ads, portal leads and referrals inside one lead table.',
                'The same property can become a public listing, ad landing page and WhatsApp follow-up link.',
              ].map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6 text-[#5f6460]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />
                  {item}
                </p>
              ))}
            </div>
            <Link href="/agents/listings" className="mt-10 inline-flex items-center gap-2 bg-[#141414] px-7 py-4 text-sm font-semibold uppercase text-white transition-colors hover:bg-[#0F766E]">
              See listing experience
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
