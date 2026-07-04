'use client';

import { useState } from 'react';
import { Phone, Send, Clock } from 'lucide-react';
import { submitCallbackRequest } from '@/lib/actions';
import type { CallbackRequestData } from '@/lib/schemas';

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (9 AM – 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM – 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM – 8 PM)' },
];

interface CallbackRequestFormProps {
  propertyId?: string;
  propertyTitle?: string;
  agentPhone?: string;
  className?: string;
}

/**
 * Callback Request Form
 * Captures name, phone, preferred time, and optional property reference.
 * Submits lead to Payload CMS via Server Action.
 */
export default function CallbackRequestForm({
  propertyId,
  propertyTitle,
  className,
}: CallbackRequestFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
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

    const result = await submitCallbackRequest({
      name,
      phone,
      preferredTime: timeSlot,
      propertyReference: propertyId,
    } as CallbackRequestData);

    setLoading(false);

    if (result.success) {
      setSuccess('Callback requested! Our agent will call you at the selected time.');
      setName('');
      setPhone('');
      setTimeSlot('');
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <div className={`bg-white p-6 shadow-[0_24px_80px_rgba(20,20,20,0.08)] ring-1 ring-black/5 ${className ?? ''}`}>
      {/* Header */}
      <div className="mb-5 border-b border-black/10 pb-4">
        <p className="text-[11px] font-semibold uppercase text-[#A1834C]">Callback</p>
        <h3 className="mt-2 text-xl font-medium tracking-tight text-[#141414]">
          Request a Callback
        </h3>
        <p className="mt-1 text-sm text-[#6f6f6f]">
          {propertyTitle
            ? `Get a call about "${propertyTitle}"`
            : 'Our agent will call you at your preferred time'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="callback-name" className="mb-1 block text-xs font-medium uppercase text-[#6f6f6f]">
            Your Name
          </label>
          <input
            type="text"
            id="callback-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            placeholder="Rajesh Kumar"
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name[0]}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="callback-phone" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Phone className="h-3.5 w-3.5" />
            Phone Number
          </label>
          <input
            type="tel"
            id="callback-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            minLength={10}
            placeholder="+91 98765 43210"
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.phone[0]}</p>
          )}
        </div>

        {/* Preferred Time */}
        <div>
          <label htmlFor="callback-time" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Clock className="h-3.5 w-3.5" />
            Preferred Time
          </label>
          <select
            id="callback-time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
          >
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
          {fieldErrors.preferredTime && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.preferredTime[0]}</p>
          )}
        </div>

        {/* Property Reference (hidden if provided) */}
        {propertyId && (
          <input type="hidden" name="propertyReference" value={propertyId} />
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-[#141414] px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#A1834C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            <>
              <Phone className="h-4 w-4" />
              Request Callback
            </>
          )}
        </button>

        {/* Success */}
        {success && (
          <div className="border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
