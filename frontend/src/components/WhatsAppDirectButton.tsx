'use client';

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildWhatsAppLink, getWhatsAppConfig } from '@/lib/whatsapp';

interface WhatsAppDirectButtonProps {
  phoneNumber?: string;
  message?: string;
  propertyReference?: string;
  propertyTitle?: string;
  source?: 'property_detail' | 'inquiry_form' | 'agent_card' | 'floating_bar';
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function WhatsAppDirectButton({
  phoneNumber,
  message,
  propertyReference,
  propertyTitle,
  source = 'unknown',
  variant = 'primary',
  size = 'md',
  showLabel = true,
  className,
}: WhatsAppDirectButtonProps) {
  const config = getWhatsAppConfig();

  // If WhatsApp is not configured, don't show the button
  if (!config.isConfigured) {
    return null;
  }

  // Build the pre-filled message
  const preFilledMessage = message || config.defaultMessage || 'Hi! I\'m interested in your properties.';

  // Add property details to message if available
  let fullMessage = preFilledMessage;
  if (propertyTitle || propertyReference) {
    fullMessage = `${fullMessage}\n\nProperty: ${propertyTitle || propertyReference}`;
  }

  const waLink = buildWhatsAppLink({
    phone: phoneNumber || config.phoneNumber || '+919876543210',
    message: fullMessage,
  });

  const handleClick = () => {
    // Track WhatsApp click for analytics
    const clickData = {
      timestamp: new Date().toISOString(),
      phoneNumber: phoneNumber || config.phoneNumber,
      propertyReference,
      propertyTitle,
      source,
      messageLength: fullMessage.length,
    };

    console.log('[WhatsAppButton] Click:', clickData);

    // In production:
    // 1. Track in analytics
    // 2. Log lead source
    // 3. Send to CRM

    // Open WhatsApp
    window.open(waLink, '_blank');
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-14 px-7 text-lg',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  const variantClasses = {
    primary: 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25',
    secondary: 'bg-white text-green-600 border-2 border-green-500 hover:bg-green-50 shadow-sm',
    outline: 'border-2 border-green-500 text-green-600 hover:bg-green-50',
    icon: 'bg-green-500 text-white hover:bg-green-600 rounded-full shadow-lg shadow-green-500/25',
  };

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center transition-all hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-14 w-14' : 'h-12 w-12',
          className
        )}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle
          className="h-6 w-6"
          style={{ fill: 'currentColor' }}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        'active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <MessageCircle size={iconSizes[size]} style={{ fill: 'currentColor' }} />
      {showLabel && <span>WhatsApp</span>}
    </button>
  );
}

/**
 * WhatsApp button for floating action bar
 */
export function WhatsAppFloatingButton({
  phoneNumber,
  propertyTitle,
  className,
}: {
  phoneNumber?: string;
  propertyTitle?: string;
  className?: string;
}) {
  const config = getWhatsAppConfig();

  if (!config.isConfigured) {
    return null;
  }

  const message = `Hi! I saw the property "${propertyTitle || 'on your website'}" and would like to know more.`;

  return (
    <WhatsAppDirectButton
      phoneNumber={phoneNumber}
      message={message}
      propertyTitle={propertyTitle}
      source="floating_bar"
      variant="primary"
      size="lg"
      showLabel
      className={className}
    />
  );
}

/**
 * Compact WhatsApp share button for property cards
 */
export function WhatsAppShareButton({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const shareText = `Check out this property: ${title}`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const whatsappLink = buildWhatsAppLink({
    phone: '+919876543210', // Default, but share typically ignores this
    message: `${shareText}\n\n${shareUrl}`,
  });

  return (
    <button
      onClick={() => window.open(whatsappLink, '_blank')}
      className={cn(
        'flex items-center justify-center h-9 w-9 rounded-full',
        'bg-green-100 text-green-600 hover:bg-green-200 transition-colors',
        className
      )}
      aria-label="Share on WhatsApp"
    >
      <MessageCircle className="h-4 w-4" style={{ fill: 'currentColor' }} />
    </button>
  );
}
