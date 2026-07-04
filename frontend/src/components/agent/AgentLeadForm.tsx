'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Home, Mail, MapPin, Phone, User } from 'lucide-react';
import { submitAgentLead } from '@/lib/actions';
import type { AgentLeadFormData } from '@/lib/schemas';

type LeadIntent = AgentLeadFormData['leadIntent'];

interface AgentLeadFormProps {
  title?: string;
  eyebrow?: string;
  submitLabel?: string;
  propertyId?: string;
  propertyTitle?: string;
  defaultIntent?: LeadIntent;
  defaultLocality?: string;
  compact?: boolean;
  showMessage?: boolean;
}

const timelineOptions = [
  { label: 'Immediately', value: 'immediately' },
  { label: 'This month', value: 'this_month' },
  { label: '1-3 months', value: '1_3_months' },
  { label: '3-6 months', value: '3_6_months' },
  { label: '6+ months', value: '6_plus_months' },
  { label: 'Researching', value: 'researching' },
] as const;

export function AgentLeadForm({
  title = 'Tell us what you need',
  eyebrow = 'Fast lead routing',
  submitLabel = 'Send request',
  propertyId,
  propertyTitle,
  defaultIntent = 'buyer_match',
  defaultLocality = '',
  compact = false,
  showMessage = true,
}: AgentLeadFormProps) {
  const pathname = usePathname();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadIntent, setLeadIntent] = useState<LeadIntent>(defaultIntent);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState<AgentLeadFormData['timeline']>('1_3_months');
  const [preferredLocality, setPreferredLocality] = useState(defaultLocality);
  const [message, setMessage] = useState(
    propertyTitle
      ? `I want to know more about ${propertyTitle}.`
      : 'I want help with my property requirement.',
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    setFieldErrors({});

    const campaignParams = getCampaignParams();

    const result = await submitAgentLead({
      name,
      email,
      phone,
      message,
      propertyReference: propertyId,
      leadIntent,
      budget,
      timeline,
      preferredLocality,
      propertyUse: leadIntent === 'seller_valuation' ? 'not_sure' : 'own_stay',
      source: normalizeSource(campaignParams.utmSource),
      campaign: {
        ...campaignParams,
        landingPage: pathname,
      },
    });

    setLoading(false);

    if (result.success) {
      setSuccess('Request received. The right agent will follow up shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setBudget('');
      setMessage(propertyTitle ? `I want to know more about ${propertyTitle}.` : '');
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  return (
    <div className="bg-white p-6 shadow-[0_24px_80px_rgba(20,20,20,0.08)] ring-1 ring-black/5">
      <div className="mb-6 border-b border-black/10 pb-5">
        <p className="text-[11px] font-semibold uppercase text-[#0F766E]">{eyebrow}</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight text-[#141414]">{title}</h3>
        {propertyTitle && (
          <p className="mt-2 text-sm leading-6 text-[#6f6f6f]">
            Routed from <span className="font-semibold text-[#141414]">{propertyTitle}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={compact ? 'space-y-4' : 'grid gap-3 md:grid-cols-2'}>
          <FieldError label="Name" error={fieldErrors.name?.[0]}>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8b8b8b]" />
              <input
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-black/10 bg-[#F8F8F8] px-10 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
                placeholder="Full name"
              />
            </div>
          </FieldError>
          <FieldError label="Phone" error={fieldErrors.phone?.[0]}>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8b8b8b]" />
              <input
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full border border-black/10 bg-[#F8F8F8] px-10 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
                placeholder="+91 98765 43210"
              />
            </div>
          </FieldError>
        </div>

        <FieldError label="Email" error={fieldErrors.email?.[0]}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8b8b8b]" />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-10 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
              placeholder="you@example.com"
            />
          </div>
        </FieldError>

        <div className={compact ? 'space-y-4' : 'grid gap-3 md:grid-cols-2'}>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">Intent</span>
            <select
              value={leadIntent}
              onChange={(event) => setLeadIntent(event.target.value as LeadIntent)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
            >
              <option value="schedule_visit">Schedule a visit</option>
              <option value="buyer_match">Find matching homes</option>
              <option value="rental_inquiry">Rental inquiry</option>
              <option value="seller_valuation">Value my property</option>
              <option value="brokerage_consultation">Brokerage consultation</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">Timeline</span>
            <select
              value={timeline}
              onChange={(event) => setTimeline(event.target.value as AgentLeadFormData['timeline'])}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
            >
              {timelineOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={compact ? 'space-y-4' : 'grid gap-3 md:grid-cols-2'}>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">Budget</span>
            <div className="relative">
              <Home className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8b8b8b]" />
              <input
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full border border-black/10 bg-[#F8F8F8] px-10 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
                placeholder="₹1.5 Cr, ₹80k/mo..."
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">Locality</span>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#8b8b8b]" />
              <input
                value={preferredLocality}
                onChange={(event) => setPreferredLocality(event.target.value)}
                className="w-full border border-black/10 bg-[#F8F8F8] px-10 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
                placeholder="Indiranagar, Whitefield..."
              />
            </div>
          </label>
        </div>

        {showMessage && (
          <FieldError label="Message" error={fieldErrors.message?.[0]}>
            <textarea
              required
              minLength={10}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm outline-none transition-colors focus:border-[#141414]"
              placeholder="Share property, timing, visit, or valuation details..."
            />
          </FieldError>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-[#141414] px-5 py-4 text-[13px] font-semibold uppercase text-white transition-colors hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending...' : submitLabel}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>

        <p className="text-xs leading-5 text-[#7b7b7b]">
          Your enquiry is tracked by page and campaign source so the right agent can follow up with context.
        </p>

        {success && <p className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
        {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      </form>
    </div>
  );
}

function getCampaignParams() {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    referrer: document.referrer || undefined,
  };
}

function normalizeSource(source?: string): AgentLeadFormData['source'] {
  if (!source) return 'direct';

  const normalized = source.toLowerCase();
  if (normalized.includes('google')) return 'google_search_ads';
  if (normalized.includes('meta') || normalized.includes('facebook') || normalized.includes('instagram')) return 'meta_ads';
  if (normalized.includes('portal') || normalized.includes('99acres') || normalized.includes('magicbricks')) return 'portal_lead';
  if (normalized.includes('whatsapp')) return 'whatsapp';
  if (normalized.includes('referral')) return 'referral';
  if (normalized.includes('organic')) return 'organic_search';

  return 'direct';
}

function FieldError({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
