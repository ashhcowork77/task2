import { NextResponse } from 'next/server';

// Mock analytics data - in production this would query analytics DB
const MOCK_ANALYTICS = {
  overview: {
    propertyViews: {
      value: 24531,
      change: 12.5,
      previousValue: 21803,
    },
    totalLeads: {
      value: 1847,
      change: 8.3,
      previousValue: 1705,
    },
    phoneInquiries: {
      value: 423,
      change: -2.1,
      previousValue: 432,
    },
    emailInquiries: {
      value: 312,
      change: 5.7,
      previousValue: 295,
    },
    avgResponseTimeHours: {
      value: 2.4,
      change: -15.2,
      previousValue: 2.8,
    },
    conversionRate: {
      value: 7.5,
      change: 1.2,
      previousValue: 7.4,
    },
  },
  leadFunnel: [
    { stage: 'New Inquiry', count: 1847, percentage: 100 },
    { stage: 'Contacted', count: 1423, percentage: 77 },
    { stage: 'Qualified', count: 892, percentage: 48 },
    { stage: 'Site Visit', count: 445, percentage: 24 },
    { stage: 'Negotiation', count: 178, percentage: 10 },
    { stage: 'Closed', count: 89, percentage: 5 },
  ],
  leadSources: [
    { source: 'Property Inquiry Form', count: 523, percentage: 28 },
    { source: 'Phone Call', count: 412, percentage: 22 },
    { source: 'WhatsApp', count: 356, percentage: 19 },
    { source: 'Site Visit Request', count: 234, percentage: 13 },
    { source: 'Callback Request', count: 189, percentage: 10 },
    { source: 'Referral', count: 133, percentage: 7 },
  ],
  traffic: [
    { source: 'Google Search', visitors: 8456, percentage: 34, leads: 523, conversion: 6.2 },
    { source: 'Direct', visitors: 5234, percentage: 21, leads: 412, conversion: 7.9 },
    { source: 'Social Media', visitors: 4123, percentage: 17, leads: 287, conversion: 7.0 },
    { source: 'Referral', visitors: 3456, percentage: 14, leads: 345, conversion: 10.0 },
    { source: 'Email Campaign', visitors: 2345, percentage: 10, leads: 198, conversion: 8.4 },
    { source: 'Paid Ads', visitors: 917, percentage: 4, leads: 82, conversion: 8.9 },
  ],
  topLocalities: [
    { locality: 'Whitefield', properties: 45, views: 5234, leads: 234, avgPrice: '₹85L' },
    { locality: 'Electronic City', properties: 38, views: 4123, leads: 198, avgPrice: '₹62L' },
    { locality: 'HSR Layout', properties: 32, views: 3891, leads: 187, avgPrice: '₹78L' },
    { locality: 'Marathahalli', properties: 29, views: 3456, leads: 156, avgPrice: '₹72L' },
    { locality: 'Indiranagar', properties: 24, views: 2987, leads: 134, avgPrice: '₹1.2Cr' },
  ],
  propertyStatus: [
    { status: 'Active', count: 156, percentage: 45 },
    { status: 'Under Offer', count: 67, percentage: 19 },
    { status: 'Sold', count: 89, percentage: 26 },
    { status: 'Off Market', count: 35, percentage: 10 },
  ],
  dailyViews: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    views: Math.floor(Math.random() * 500) + 600,
    leads: Math.floor(Math.random() * 30) + 40,
  })),
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  // In production, filter data based on date range
  // For now, return all mock data
  const response = {
    success: true,
    data: {
      ...MOCK_ANALYTICS,
      range,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}

// POST endpoint for tracking events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, properties } = body;

    // Validate event payload
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Validate the event against allowed event types
    // 2. Store the event in analytics database
    // 3. Trigger real-time updates if needed
    // 4. Send to analytics services (Google Analytics, Mixpanel, etc.)

    console.log(`[Analytics] Event tracked: ${event}`, properties);

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
