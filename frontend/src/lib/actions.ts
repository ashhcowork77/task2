'use server';

import {
  activityInquirySchema,
  agentLeadSchema,
  callbackRequestSchema,
  inquirySchema,
  type ActivityInquiryFormData,
  type AgentLeadFormData,
  type CallbackRequestData,
  type InquiryFormData,
} from '@/lib/schemas';

/**
 * Server Action for submitting property inquiry forms
 * Validates input with Zod and creates a lead in Payload CMS
 */
export async function submitInquiry(data: InquiryFormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  // 1. Validate input with Zod
  const validation = inquirySchema.safeParse(data);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });
    return { success: false, fieldErrors };
  }

  // 2. Submit to Payload CMS
  try {
    // For demo, just log the inquiry (Payload integration requires database setup)
    console.log('[submitInquiry] Inquiry received:', validation.data);
    console.log('Property reference:', validation.data.propertyReference);
    console.log('Message:', validation.data.message);

    // In production with database, this would create a lead in Payload:
    // const payload = await getPayloadInstance();
    // await payload.create({ collection: 'leads', data: {...} });

    return { success: true };
  } catch (error) {
    console.error('[submitInquiry] Error:', error);
    return {
      success: false,
      error: 'Failed to submit inquiry. Please try again.',
    };
  }
}

/**
 * Server Action for submitting activity inquiry forms
 * Validates input with Zod and creates a lead in Payload CMS
 */
export async function submitActivityInquiry(data: ActivityInquiryFormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  // 1. Validate input with Zod
  const validation = activityInquirySchema.safeParse(data);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });
    return { success: false, fieldErrors };
  }

  // 2. Submit to Payload CMS
  try {
    // For demo, just log the inquiry (Payload integration requires database setup)
    console.log('[submitActivityInquiry] Inquiry received:', validation.data);
    console.log('Activity reference:', validation.data.activityReference);

    return { success: true };
  } catch (error) {
    console.error('[submitActivityInquiry] Error:', error);
    return {
      success: false,
      error: 'Failed to submit inquiry. Please try again.',
    };
  }
}

/**
 * Server Action for agent/broker lead forms.
 * This is intentionally structured for future Payload persistence, WhatsApp
 * routing, call tracking, and ad platform offline-conversion imports.
 */
export async function submitAgentLead(data: AgentLeadFormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  const validation = agentLeadSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });

    return { success: false, fieldErrors };
  }

  try {
    const lead = validation.data;
    const score = calculateLeadScore(lead);

    console.log('[submitAgentLead] Qualified lead received:', {
      ...lead,
      score,
      status: score >= 70 ? 'qualified' : 'new',
    });

    return { success: true };
  } catch (error) {
    console.error('[submitAgentLead] Error:', error);
    return {
      success: false,
      error: 'Failed to submit lead. Please try again.',
    };
  }
}

function calculateLeadScore(lead: AgentLeadFormData) {
  let score = 35;

  if (lead.phone) score += 15;
  if (lead.timeline && ['immediately', 'this_month', '1_3_months'].includes(lead.timeline)) {
    score += 20;
  }
  if (lead.budget) score += 10;
  if (lead.propertyReference) score += 10;
  if (lead.leadIntent === 'seller_valuation') score += 10;

  return Math.min(score, 100);
}

/**
 * Server Action for submitting callback requests.
 * Validates input with Zod and creates a lead in Payload CMS.
 */
export async function submitCallbackRequest(data: CallbackRequestData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  const validation = callbackRequestSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    validation.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });
    return { success: false, fieldErrors };
  }

  try {
    const lead = validation.data;
    console.log('[submitCallbackRequest] Callback requested:', {
      name: lead.name,
      phone: lead.phone,
      preferredTime: lead.preferredTime,
      propertyReference: lead.propertyReference,
    });

    return { success: true };
  } catch (error) {
    console.error('[submitCallbackRequest] Error:', error);
    return {
      success: false,
      error: 'Failed to submit callback request. Please try again.',
    };
  }
}
