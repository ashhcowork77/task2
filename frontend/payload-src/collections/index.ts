/**
 * Collections Index
 *
 * Single export point for all Payload CMS collections.
 * Import this in payload.config.ts instead of individual collection files.
 *
 * Collections:
 * - PropertiesStub: Airbnb vertical properties (full-featured)
 * - Leads: Inquiry lead capture
 * - Media: Image uploads with multiple sizes
 * - Accounts: Not Just A Stay branding info
 * - Activities: Airbnb experiences and activities
 */

import { PropertiesStub } from './PropertiesStub';
import { Leads } from './Leads';
import { Media } from './Media';
import { Accounts } from './Accounts';
import { Activities } from './Activities';
import { POICache } from './POICache';
import { Users } from './Users';

/**
 * All collections exported from this module.
 * Used in payload.config.ts buildConfig().
 */
export const collections = [
  Users,
  PropertiesStub,
  Leads,
  Media,
  Accounts,
  Activities,
  POICache,
];

// Re-export individual collections for granular imports
export { PropertiesStub } from './PropertiesStub';
export { Leads } from './Leads';
export { Media } from './Media';
export { Accounts } from './Accounts';
export { Activities } from './Activities';
export { POICache } from './POICache';
export { Users } from './Users';
