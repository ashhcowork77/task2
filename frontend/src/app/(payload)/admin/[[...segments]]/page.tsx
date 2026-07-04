import { RootPage } from '@payloadcms/next/views';
import { importMap } from '@/app/importMap';

type PageProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default async function AdminPage(props: PageProps) {
  return RootPage({
    ...props,
    config: (await import('../../../../../payload.config')).default,
    importMap,
  });
}
