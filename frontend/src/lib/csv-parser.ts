/**
 * CSV parsing utilities for bulk property import.
 * Handles field mapping, validation, and transformation.
 */

export interface CsvRow {
  [key: string]: string;
}

export interface PropertyCsvFields {
  title?: string;
  slug?: string;
  verticalType?: string;
  listingIntent?: string;
  description?: string;
  shortDescription?: string;
  city?: string;
  locality?: string;
  bedrooms?: string;
  bathrooms?: string;
  nightlyPrice?: string;
  salePrice?: string;
  monthlyRent?: string;
  currency?: string;
  propertyType?: string;
  furnishingStatus?: string;
  status?: string;
  reraId?: string;
  carpetSqFt?: string;
  builtUpSqFt?: string;
  plotSqFt?: string;
  amenities?: string;
  houseRules?: string;
  latitude?: string;
  longitude?: string;
}

/** Known column name variations for each field */
const FIELD_ALIASES: Record<keyof PropertyCsvFields, string[]> = {
  title: ['title', 'property_title', 'name', 'property name'],
  slug: ['slug', 'url_slug', 'url'],
  verticalType: ['vertical', 'vertical_type', 'type', 'property_type'],
  listingIntent: ['listing_intent', 'intent', 'listing_type', 'purpose'],
  description: ['description', 'desc', 'property_description'],
  shortDescription: ['short_description', 'short_desc', 'tagline', 'subtitle'],
  city: ['city', 'location_city'],
  locality: ['locality', 'neighborhood', 'area', 'location_area'],
  bedrooms: ['bedrooms', 'beds', 'bhk', 'bedrooms_count'],
  bathrooms: ['bathrooms', 'baths', 'bathrooms_count'],
  nightlyPrice: ['nightly_price', 'price', 'rent_per_night', 'price_per_night'],
  salePrice: ['sale_price', 'selling_price', 'price_rs', 'property_price'],
  monthlyRent: ['monthly_rent', 'rent', 'monthly_price'],
  currency: ['currency', 'price_currency'],
  propertyType: ['property_type', 'type_of_property', 'category'],
  furnishingStatus: ['furnishing', 'furnishing_status', 'furnished_status'],
  status: ['status', 'listing_status', 'property_status'],
  reraId: ['rera_id', 'rera', 'registration_id'],
  carpetSqFt: ['carpet_sqft', 'carpet_area'],
  builtUpSqFt: ['built_up_sqft', 'builtup_sqft', 'built_up_area'],
  plotSqFt: ['plot_sqft', 'plot_area', 'land_area'],
  amenities: ['amenities', 'facilities', 'features'],
  houseRules: ['house_rules', 'rules', 'rules_regulations'],
  latitude: ['latitude', 'lat', 'geo_lat'],
  longitude: ['longitude', 'lng', 'lon', 'geo_lng'],
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Map CSV headers to canonical field names */
export function buildHeaderMap(headers: string[]): Record<string, keyof PropertyCsvFields> {
  const headerMap: Record<string, keyof PropertyCsvFields> = {};

  for (const header of headers) {
    const normalized = normalizeHeader(header);

    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (normalized === field || aliases.includes(normalized)) {
        headerMap[header] = field as keyof PropertyCsvFields;
        break;
      }
    }
  }

  return headerMap;
}

/** Parse a CSV string into rows */
export function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length !== headers.length) continue; // skip malformed rows

    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] || '').trim().replace(/^"|"$/g, '');
    });
    rows.push(row);
  }

  return rows;
}

/** Parse a single CSV line handling quoted values */
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface ParsedProperty {
  rowNumber: number;
  data: Partial<PropertyCsvFields>;
  errors: ValidationError[];
  status: 'valid' | 'warning' | 'error';
}

const VALID_VERTICALS = ['airbnb', 'agent', 'builder'];
const VALID_INTENTS = ['short_let', 'sale', 'rent', 'sale_or_rent'];
const VALID_STATUSES = ['draft', 'published', 'archived'];
const VALID_FURNISHING = ['furnished', 'semi_furnished', 'unfurnished'];
const VALID_PROPERTY_TYPES = ['apartment', 'house', 'villa', 'condo', 'farmhouse', 'plot', 'office', 'retail'];

