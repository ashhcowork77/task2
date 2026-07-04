import type { Property } from '@/types';

const fallbackVillaImage =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85&auto=format&fit=crop';

const propertyImageMap: Record<string, string> = {
  'villa-solace': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=85&auto=format&fit=crop',
  'villa-solace-pool.jpg': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=85&auto=format&fit=crop',
  'rosa-blanca': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
  'rosa-blanca-exterior.jpg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=85&auto=format&fit=crop',
  'nova-solace': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=85&auto=format&fit=crop',
  'nova-solace-exterior.jpg': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=85&auto=format&fit=crop',
  'luna-blanca': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=85&auto=format&fit=crop',
  'luna-blanca-pool.jpg': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1400&q=85&auto=format&fit=crop',
};

function slugify(value?: string | number | null) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function filenameFromUrl(url?: string | null) {
  if (!url) return '';
  return url.split('/').pop()?.split('?')[0] || '';
}

export function getStableImageUrl(url?: string | null, title?: string | null) {
  const filename = filenameFromUrl(url);
  const titleSlug = slugify(title);

  if (filename && propertyImageMap[filename]) return propertyImageMap[filename];
  if (titleSlug && propertyImageMap[titleSlug]) return propertyImageMap[titleSlug];
  if (url && !url.startsWith('/api/media/file/')) return url;

  return fallbackVillaImage;
}

export function getPropertyImageUrl(property?: Property | null) {
  return getStableImageUrl(property?.featuredImage?.url, property?.title);
}

// ---------------------------------------------------------------------------
// Responsive image helpers
// ---------------------------------------------------------------------------

export type ImageSizeName = 'thumbnail' | 'small' | 'card' | 'large' | 'hero';

export const IMAGE_BREAKPOINTS = [400, 768, 1024, 1280, 1920] as const;

/**
 * Get a srcSet string for a Payload image across all generated sizes.
 * Falls back to the original URL if the file is not a Payload upload.
 */
export function getImageSrcSet(
  url?: string | null,
  sizes?: readonly number[],
): string {
  if (!url || url.startsWith('/api/media/file/')) return '';
  const base = sizes ?? IMAGE_BREAKPOINTS;
  return base
    .map((w) => {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}w=${w} ${w}w`;
    })
    .join(', ');
}

/**
 * Get a specific resized URL for a Payload image.
 */
export function getResizedImageUrl(
  url: string,
  size: ImageSizeName | number,
): string {
  const w = typeof size === 'number' ? size : undefined;
  if (!url.startsWith('/api/media/file/')) {
    if (w) {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}w=${w}`;
    }
    return url;
  }
  const sep = url.includes('?') ? '&' : '?';
  return w ? `${url}${sep}w=${w}` : url;
}

/**
 * Generate a full <img> props object with srcSet and sizes for responsive images.
 */
export function responsiveImageProps(params: {
  url?: string | null;
  alt?: string;
  sizes?: readonly number[];
  quality?: number;
  className?: string;
  priority?: boolean;
  objectFit?: string;
}) {
  const { url, alt = '', sizes: bpSizes, quality = 85, className, priority, objectFit } = params;
  const src = getStableImageUrl(url);

  if (src.startsWith('/api/media/file/')) {
    return {
      src,
      srcSet: getImageSrcSet(url, bpSizes),
      sizes: bpSizes
        ? bpSizes.map((w) => `${w}px`).join(', ')
        : undefined,
      alt,
      className,
      loading: priority ? 'eager' as const : 'lazy' as const,
      fetchPriority: priority ? 'high' as const : undefined,
      style: objectFit ? { objectFit } : undefined,
    };
  }

  return {
    src,
    srcSet: undefined,
    alt,
    className,
    loading: priority ? 'eager' as const : 'lazy' as const,
    fetchPriority: priority ? 'high' as const : undefined,
    style: objectFit ? { objectFit } : undefined,
  };
}
