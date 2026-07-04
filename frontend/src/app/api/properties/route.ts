import { NextRequest, NextResponse } from 'next/server';
import { getPublishedProperties } from '@/lib/data/properties';
import type { FilterState } from '@/lib/stores/filterStore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

  try {
    // Use the demo data from properties.ts
    const results = await getPublishedProperties({ limit, page });

    return NextResponse.json({
      docs: results.docs,
      totalDocs: results.totalDocs,
      page: results.page,
      totalPages: results.totalPages,
      hasNextPage: results.hasNextPage,
      hasPrevPage: results.hasPrevPage,
    });
  } catch (error) {
    console.error('Property search error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
