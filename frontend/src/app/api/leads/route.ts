import { NextResponse } from 'next/server';

// Mock leads data - in production this would query Payload CMS
const MOCK_LEADS = [
  {
    id: 'lead-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    source: 'property_inquiry',
    status: 'qualified',
    type: 'buyer',
    propertyReference: '3BHK Villa in Whitefield',
    message: 'Looking for a spacious 3BHK villa in Whitefield with modern amenities.',
    budget: '₹1.5Cr - ₹2Cr',
    timeline: '1-3 months',
    assignedTo: 'Agent 1',
    createdAt: '2024-01-15T10:30:00Z',
    lastContact: '2024-01-18T14:00:00Z',
  },
  {
    id: 'lead-002',
    name: 'Rahul Mehta',
    email: 'rahul.m@company.com',
    phone: '+91 87654 32109',
    source: 'whatsapp',
    status: 'site_visit',
    type: 'investor',
    propertyReference: 'Commercial Space in HSR Layout',
    message: 'Looking for commercial property investment options with good rental yield.',
    budget: '₹50L - ₹80L',
    timeline: 'Immediately',
    assignedTo: 'Agent 2',
    createdAt: '2024-01-14T16:45:00Z',
    lastContact: '2024-01-19T11:30:00Z',
  },
  {
    id: 'lead-003',
    name: 'Ananya Gupta',
    email: 'ananya.g@email.com',
    phone: '+91 76543 21098',
    source: 'call',
    status: 'new',
    type: 'tenant',
    propertyReference: '2BHK Apartment near Electronic City',
    message: 'Need a 2BHK apartment for family of 4 near Electronic City.',
    budget: '₹20K - ₹30K/month',
    timeline: 'This month',
    createdAt: '2024-01-20T08:15:00Z',
  },
  {
    id: 'lead-004',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 65432 10987',
    source: 'callback_request',
    status: 'contacted',
    type: 'seller',
    propertyReference: 'Plot in Sarjapur Road',
    message: 'Want to sell a 2400 sqft residential plot.',
    budget: '₹85L',
    timeline: '3-6 months',
    assignedTo: 'Agent 1',
    createdAt: '2024-01-13T12:00:00Z',
    lastContact: '2024-01-17T10:00:00Z',
  },
  {
    id: 'lead-005',
    name: 'Kavitha Nair',
    email: 'kavitha.nair@email.com',
    phone: '+91 54321 09876',
    source: 'organic',
    status: 'negotiation',
    type: 'buyer',
    propertyReference: '4BHK Penthouse in Indiranagar',
    message: 'Interested in premium penthouse properties in Indiranagar.',
    budget: '₹3Cr+',
    timeline: 'Immediately',
    assignedTo: 'Agent 3',
    createdAt: '2024-01-10T09:30:00Z',
    lastContact: '2024-01-20T15:00:00Z',
  },
  {
    id: 'lead-006',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@email.com',
    phone: '+91 43210 98765',
    source: 'referral',
    status: 'closed_won',
    type: 'buyer',
    propertyReference: '3BHK Apartment in Koramangala',
    message: 'Referred by existing client. Looking for 3BHK in Koramangala.',
    budget: '₹1.2Cr',
    timeline: '1-3 months',
    assignedTo: 'Agent 2',
    createdAt: '2024-01-05T14:20:00Z',
    lastContact: '2024-01-19T16:00:00Z',
  },
];

// GET /api/leads - List leads with optional filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse filter parameters
  const status = searchParams.get('status');
  const source = searchParams.get('source');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filteredLeads = [...MOCK_LEADS];

  // Apply filters
  if (status) {
    filteredLeads = filteredLeads.filter(lead => lead.status === status);
  }
  if (source) {
    filteredLeads = filteredLeads.filter(lead => lead.source === source);
  }
  if (type) {
    filteredLeads = filteredLeads.filter(lead => lead.type === type);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredLeads = filteredLeads.filter(lead =>
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone.includes(search)
    );
  }

  // Pagination
  const totalDocs = filteredLeads.length;
  const totalPages = Math.ceil(totalDocs / limit);
  const startIndex = (page - 1) * limit;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: {
      docs: paginatedLeads,
      totalDocs,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

// POST /api/leads - Create a new lead
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Create new lead
    const newLead = {
      id: `lead-${Date.now()}`,
      ...body,
      status: body.status || 'new',
      source: body.source || 'organic',
      createdAt: new Date().toISOString(),
      lastContact: null,
    };

    console.log('[API] New lead created:', newLead);

    // In production, this would:
    // 1. Save to Payload CMS
    // 2. Trigger notifications (email, Slack, etc.)
    // 3. Route to appropriate agent
    // 4. Track in analytics

    return NextResponse.json({
      success: true,
      data: newLead,
      message: 'Lead created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create lead',
      },
      { status: 500 }
    );
  }
}

// PUT /api/leads - Update a lead
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead ID is required',
        },
        { status: 400 }
      );
    }

    // In production, this would update in Payload CMS
    const updatedLead = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    console.log('[API] Lead updated:', updatedLead);

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('[API] Error updating lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update lead',
      },
      { status: 500 }
    );
  }
}
