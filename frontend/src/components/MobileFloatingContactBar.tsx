'use client';

import { useState, useCallback } from 'react';
import { ChevronUp, MessageCircle, Phone, X } from 'lucide-react';

interface MobileFloatingContactBarProps {
  phoneNumber?: string;
  whatsappNumber?: string;
  propertyId?: string;
  propertyTitle?: string;
  className?: string;
}

function formatPhoneForTel(phone?: string) {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}

function formatPhoneForWhatsApp(phone?: string) {
  if (!phone) return '';
  // Ensure it starts with country code (assumes India +91 if not present)
  let num = phone.replace(/[^0-9]/g, '');
  if (!num.startsWith('91') && num.length === 10) {
    num = '91' + num;
  }
  return num.startsWith('+') ? num.replace('+', '') : num;
}

/**
 * Mobile Floating Contact Bar
 * Sticky bottom bar on mobile with call, WhatsApp, and enquiry CTA.
 * Collapsible to minimize screen real estate.
 */
export default function MobileFloatingContactBar({
  phoneNumber,
  whatsappNumber,
  propertyId,
  propertyTitle,
  className,
}: MobileFloatingContactBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  const waNumber = formatPhoneForWhatsApp(whatsappNumber ?? phoneNumber);
  const telNumber = formatPhoneForTel(phoneNumber);

  const expandedHeight = 'h-48';
  const collapsedHeight = 'h-14';

  // Don't render if no contact methods available
  if (!telNumber && !waNumber) return null;

  return (
    <>
      {/* Spacer — prevents content from being hidden behind the bar */}
      <div className="h-14 md:hidden" />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col items-stretch border-t border-black/10 bg-white shadow-[0_-8px_32px_rgba(20,20,20,0.1)] transition-all duration-300 md:hidden ${className ?? ''}`}
        style={{ maxHeight: expanded ? '16rem' : '3.5rem', overflow: 'hidden' }}
      >
        {/* Toggle handle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center border-b border-black/5 py-2 text-[#6f6f6f] hover:text-[#141414]"
          aria-label={expanded ? 'Collapse contact bar' : 'Expand contact bar'}
        >
          {expanded ? (
            <X className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Contact</span>
            </div>
          )}
        </button>

        {/* Primary CTA row */}
        <div className="flex divide-x divide-black/5">
          {/* Call */}
          {telNumber && (
            <a
              href={`tel:${telNumber}`}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-[#F8F8F8]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141414] text-white">
                <Phone className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
                Call
              </span>
            </a>
          )}

          {/* WhatsApp */}
          {waNumber && (
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                propertyTitle
                  ? `Hi, I am interested in "${propertyTitle}" (ID: ${propertyId}). Please share more details.`
                  : 'Hi, I am interested in your property listing. Please share more details.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-[#F8F8F8]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
                WhatsApp
              </span>
            </a>
          )}

          {/* Enquire */}
          <a
            href={`#enquiry-form${propertyId ? `-${propertyId}` : ''}`}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-[#F8F8F8]"
            onClick={() => setExpanded(false)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#A1834C] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#6f6f6f]">
              Enquire
            </span>
          </a>
        </div>

        {/* Expanded: quick message preview */}
        {expanded && (
          <div className="border-t border-black/5 bg-[#F8F8F8] p-3">
            <p className="text-center text-xs text-[#6f6f6f]">
              {propertyTitle
                ? `Inquiring about: "${propertyTitle}"`
                : 'Tell us what you are looking for and we will get back to you!'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
