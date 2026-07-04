'use client';

import { Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CallButtonProps {
  phoneNumber?: string;
  trackingNumber?: string;
  propertyId?: string;
  propertyTitle?: string;
  source?: 'property_page' | 'inquiry_form' | 'agent_card' | 'floating_bar' | string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function CallButton({
  phoneNumber,
  trackingNumber,
  propertyId,
  propertyTitle,
  source = 'unknown',
  variant = 'primary',
  size = 'md',
  showLabel = true,
  className,
}: CallButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  // Use tracking number if available, otherwise fallback to direct number
  const displayNumber = trackingNumber || phoneNumber || '+919876543210';
  const telLink = `tel:${displayNumber.replace(/\s/g, '')}`;

  const handleClick = () => {
    setIsClicked(true);

    // Log call request for tracking (in production, send to analytics)
    const callData = {
      timestamp: new Date().toISOString(),
      phoneNumber: displayNumber,
      propertyId,
      propertyTitle,
      source,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };

    console.log('[CallButton] Call request:', callData);

    // In production, this would:
    // 1. Track in analytics (Google Analytics, Mixpanel, etc.)
    // 2. Send to call tracking service (CallRail, CallTrackingMetrics, etc.)
    // 3. Log for attribution
    // 4. Trigger webhook for CRM

    // Reset clicked state after brief delay
    setTimeout(() => setIsClicked(false), 2000);
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-base',
    lg: 'h-14 px-7 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/25',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  };

  return (
    <a
      href={telLink}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all',
        'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        'active:scale-95',
        sizeClasses[size],
        variantClasses[variant],
        isClicked && 'scale-95',
        className
      )}
    >
      <Phone
        className={cn('transition-transform', isClicked && 'animate-bounce')}
        size={iconSizes[size]}
      />
      {showLabel && (
        <span>
          {isClicked ? 'Connecting...' : 'Call Now'}
        </span>
      )}
    </a>
  );
}

/**
 * Call button with scheduling option
 */
export function CallButtonWithSchedule({
  phoneNumber,
  trackingNumber,
  propertyId,
  propertyTitle,
  source,
  className,
}: Omit<CallButtonProps, 'variant' | 'size' | 'showLabel'> & {
  className?: string;
}) {
  const [showSchedule, setShowSchedule] = useState(false);

  const displayNumber = trackingNumber || phoneNumber || '+919876543210';

  return (
    <div className={cn('space-y-2', className)}>
      <CallButton
        phoneNumber={displayNumber}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        source={source}
        variant="primary"
      />
      <button
        onClick={() => setShowSchedule(!showSchedule)}
        className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <Clock className="h-4 w-4" />
        {showSchedule ? 'Hide' : 'Schedule'} a callback
      </button>
      {showSchedule && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm text-gray-600">Select your preferred time:</p>
          <div className="grid grid-cols-3 gap-2">
            {['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-8PM)'].map((time) => (
              <button
                key={time}
                onClick={() => {
                  alert(`Callback scheduled for ${time}. We will call you shortly.`);
                  setShowSchedule(false);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
