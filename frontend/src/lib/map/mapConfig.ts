/**
 * MapLibre configuration
 * Using demotiles for free, no-API-key tiles
 */

// Map style URL - demotiles.maplibre.org provides free tiles
export const MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';

// Default map center (Bangalore, India - demo client location)
export const DEFAULT_CENTER: [number, number] = [77.5946, 12.9716];

// Default zoom level
export const DEFAULT_ZOOM = 11;

// Clustering configuration
export const CLUSTER_MAX_ZOOM = 14;
export const CLUSTER_RADIUS = 50;

// Marker colors
export const MARKER_COLOR = '#3B82F6'; // Blue-500
export const CLUSTER_COLOR = '#1D4ED8'; // Blue-700
export const CLUSTER_TEXT_COLOR = '#ffffff';

// Default map configuration
export const DEFAULT_MAP_CONFIG = {
  style: MAP_STYLE_URL,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  attributionControl: false,
};

// Source and layer IDs
export const PROPERTY_SOURCE_ID = 'properties';

// Layer IDs
export const PROPERTY_LAYER_CLUSTERS = 'clusters';
export const PROPERTY_LAYER_CLUSTER_COUNT = 'cluster-count';
export const PROPERTY_LAYER_UNCLUSTERED = 'unclustered-point';

/**
 * GeoJSON feature properties for property markers
 */
export interface PropertyMarkerProperties {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string;
}
