import type { CollectionConfig } from 'payload';

/**
 * Media collection for image uploads
 *
 * Uses Payload built-in upload functionality with local filesystem storage.
 * Generates multiple image sizes for different use cases.
 *
 * @see D-10: Media collection using Payload built-in upload
 * @see D-14: Local filesystem for MVP (./public/media)
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
    description: 'Upload images for your website. Accepted formats: JPEG, PNG, WebP, GIF. Maximum file size varies by server config.',
  },
  upload: {
    // Local filesystem storage for MVP
    staticDir: 'public/media',
    // Generate multiple image sizes for different use cases
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'small',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1280,
        height: 720,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'card',
    // Restrict to safe image formats only (no SVG for XSS prevention)
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        label: 'Alt Text',
        description: 'Describe the image for screen readers and SEO. This text appears if the image cannot load.',
        placeholder: 'e.g., Beachfront villa with sunset view',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        label: 'Caption',
        description: 'Optional caption displayed below the image. Useful for photo credits or additional context.',
        placeholder: 'e.g., Photo by John Doe',
      },
    },
  ],
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
};
