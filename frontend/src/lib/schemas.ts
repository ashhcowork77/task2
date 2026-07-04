import { z } from 'zod';

/**
 * Property inquiry form validation schema
 * Validates property inquiry form submissions
 */
export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please enter a message of at least 10 characters'),
  propertyReference: z.string().min(1, 'Property reference is required'),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

/**
 * Activity inquiry form validation schema
 * Validates activity inquiry form submissions
 */
export const activityInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please enter a message of at least 10 characters'),
  activityReference: z.string().min(1, 'Activity reference is required'),
});

export type ActivityInquiryFormData = z.infer<typeof activityInquirySchema>;

/**
 * Agent/broker lead validation schema.
 * Captures enough context for qualification, attribution, and fast follow-up.
 */
export const agentLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a phone number so the agent can follow up'),
  message: z.string().min(10, 'Please enter a message of at least 10 characters'),
  propertyReference: z.string().optional(),
  leadIntent: z.enum([
    'property_inquiry',
    'schedule_visit',
    'buyer_match',
    'rental_inquiry',
    'seller_valuation',
    'brokerage_consultation',
  ]),
  budget: z.string().optional(),
  timeline: z.enum([
    'immediately',
    'this_month',
    '1_3_months',
    '3_6_months',
    '6_plus_months',
    'researching',
  ]).optional(),
  preferredLocality: z.string().optional(),
  propertyUse: z.enum([
    'own_stay',
    'investment',
    'rental_income',
    'commercial_use',
    'not_sure',
  ]).optional(),
  source: z.enum([
    'property_inquiry',
    'contact_form',
    'organic_search',
    'google_search_ads',
    'meta_ads',
    'portal_lead',
    'whatsapp',
    'referral',
    'direct',
  ]).optional(),
  campaign: z.object({
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmContent: z.string().optional(),
    utmTerm: z.string().optional(),
    landingPage: z.string().optional(),
    referrer: z.string().optional(),
  }).optional(),
});

export type AgentLeadFormData = z.infer<typeof agentLeadSchema>;

/**
 * Callback request form validation schema
 * Captures a quick callback request with preferred time slot.
 */
export const callbackRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  preferredTime: z.enum(['morning', 'afternoon', 'evening'], {
    required_error: 'Please select a preferred time slot',
  }),
  propertyReference: z.string().optional(),
});

export type CallbackRequestData = z.infer<typeof callbackRequestSchema>;
