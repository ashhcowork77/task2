/**
 * Performance monitoring utilities for Core Web Vitals tracking
 * Provides LCP, FID, CLS, and INP measurement helpers
 */

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  inp?: number;
  fcp?: number;
  ttfb?: number;
}

interface NavigationTiming {
  dns: number;
  tcp: number;
  ttfb: number;
  download: number;
  domLoad: number;
  windowLoad: number;
}

type MetricCallback = (metric: PerformanceEntry) => void;

/**
 * Get navigation timing breakdown
 */
export function getNavigationTiming(): NavigationTiming | null {
  if (typeof window === 'undefined' || !window.performance) return null;

  const [nav] = performance.getEntriesByType('navigation');
  if (!nav || !(nav instanceof PerformanceNavigationTiming)) return null;

  return {
    dns: nav.domainLookupEnd - nav.domainLookupStart,
    tcp: nav.connectEnd - nav.connectStart,
    ttfb: nav.responseStart - nav.requestStart,
    download: nav.responseEnd - nav.responseStart,
    domLoad: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
    windowLoad: nav.loadEventEnd - nav.loadEventStart,
  };
}

/**
 * Get resource timing for a specific resource
 */
export function getResourceTiming(urlPattern: string): PerformanceResourceTiming[] {
  if (typeof window === 'undefined' || !window.performance) return [];

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  return resources.filter(resource => resource.name.includes(urlPattern));
}

/**
 * Calculate Largest Contentful Paint (LCP) timing
 */
export function observeLCP(callback: MetricCallback): () => void {
  if (typeof window === 'undefined') return () => {};

  // Use PerformanceObserver if available
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      callback(lastEntry);
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      return () => observer.disconnect();
    } catch {
      // Fallback for unsupported type
      console.warn('LCP observation not supported');
      return () => {};
    }
  }

  return () => {};
}

/**
 * Calculate First Input Delay (FID)
 */
export function observeFID(callback: MetricCallback): () => void {
  if (typeof window === 'undefined') return () => {};

  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // FID is the duration of the first input delay
        callback(entry);
      }
    });

    try {
      observer.observe({ type: 'first-input', buffered: true });
      return () => observer.disconnect();
    } catch {
      console.warn('FID observation not supported');
      return () => {};
    }
  }

  return () => {};
}

/**
 * Calculate Cumulative Layout Shift (CLS)
 */
export function observeCLS(callback: MetricCallback): () => void {
  if (typeof window === 'undefined') return () => {};

  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    let clsEntries: LayoutShift[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as LayoutShift;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
          clsEntries.push(layoutShift);
          callback(entry);
        }
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
      return () => observer.disconnect();
    } catch {
      console.warn('CLS observation not supported');
      return () => {};
    }
  }

  return () => {};
}

/**
 * Get INP (Interaction to Next Paint) observation
 * Note: INP replaced FID in 2024
 */
export function observeINP(callback: MetricCallback): () => void {
  if (typeof window === 'undefined') return () => {};

  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only report interactions with high waiting duration
        const inpEntry = entry as InteractionID;
        if (inpEntry.interactionId > 0) {
          callback(entry);
        }
      }
    });

    try {
      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      return () => observer.disconnect();
    } catch {
      // Fallback to FID observation
      return observeFID(callback);
    }
  }

  return () => {};
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(): void {
  if (typeof window === 'undefined') return;

  // LCP
  observeLCP((entry) => {
    console.log('[Web Vitals] LCP:', entry.startTime);
    sendToAnalytics('LCP', entry.startTime);
  });

  // FID
  observeFID((entry) => {
    const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
    console.log('[Web Vitals] FID:', fid);
    sendToAnalytics('FID', fid);
  });

  // CLS
  observeCLS((entry) => {
    const cls = (entry as LayoutShift).value;
    console.log('[Web Vitals] CLS:', cls);
    sendToAnalytics('CLS', cls);
  });

  // Navigation timing
  const timing = getNavigationTiming();
  if (timing) {
    console.log('[Performance] Navigation timing:', timing);
  }
}

/**
 * Send metric to analytics endpoint
 */
function sendToAnalytics(name: string, value: number): void {
  // In production, send to your analytics service
  if (navigator.sendBeacon) {
    const body = JSON.stringify({
      name,
      value,
      rating: getRating(name, value),
      delta: value,
      id: `${name}-${Date.now()}`,
      page: window.location.pathname,
    });
    navigator.sendBeacon('/api/analytics', body);
  }
}

/**
 * Get rating based on Core Web Vitals thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
    case 'INP':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function createLazyLoadImage(
  imgElement: HTMLImageElement,
  options: {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number;
  } = {}
): () => void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load immediately
    imgElement.src = imgElement.dataset.src || '';
    return () => {};
  }

  const { root = null, rootMargin = '50px', threshold = 0.1 } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          observer.unobserve(img);
        }
      });
    },
    { root, rootMargin, threshold }
  );

  observer.observe(imgElement);

  return () => observer.disconnect();
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  as: 'font' | 'image' | 'script' | 'style' | 'fetch',
  options?: { type?: string; crossOrigin?: string }
): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (options?.type) link.type = options.type;
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin;

  document.head.appendChild(link);
}

/**
 * Prefetch resources for likely navigation
 */
export function prefetchPage(url: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'document';

  document.head.appendChild(link);
}

/**
 * Defer non-critical scripts
 */
export function deferScript(src: string, onLoad?: () => void): void {
  if (typeof document === 'undefined') return;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;

  if (onLoad) {
    script.onload = onLoad;
  }

  document.head.appendChild(script);
}

/**
 * Measure React component render performance
 */
export function measureRender(
  componentName: string,
  startTime: number
): void {
  if (typeof window === 'undefined') return;

  const duration = performance.now() - startTime;

  if (duration > 50) {
    console.warn(`[Performance] ${componentName} took ${duration.toFixed(2)}ms to render`);
    sendToAnalytics(`${componentName}_render`, duration);
  }
}

/**
 * Create a high-priority image loading strategy
 */
export function priorityLoadImage(
  src: string,
  options?: {
    alt?: string;
    sizes?: string;
    srcset?: string;
    className?: string;
  }
): HTMLImageElement {
  const img = new Image();

  if (options?.alt) img.alt = options.alt;
  if (options?.sizes) img.sizes = options.sizes;
  if (options?.srcset) img.srcset = options.srcset;
  if (options?.className) img.className = options.className;

  // Use fetchpriority for modern browsers
  if ('fetchPriority' in img) {
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
  }

  img.src = src;

  return img;
}

/**
 * Get all performance metrics
 */
export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  if (typeof window === 'undefined') return {};

  const metrics: PerformanceMetrics = {};

  // Get timing from Navigation API
  const [nav] = performance.getEntriesByType('navigation');
  if (nav) {
    const navTiming = nav as PerformanceNavigationTiming;
    metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
  }

  // Get LCP
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint') as LargestContentfulPaint[];
  if (lcpEntries.length > 0) {
    metrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
  }

  return metrics;
}
