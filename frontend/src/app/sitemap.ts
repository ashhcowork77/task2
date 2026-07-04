import type { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation
 * Generates URLs for search engine indexing including:
 * - Static pages
 * - Property pages (/properties/[slug])
 * - Agent pages (/agents and /agents/profile/[slug])
 * - Locality pages (/property-in/[locality])
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://notjustastay.com';
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/property-in`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
  ];

  // Property URLs (in production, fetch from Payload CMS)
  const propertyUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/properties/cozy-beachside-apartment`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties/mountain-view-villa`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties/urban-studio-apartment`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Agent profile URLs (in production, fetch from Payload CMS)
  const agentUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/agents/profile/john-doe`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/profile/jane-smith`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/agents/profile/raj-kumar`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Locality/Location landing page URLs (in production, fetch from CMS)
  const localityUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/property-in/whitefield`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/electronic-city`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/hsr-layout`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/indiranagar`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/koramangala`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/marathahalli`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/sarjapur-road`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/property-in/yelahanka`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.75 },
  ];

  // Demo activity URLs
  const activityUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/activities/sunset-beach-yoga`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/activities/local-cooking-class`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [
    ...staticPages,
    ...propertyUrls,
    ...agentUrls,
    ...localityUrls,
    ...activityUrls,
  ];
}
