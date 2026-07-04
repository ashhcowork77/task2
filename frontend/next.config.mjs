import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Transpile Payload packages used by the admin route
  transpilePackages: ['@payloadcms/next', '@payloadcms/ui'],

  // Image optimization with formats and sizes
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },

  // Webpack configuration for performance
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize chunk splitting for client bundles
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default withPayload(nextConfig);
