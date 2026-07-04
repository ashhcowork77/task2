/**
 * WhatsApp integration utilities
 * Handles WhatsApp link building and configuration detection
 */

interface WhatsAppConfig {
  isConfigured: boolean;
  mode: 'direct_link' | 'business_api' | null;
  phoneNumber: string | null;
  defaultMessage: string | null;
  apiKey: string | null;
  businessAccountId: string | null;
  showOnPages: string[];
  widgetEnabled: boolean;
}

/**
 * Get WhatsApp configuration from environment or CMS
 * In production, this would fetch from Payload CMS
 */
export function getWhatsAppConfig(): WhatsAppConfig {
  // In production, this would fetch from Payload CMS collection 'whatsapp-config'
  // For now, use environment variables as fallback

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
  const defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Hi! I\'m interested in your properties. Can you help?';
  const mode = (process.env.NEXT_PUBLIC_WHATSAPP_MODE as 'direct_link' | 'business_api') || 'direct_link';
  const widgetEnabled = process.env.NEXT_PUBLIC_WHATSAPP_ENABLED !== 'false';

  const isConfigured = Boolean(phoneNumber);

  return {
    isConfigured,
    mode: isConfigured ? mode : null,
    phoneNumber: isConfigured ? phoneNumber : null,
    defaultMessage: isConfigured ? defaultMessage : null,
    apiKey: null,
    businessAccountId: null,
    showOnPages: ['property_detail', 'inquiry_form', 'floating_bar', 'agent_profile'],
    widgetEnabled: isConfigured && widgetEnabled,
  };
}

/**
 * Build a WhatsApp link with pre-filled message
 */
export function buildWhatsAppLink(params: {
  phone?: string;
  message: string;
}): string {
  const { phone = '+919876543210', message } = params;

  // Remove all non-digit characters from phone number
  const cleanPhone = phone.replace(/\D/g, '');

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Build WhatsApp click-to-chat link (alternative format)
 * This format opens WhatsApp Web/App directly with a specific chat
 */
export function buildWhatsAppChatLink(params: {
  phone?: string;
  message?: string;
}): string {
  const { phone = '+919876543210', message } = params;

  const cleanPhone = phone.replace(/\D/g, '');

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
  }

  return `https://api.whatsapp.com/send?phone=${cleanPhone}`;
}

/**
 * Check if a page should show WhatsApp widget
 */
export function shouldShowWhatsAppWidget(pageType: string): boolean {
  const config = getWhatsAppConfig();

  if (!config.widgetEnabled) {
    return false;
  }

  return config.showOnPages.includes(pageType);
}

/**
 * Get WhatsApp link for a specific property inquiry
 */
export function getPropertyInquiryLink(params: {
  phone?: string;
  propertyId: string;
  propertyTitle: string;
  source: string;
}): string {
  const { phone, propertyId, propertyTitle, source } = params;
  const config = getWhatsAppConfig();

  const message = [
    `Hi! I'm interested in your property:`,
    '',
    `Property: ${propertyTitle}`,
    `Reference: ${propertyId}`,
    `Source: ${source}`,
    '',
    'Could you please share more details?'
  ].join('\n');

  return buildWhatsAppLink({
    phone: phone || config.phoneNumber || '+919876543210',
    message,
  });
}

/**
 * Get WhatsApp link for agent contact
 */
export function getAgentContactLink(params: {
  phone?: string;
  agentName: string;
  propertyTitle?: string;
}): string {
  const { phone, agentName, propertyTitle } = params;
  const config = getWhatsAppConfig();

  let message = `Hi ${agentName}! `;

  if (propertyTitle) {
    message += `I'm interested in the property "${propertyTitle}". `;
  }

  message += 'Could you please provide more information?';

  return buildWhatsAppLink({
    phone: phone || config.phoneNumber || '+919876543210',
    message,
  });
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  // Indian phone number formatting
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+91 ${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  // Generic international format
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, cleaned.length - 10)} ${cleaned.slice(-10, -5)} ${cleaned.slice(-5)}`;
  }

  return phone;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');

  // Accept formats: +91XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX (10 digits)
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Get WhatsApp Business API integration details
 * In production, this would be used for sending automated messages
 */
export function getWhatsAppBusinessConfig() {
  return {
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: 'v18.0',
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  };
}
