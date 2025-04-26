import { notFound } from 'next/navigation';
import SeoText from '@components/SeoText';
import type { ServiceMetadata } from '@lib/getServices';

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getServiceBySlug(slug: string) {
  try {
    const serviceModule = await import(`../../services-data/${slug}`);
    return {
      slug,
      metadata: serviceModule.metadata as ServiceMetadata,
      Component: serviceModule.default as React.FC,
    };
  } catch {
    return null;
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return notFound();

  return (
    <section className="baseText">
      <service.Component />
      <SeoText slug={slug} />
    </section>
  );
}