function toNumber(value: string): number | undefined {
  const n = parseFloat(value?.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? undefined : n;
}

function toBool(value: string): boolean {
  return ['yes', 'y', 'true', '1', '1'].includes(value?.toLowerCase());
}

/** Validate a single parsed row */
export function validateRow(
  row: CsvRow,
  headerMap: Record<string, keyof PropertyCsvFields>,
  rowIndex: number,
): ParsedProperty {
  const errors: ValidationError[] = [];
  const data: Partial<PropertyCsvFields> = {};

  const get = (field: keyof PropertyCsvFields): string | undefined => {
    const csvHeader = Object.entries(headerMap).find(([, f]) => f === field)?.[0];
    return csvHeader ? (row[csvHeader] || undefined) : undefined;
  };

  const title = get('title');
  if (!title) {
    errors.push({ row: rowIndex, field: 'title', message: 'Title is required' });
  } else {
    data.title = title;
    // Auto-generate slug from title if not provided
    const providedSlug = get('slug');
    data.slug = providedSlug ? slugify(providedSlug) : slugify(title);
  }

  const nightlyPrice = get('nightlyPrice');
  const salePrice = get('salePrice');
  const monthlyRent = get('monthlyRent');

  if (!nightlyPrice && !salePrice && !monthlyRent) {
    errors.push({
      row: rowIndex,
      field: 'nightlyPrice',
      message: 'At least one of nightlyPrice, salePrice, or monthlyRent is required',
    });
  } else {
    if (nightlyPrice) data.nightlyPrice = nightlyPrice;
    if (salePrice) data.salePrice = salePrice;
    if (monthlyRent) data.monthlyRent = monthlyRent;
  }

  const verticalType = get('verticalType');
  if (verticalType && !VALID_VERTICALS.includes(verticalType.toLowerCase())) {
    errors.push({
      row: rowIndex,
      field: 'verticalType',
      message: `Invalid vertical type "${verticalType}". Must be one of: ${VALID_VERTICALS.join(', ')}`,
      value: verticalType,
    });
  } else if (verticalType) {
    data.verticalType = verticalType.toLowerCase();
  }

  const listingIntent = get('listingIntent');
  if (listingIntent && !VALID_INTENTS.includes(listingIntent.toLowerCase())) {
    errors.push({
      row: rowIndex,
      field: 'listingIntent',
      message: `Invalid listing intent "${listingIntent}". Must be one of: ${VALID_INTENTS.join(', ')}`,
      value: listingIntent,
    });
  } else if (listingIntent) {
    data.listingIntent = listingIntent.toLowerCase();
  }

  const city = get('city');
  if (!city) {
    errors.push({ row: rowIndex, field: 'city', message: 'City is required' });
  } else {
    data.city = city;
  }

  if (get('locality')) data.locality = get('locality')!;
  if (get('bedrooms')) data.bedrooms = get('bedrooms')!;
  if (get('bathrooms')) data.bathrooms = get('bathrooms')!;
  if (get('currency')) data.currency = get('currency')!.toUpperCase();

  const furnishing = get('furnishingStatus');
  if (furnishing && !VALID_FURNISHING.includes(furnishing.toLowerCase())) {
    errors.push({
      row: rowIndex,
      field: 'furnishingStatus',
      message: `Invalid furnishing status "${furnishing}". Must be one of: ${VALID_FURNISHING.join(', ')}`,
      value: furnishing,
    });
  } else if (furnishing) {
    data.furnishingStatus = furnishing.toLowerCase();
  }

  const propType = get('propertyType');
  if (propType && !VALID_PROPERTY_TYPES.includes(propType.toLowerCase())) {
    errors.push({
      row: rowIndex,
      field: 'propertyType',
      message: `Invalid property type "${propType}". Must be one of: ${VALID_PROPERTY_TYPES.join(', ')}`,
      value: propType,
    });
  } else if (propType) {
    data.propertyType = propType.toLowerCase();
  }

  if (get('description')) data.description = get('description')!;
  if (get('shortDescription')) data.shortDescription = get('shortDescription')!;
  if (get('reraId')) data.reraId = get('reraId')!;
  if (get('carpetSqFt')) data.carpetSqFt = get('carpetSqFt')!;
  if (get('builtUpSqFt')) data.builtUpSqFt = get('builtUpSqFt')!;
  if (get('plotSqFt')) data.plotSqFt = get('plotSqFt')!;
  if (get('amenities')) data.amenities = get('amenities')!;
  if (get('houseRules')) data.houseRules = get('houseRules')!;

  const lat = get('latitude');
  const lng = get('longitude');
  if ((lat && !lng) || (lng && !lat)) {
    errors.push({
      row: rowIndex,
      field: 'geolocation',
      message: 'Both latitude and longitude are required for geolocation',
    });
  } else if (lat && lng) {
    data.latitude = lat;
    data.longitude = lng;
  }

  const status = get('status');
  if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
    errors.push({
      row: rowIndex,
      field: 'status',
      message: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(', ')}`,
      value: status,
    });
  } else if (status) {
    data.status = status.toLowerCase();
  }

  return {
    rowNumber: rowIndex,
    data,
    errors,
    status: errors.length === 0 ? 'valid' : errors.filter((e) => e.message.includes('required')).length > 0 ? 'error' : 'warning',
  };
}

/** Generate the CSV template with all headers */
export function generateCsvTemplate(): string {
  const headers = [
    'title',
    'slug',
    'verticalType',
    'listingIntent',
    'description',
    'shortDescription',
    'city',
    'locality',
    'bedrooms',
    'bathrooms',
    'nightlyPrice',
    'salePrice',
    'monthlyRent',
    'currency',
    'propertyType',
    'furnishingStatus',
    'status',
    'reraId',
    'carpetSqFt',
    'builtUpSqFt',
    'plotSqFt',
    'amenities',
    'houseRules',
    'latitude',
    'longitude',
  ];

  const example = [
    'Beautiful 3BHK Apartment',
    'beautiful-3bhk-apartment',
    'agent',
    'sale',
    'A spacious 3-bedroom apartment with modern amenities',
    'Spacious 3BHK near city center',
    'Mumbai',
    'Bandra',
    '3',
    '2',
    '',
    '15000000',
    '',
    'INR',
    'apartment',
    'furnished',
    'draft',
    'RERA1234567890',
    '1200',
    '1450',
    '',
    'wifi,parking,pool',
    'No smoking, no pets',
    '19.0760',
    '72.8777',
  ];

  return [headers.join(','), example.join(',')].join('\n');
}
