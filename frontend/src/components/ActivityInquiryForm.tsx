'use client';

import { useState } from 'react';
import { Mail, Phone, Send, User } from 'lucide-react';
import { submitActivityInquiry } from '@/lib/actions';
import type { ActivityInquiryFormData } from '@/lib/schemas';

interface ActivityInquiryFormProps {
  activityId: string;
  activityTitle?: string;
}

/**
 * Activity Inquiry Form Component
 * Client component that captures name, email, phone, and message.
 * Submits lead to Payload CMS via Server Action.
 */
export function ActivityInquiryForm({ activityId, activityTitle }: ActivityInquiryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

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

    const result = await submitActivityInquiry({
      name,
      email,
      phone,
      message,
      activityReference: activityId,
    } as ActivityInquiryFormData);

    setLoading(false);

    if (result.success) {
      setSuccess('Thank you for your inquiry! We will get back to you soon.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors);
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <div>
      {activityTitle && (
        <h3 className="mb-4 text-lg font-medium tracking-tight text-[#141414]">
          Request this experience
        </h3>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="activity-name" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <User className="h-3.5 w-3.5" /> Name
          </label>
          <input
            type="text"
            id="activity-name"
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
          <label htmlFor="activity-email" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          <input
            type="email"
            id="activity-email"
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
          <label htmlFor="activity-phone" className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase text-[#6f6f6f]">
            <Phone className="h-3.5 w-3.5" /> Phone
          </label>
          <input
            type="tel"
            id="activity-phone"
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
          <label htmlFor="activity-message" className="block text-xs font-medium uppercase text-[#6f6f6f]">
            Message
          </label>
          <textarea
            id="activity-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            rows={4}
            className="mt-1 w-full border border-black/10 bg-[#F8F8F8] px-3 py-3 text-sm text-[#141414] outline-none transition-colors focus:border-[#141414]"
            placeholder="Tell us when you would like to arrange this..."
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
              Request experience
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
