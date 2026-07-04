/**
 * Indian Land & Area Unit Conversion Utilities
 * Supports: Sq Ft, Sq M, Guntha, Acre, Marla
 */

export type AreaUnit =
  | 'sqft'
  | 'sqm'
  | 'guntha'
  | 'acre'
  | 'marla';

export const AREA_UNITS: Record<AreaUnit, { label: string; shortLabel: string; toSqFt: number }> = {
  sqft:   { label: 'Square Feet',  shortLabel: 'sq ft',  toSqFt: 1 },
  sqm:    { label: 'Square Metres', shortLabel: 'sq m',   toSqFt: 10.7639 },
  guntha: { label: 'Guntha',        shortLabel: 'guntha', toSqFt: 1089 },
  acre:   { label: 'Acres',         shortLabel: 'acre',   toSqFt: 43560 },
  marla:  { label: 'Marla',         shortLabel: 'marla',  toSqFt: 272.25 },
};

/**
 * Convert a value from one area unit to another.
 * Returns null if the input is invalid.
 */
export function convertArea(value: number, from: AreaUnit, to: AreaUnit): number | null {
  if (isNaN(value) || value < 0) return null;
  if (from === to) return value;

  const valueInSqFt = value * AREA_UNITS[from].toSqFt;
  return valueInSqFt / AREA_UNITS[to].toSqFt;
}

/**
 * Convert a value and return a formatted string.
 * Precision is auto-adjusted based on the target unit.
 */
export function formatConversion(
  value: number,
  from: AreaUnit,
  to: AreaUnit,
): string | null {
  const result = convertArea(value, from, to);
  if (result === null) return null;

  // Use more decimals for very small results
  const decimals = result < 1 ? 4 : result < 10 ? 3 : result < 1000 ? 2 : 1;
  return result.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Get all conversions for a given value and unit.
 * Useful for showing a quick-reference conversion table.
 */
export function getAllConversions(value: number, from: AreaUnit): Partial<Record<AreaUnit, string>> {
  const result: Partial<Record<AreaUnit, string>> = {};
  for (const unit of Object.keys(AREA_UNITS) as AreaUnit[]) {
    if (unit === from) continue;
    const formatted = formatConversion(value, from, unit);
    if (formatted !== null) result[unit] = formatted;
  }
  return result;
}
