'use client';

import { RootPage } from '@payloadcms/next/views';
import { importMap } from '@/app/importMap';

type ClientPageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
};

// Note: Client component uses dynamic import for config
export const ClientPage = (props: ClientPageProps) =>
  RootPage({
    ...props,
    config: import('../../../../../payload.config').then(m => m.default),
    importMap,
  });
