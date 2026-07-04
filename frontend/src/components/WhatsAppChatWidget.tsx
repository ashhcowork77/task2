'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhatsAppChatWidgetProps {
  businessNumber?: string;
  messageTemplate?: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'green' | 'blue' | 'white';
  greeting?: string;
  awayMessage?: string;
  isOnline?: boolean;
  className?: string;
}

// WhatsApp Web SDK script loader
function loadWhatsAppSDK(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById('whatsapp-sdk')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'whatsapp-sdk';
    script.src = 'https://apps.elfsight.com/p/platform.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // Don't block on error
    document.head.appendChild(script);
  });
}

export function WhatsAppChatWidget({
  businessNumber = '+919876543210',
  messageTemplate = 'Hi! I\'m interested in your properties. Can you help?',
  position = 'bottom-right',
  theme = 'green',
  greeting = 'Hi there! How can we help you today?',
  awayMessage = 'We\'re currently away. Please leave a message and we\'ll get back to you soon.',
  isOnline = true,
  className,
}: WhatsAppChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadWhatsAppSDK().then(() => setIsLoaded(true));
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    const encodedMessage = encodeURIComponent(messageTemplate.replace('{message}', message));
    const waLink = `https://wa.me/${businessNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

    window.open(waLink, '_blank');
    setMessage('');
  };

  const themeColors = {
    green: 'bg-green-500 hover:bg-green-600 border-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
    white: 'bg-white hover:bg-gray-100 border-gray-300 shadow-lg',
  };

  const iconColor = theme === 'white' ? 'text-green-500' : 'text-white';

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-3',
        position === 'bottom-right' ? 'right-6 bottom-6' : 'left-6 bottom-6',
        className
      )}
    >
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="w-80 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className={cn('rounded-t-2xl p-4', theme === 'white' ? 'bg-green-500' : 'bg-current')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-white/20">
                    <div className="flex h-full items-center justify-center text-white">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                  </div>
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
                  )}
                </div>
                <div className="text-white">
                  <h3 className="font-semibold">Chat with us</h3>
                  <p className="text-xs text-white/80">
                    {isOnline ? 'We typically reply in minutes' : 'We\'ll reply when we\'re back'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-64 p-4">
            {/* Greeting Message */}
            <div className="mb-4 flex items-start gap-2">
              <div className={cn('rounded-2xl rounded-tl-sm px-4 py-2', theme === 'white' ? 'bg-gray-100' : 'bg-white/10')}>
                <p className={cn('text-sm', theme === 'white' ? 'text-gray-800' : 'text-white')}>
                  {isOnline ? greeting : awayMessage}
                </p>
              </div>
            </div>

            {/* Quick Replies */}
            {isOnline && (
              <div className="flex flex-wrap gap-2">
                {['Property Inquiry', 'Schedule Visit', 'Price Details', 'RERA Info'].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => setMessage(`Hi! I'm interested in: ${quick}`)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      theme === 'white'
                        ? 'border border-green-500 text-green-600 hover:bg-green-50'
                        : 'border border-white/30 text-white hover:bg-white/10'
                    )}
                  >
                    {quick}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                  theme === 'white'
                    ? 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300'
                    : 'bg-white text-green-500 hover:bg-gray-100 disabled:bg-white/50'
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Header */}
      {isOpen && isMinimized && (
        <div
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-full px-5 py-3 text-white shadow-lg transition-colors',
            theme === 'white' ? 'bg-green-500' : theme === 'blue' ? 'bg-blue-500' : 'bg-green-500'
          )}
          onClick={() => setIsMinimized(false)}
        >
          <span className="text-sm font-medium">Chat with us</span>
          <Maximize2 className="h-4 w-4" />
        </div>
      )}

      {/* Main Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105',
            themeColors[theme]
          )}
        >
          {/* Notification Badge */}
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
            1
          </span>

          {isOpen ? (
            <X className={cn('h-6 w-6 transition-transform', iconColor)} />
          ) : (
            <MessageCircle
              className={cn('h-7 w-7 transition-transform', iconColor)}
              style={{ fill: theme === 'white' ? 'none' : 'currentColor' }}
            />
          )}
        </button>
      )}

      {/* Decorative Background (for non-white theme) */}
      {isOpen && theme !== 'white' && (
        <div
          className="fixed inset-0 -z-10 bg-black/5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
