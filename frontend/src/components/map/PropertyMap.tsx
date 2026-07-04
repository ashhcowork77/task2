'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl/maplibre';
import type { MapMouseEvent, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

import {
  DEFAULT_MAP_CONFIG,
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  MARKER_COLOR,
  PROPERTY_SOURCE_ID,
  PROPERTY_LAYER_CLUSTERS,
  PROPERTY_LAYER_CLUSTER_COUNT,
  PROPERTY_LAYER_UNCLUSTERED,
  PropertyMarkerProperties,
} from '@/lib/map/mapConfig';
import { PropertyPopup } from './PropertyPopup';
import { MapSkeleton } from './MapSkeleton';
import { MapPin } from 'lucide-react';

interface PropertyWithLocation {
  id: string;
  title: string;
  nightlyPrice: number;
  currency: string;
  geolocation: { lat: number; lng: number };
  featuredImage?: { url: string };
}

interface PropertyMapProps {
  properties: PropertyWithLocation[];
  className?: string;
  onPropertyClick?: (propertyId: string) => void;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

/**
 * Main Property Map component with markers and clustering
 * Uses MapLibre GL with react-map-gl for React integration
 */
export function PropertyMap({
  properties,
  className = '',
  onPropertyClick,
  initialViewState,
}: PropertyMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithLocation | null>(null);
  const [viewState, setViewState] = useState({
    longitude: initialViewState?.longitude ?? DEFAULT_MAP_CONFIG.center[0],
    latitude: initialViewState?.latitude ?? DEFAULT_MAP_CONFIG.center[1],
    zoom: initialViewState?.zoom ?? DEFAULT_MAP_CONFIG.zoom,
  });

  // Convert properties to GeoJSON
  const geojsonData = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: properties.map((prop) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [prop.geolocation.lng, prop.geolocation.lat],
        },
        properties: {
          id: prop.id,
          title: prop.title,
          price: prop.nightlyPrice,
          currency: prop.currency,
          imageUrl: prop.featuredImage?.url,
        } as PropertyMarkerProperties,
      })),
    };
  }, [properties]);

  // Calculate initial center from properties
  useEffect(() => {
    if (properties.length > 0 && !initialViewState) {
      const avgLat = properties.reduce((sum, p) => sum + p.geolocation.lat, 0) / properties.length;
      const avgLng = properties.reduce((sum, p) => sum + p.geolocation.lng, 0) / properties.length;
      setViewState((prev) => ({
        ...prev,
        latitude: avgLat,
        longitude: avgLng,
      }));
    }
  }, [properties, initialViewState]);

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const features = event.features;
      if (!features || features.length === 0) return;

      const feature = features[0];

      // Get the map instance to use getClusterExpansionZoom
      const map = event.target;

      // Check if clicked on cluster
      if ('point_count' in feature.properties && feature.properties.point_count) {
        const clusterId = feature.properties.cluster_id as number;
        const source = map.getSource(PROPERTY_SOURCE_ID) as maplibregl.GeoJSONSource;

        if (source && typeof source.getClusterExpansionZoom === 'function') {
          // MapLibre v5 uses Promise-based API
          source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
            const geometry = feature.geometry as GeoJSON.Point;
            setViewState({
              longitude: geometry.coordinates[0],
              latitude: geometry.coordinates[1],
              zoom: zoom,
            });
          }).catch(() => {
            // Fallback: zoom in by 2 levels
            setViewState((prev) => ({ ...prev, zoom: prev.zoom + 2 }));
          });
        }
        return;
      }

      // Clicked on individual property marker
      const props = feature.properties as PropertyMarkerProperties | null;
      if (props && props.id) {
        const property = properties.find((p) => p.id === props.id);
        if (property) {
          setSelectedProperty(property);
        }
      }
    },
    [properties]
  );

  if (properties.length === 0) {
    return (
      <div className={`w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No properties to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[500px] rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && <MapSkeleton height="h-full" />}
      <Map
        {...viewState}
        onMove={handleViewStateChange}
        onLoad={() => setIsLoaded(true)}
        onClick={handleClick}
        mapStyle={DEFAULT_MAP_CONFIG.style}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={[PROPERTY_LAYER_CLUSTERS, PROPERTY_LAYER_UNCLUSTERED]}
      >
        <NavigationControl position="top-right" />

        <Source
          id={PROPERTY_SOURCE_ID}
          type="geojson"
          data={geojsonData}
          cluster={true}
          clusterMaxZoom={CLUSTER_MAX_ZOOM}
          clusterRadius={CLUSTER_RADIUS}
        >
          {/* Cluster circles */}
          <Layer
            id={PROPERTY_LAYER_CLUSTERS}
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': MARKER_COLOR,
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20, // size when count < 10
                10,
                25, // size when count < 50
                50,
                30, // size when count >= 100
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            }}
          />

          {/* Cluster count */}
          <Layer
            id={PROPERTY_LAYER_CLUSTER_COUNT}
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['Open Sans Bold'],
              'text-size': 12,
            }}
            paint={{
              'text-color': '#ffffff',
            }}
          />

          {/* Individual property markers */}
          <Layer
            id={PROPERTY_LAYER_UNCLUSTERED}
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': MARKER_COLOR,
              'circle-radius': 8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            }}
          />
        </Source>

        {/* Property Popup */}
        {selectedProperty && (
          <Popup
            longitude={selectedProperty.geolocation.lng}
            latitude={selectedProperty.geolocation.lat}
            anchor="bottom"
            onClose={() => setSelectedProperty(null)}
            closeOnClick={false}
            offset={15}
          >
            <PropertyPopup
              property={selectedProperty}
              onViewDetails={() => {
                onPropertyClick?.(selectedProperty.id);
                setSelectedProperty(null);
              }}
            />
          </Popup>
        )}
      </Map>

      {/* Property count badge */}
      <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-gray-700">
        {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
      </div>
    </div>
  );
}
