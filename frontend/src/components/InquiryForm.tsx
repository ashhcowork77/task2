'use client';

import { useState } from 'react';
import { CalendarDays, Mail, Phone, Send, User, Users } from 'lucide-react';
import { submitInquiry } from '@/lib/actions';
import type { InquiryFormData } from '@/lib/schemas';

export interface InquiryFormProps {
  propertyId: string;
  propertyTitle?: string;
  nightlyPrice?: number;
}

/**
 * Property Inquiry Form Component
 * Captures name, email, phone, and message from potential guests.
 * Submits lead to Payload CMS via Server Action.
 */
export default function InquiryForm({ propertyId, propertyTitle, nightlyPrice }: InquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    const stayDetails = [
      checkIn ? `Check-in: ${checkIn}` : null,
      checkOut ? `Check-out: ${checkOut}` : null,
      guests ? `Guests: ${guests}` : null,
    ].filter(Boolean);

    const result = await submitInquiry({
      name,
      email,
      phone,
      message: stayDetails.length > 0
        ? `${message}\n\nStay details:\n${stayDetails.join('\n')}`
        : message,
      propertyReference: propertyId,
    } as InquiryFormData);

    setLoading(false);

    if (result.success) {
      setSuccess('Thank you for your inquiry! We will get back to you soon.');
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setCheckIn('');
      setCheckOut('');
      setGuests('2');
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-6 shadow-[0_24px_80px_rgba(20,20,20,0.08)] ring-1 ring-black/5">
      <div className="mb-6 border-b border-black/10 pb-5">
        <p className="text-[11px] font-semibold uppercase text-[#A1834C]">Private request</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight text-[#141414]">
          {propertyTitle ? `Request ${propertyTitle}` : 'Request this stay'}
        </h3>
        {nightlyPrice && (
          <p className="mt-2 text-sm text-[#6f6f6f]">
            From <span className="font-semibold text-[#141414]">Rs {nightlyPrice.toLocaleString('en-IN')}</span> per night
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="checkIn" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
              <CalendarDays className="h-3.5 w-3.5" /> Check-in
            </label>
            <input
              type="date"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
              <CalendarDays className="h-3.5 w-3.5" /> Check-out
            </label>
            <input
              type="date"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Users className="h-3.5 w-3.5" /> Guests
          </label>
          <input
            type="number"
            id="guests"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          />
        </div>

        <div>
          <label htmlFor="name" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <User className="h-3.5 w-3.5" /> Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            placeholder="Your full name"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            placeholder="your.email@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Phone className="h-3.5 w-3.5" /> Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            placeholder="+91 98765 43210"
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium uppercase text-[#6f6f6f]">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            rows={4}
            className="mt-1 w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            placeholder="Tell us what kind of stay you are planning..."
          />
          {fieldErrors.message && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.message[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-[#141414] px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#A1834C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Request stay
            </>
          )}
        </button>

        {success && (
          <div className="border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
