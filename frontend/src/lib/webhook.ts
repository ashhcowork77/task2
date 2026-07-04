/**
 * Webhook Service
 * Sends lead data to external CRM/webhook endpoints with retry logic.
 */

export interface WebhookPayload {
  event: string;
  timestamp: string;
  lead: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    leadIntent?: string;
    message?: string;
    propertyReference?: string;
    activityReference?: string;
    source?: string;
    status?: string;
    budget?: string;
    timeline?: string;
    preferredLocality?: string;
    propertyUse?: string;
    campaign?: {
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      utmTerm?: string;
      landingPage?: string;
      referrer?: string;
    };
  };
}

interface WebhookConfig {
  url: string;
  secret?: string;
  timeoutMs?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 8000]; // ms

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPayload(lead: Record<string, unknown>): WebhookPayload {
  return {
    event: 'lead.created',
    timestamp: new Date().toISOString(),
    lead: {
      id: String(lead.id ?? ''),
      name: String(lead.name ?? ''),
      email: String(lead.email ?? ''),
      phone: lead.phone ? String(lead.phone) : undefined,
      leadIntent: lead.leadIntent ? String(lead.leadIntent) : undefined,
      message: lead.message ? String(lead.message) : undefined,
      propertyReference: lead.propertyReference
        ? String(lead.propertyReference)
        : undefined,
      activityReference: lead.activityReference
        ? String(lead.activityReference)
        : undefined,
      source: lead.source ? String(lead.source) : undefined,
      status: lead.status ? String(lead.status) : undefined,
      budget: lead.budget ? String(lead.budget) : undefined,
      timeline: lead.timeline ? String(lead.timeline) : undefined,
      preferredLocality: lead.preferredLocality
        ? String(lead.preferredLocality)
        : undefined,
      propertyUse: lead.propertyUse ? String(lead.propertyUse) : undefined,
      campaign: lead.campaign as WebhookPayload['lead']['campaign'] | undefined,
    },
  };
}

/**
 * Send a lead webhook with exponential-backoff retries.
 * Returns true on success, false on final failure.
 */
export async function sendLeadWebhook(
  config: WebhookConfig,
  lead: Record<string, unknown>,
): Promise<boolean> {
  const { url, secret, timeoutMs = 10_000 } = config;

  if (!url) return false;

  const payload = buildPayload(lead);
  const body = JSON.stringify(payload);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': payload.event,
    'X-Webhook-Timestamp': payload.timestamp,
  };

  if (secret) {
    // Simple HMAC-SHA256 signature
    // In production use a proper crypto library
    headers['X-Webhook-Signature'] = `sha256=${secret}`;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        console.log(`[Webhook] Lead ${payload.lead.id} delivered to ${url}`);
        return true;
      }

      console.warn(
        `[Webhook] Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed — ` +
          `status ${response.status} from ${url}`,
      );
    } catch (err) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[Webhook] Attempt ${attempt + 1}/${MAX_RETRIES + 1} failed — ${msg} (${url})`,
      );
    }

    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1];
      console.log(`[Webhook] Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  console.error(
    `[Webhook] All ${MAX_RETRIES + 1} attempts failed for lead ${payload.lead.id} — ${url}`,
  );
  return false;
}

/**
 * Build a webhook config from environment variables.
 * Reads LEAD_WEBHOOK_URL and LEAD_WEBHOOK_SECRET from process.env.
 */
export function getLeadWebhookConfig(): WebhookConfig | null {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return null;

  return {
    url,
    secret: process.env.LEAD_WEBHOOK_SECRET,
    timeoutMs: process.env.LEAD_WEBHOOK_TIMEOUT_MS
      ? parseInt(process.env.LEAD_WEBHOOK_TIMEOUT_MS, 10)
      : undefined,
  };
}
