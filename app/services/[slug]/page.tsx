// app/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getServiceSlugs } from '@lib/getServices';
import type { Metadata } from 'next';

// Тип для 'params' теперь корректный
type PageProps = {
  params: { slug: string };
};

// Генерация метаданных
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params; // await убран
  try {
    const serviceModule = await import(`../../services-data/${slug}`);
    const metadata = serviceModule.metadata;
    return {
      title: `${metadata.title} у Вишневому`,
      description: metadata.description,
      alternates: {
        canonical: `https://kazantseva-rehabilitation.com.ua/services/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Послуга не знайдена',
    };
  }
}

// Генерация статических путей
export async function generateStaticParams() {
  const slugs = getServiceSlugs();
  return slugs.map(slug => ({
    slug,
  }));
}

// Основной компонент страницы
export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = params; // await убран

  try {
    const serviceModule = await import(`../../services-data/${slug}`);
    const ServicePageComponent = serviceModule.default;
    // Мы возвращаем компонент услуги, который уже использует ServiceLayout
    return <ServicePageComponent />;
  } catch (error) {
    return notFound();
  }
}
