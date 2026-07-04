'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from './MapSkeleton';

/**
 * SSR-safe dynamic import wrapper for PropertyMap
 * Prevents hydration mismatches since MapLibre requires browser APIs
 */
const PropertyMapClient = dynamic(
  () => import('./PropertyMap').then((mod) => ({ default: mod.PropertyMap })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

interface PropertyWithLocation {
  id: string;
  title: string;
  nightlyPrice: number;
  currency: string;
  geolocation: { lat: number; lng: number };
  featuredImage?: { url: string };
}

interface MapViewSSRProps {
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
 * SSR-safe map view wrapper
 * Use this component instead of PropertyMap directly
 */
export default function MapViewSSR(props: MapViewSSRProps) {
  return <PropertyMapClient {...props} />;
}
