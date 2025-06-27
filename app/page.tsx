// app/page.tsx

// Импорт типов и утилит
import type { ServiceMetadata } from '@lib/getServices';
import { getServiceSlugs } from '@lib/getServices';

// Импорт компонентов
import PromoBlock from 'app/components/PromoBlock';
import PageHeader from 'app/components/PageHeader';
import ServiceList from 'app/components/ServiceList';

// Интерфейс для объекта услуги
interface Service {
  slug: string;
  metadata: ServiceMetadata & { order: number };
}

// Асинхронная функция для получения и сортировки всех услуг
async function getServices(): Promise<Service[]> {
  const slugs = getServiceSlugs();

  const services = await Promise.all(
    slugs.map(async slug => {
      const serviceModule = await import(`./services-data/${slug}`);
      const order = serviceModule.metadata.order ?? Infinity;
      return {
        slug,
        metadata: { ...serviceModule.metadata, order },
      };
    })
  );

  return services.sort((a, b) => a.metadata.order - b.metadata.order);
}

// Компонент главной страницы
export default async function HomePage() {
  const services = await getServices();

  return (
    <section className="baseText">
      <PageHeader />

      {/* Вместо статического списка, вставляем наш анимированный компонент */}
      <ServiceList services={services} />
      <PromoBlock />
    </section>
  );
}
