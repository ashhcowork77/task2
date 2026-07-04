import { NextRequest, NextResponse } from 'next/server';
import { parseCsv, buildHeaderMap, validateRow } from '@/lib/csv-parser';

/**
 * POST /api/properties/bulk-import
 * Accepts a CSV file upload and validates property data.
 * Returns parsed results with row-level errors for review before committing.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvText = await file.text();
    const rows = parseCsv(csvText);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV file is empty or has no data rows' },
        { status: 400 },
      );
    }

    const headers = Object.keys(rows[0]);
    const headerMap = buildHeaderMap(headers);

    const parsed = rows.map((row, idx) =>
      validateRow(row, headerMap, idx + 1), // row numbers are 1-indexed
    );

    const valid = parsed.filter((r) => r.status === 'valid');
    const warnings = parsed.filter((r) => r.status === 'warning');
    const errors = parsed.filter((r) => r.status === 'error');

    return NextResponse.json({
      summary: {
        total: rows.length,
        valid: valid.length,
        warnings: warnings.length,
        errors: errors.length,
      },
      rows: parsed,
      headerMap,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[BulkImport] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/properties/bulk-import
 * Returns a downloadable CSV template.
 */
export async function GET() {
  const { generateCsvTemplate } = await import('@/lib/csv-parser');
  const template = generateCsvTemplate();

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="property_import_template.csv"',
    },
  });
}
