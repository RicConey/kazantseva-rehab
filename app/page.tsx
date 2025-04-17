import type { ServiceMetadata } from '@lib/getServices';
import Link from 'next/link';
import Image from 'next/image';
import PromoBlock from '@components/PromoBlock';
import SeoText from '@components/SeoText';
import styles from './ServicePage.module.css';
import { getServiceSlugs } from '@lib/getServices';

interface Service {
  slug: string;
  metadata: ServiceMetadata & { order: number };
  Component: React.FC;
}

/** Динамически собираем данные всех услуг */
async function getServices(): Promise<Service[]> {
  const slugs = getServiceSlugs();

  const services = await Promise.all(
    slugs.map(async slug => {
      const serviceModule = await import(`./services-data/${slug}`);
      const order = serviceModule.metadata.order ?? Infinity;

      return {
        slug,
        metadata: { ...serviceModule.metadata, order },
        Component: serviceModule.default as React.FC,
      };
    })
  );

  return services.sort((a, b) => a.metadata.order - b.metadata.order);
}

export default async function HomePage() {
  const services = await getServices();

  return (
    <section className="baseText">
      {/* ——— шапка ——— */}
      <div
        className="baseText"
        style={{
          margin: '24px auto',
          maxWidth: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: '1em',
        }}
      >
        <p
          style={{
            fontSize: '1.3rem',
            textTransform: 'uppercase',
            color: '#249B89',
            fontFamily: 'LogoFont',
            marginBottom: 5,
            letterSpacing: 1,
          }}
        >
          Kazantseva Rehabilitation
        </p>
        <p
          style={{
            fontSize: '1.3rem',
            textTransform: 'uppercase',
            color: '#249B89',
            fontFamily: 'LogoFont',
            marginBottom: 5,
            letterSpacing: 1,
          }}
        >
          ваш шлях до здоров'я починається тут
        </p>
      </div>

      {/* ——— вступ ——— */}
      <p className={styles.intro}>
        Шукаєте ефективну реабілітацію, професійний масаж чи комплексний підхід до відновлення
        здоров’я у Вишневому?
      </p>
      <p className={styles.intro}>
        Мене звати{' '}
        <Link href="/about" passHref legacyBehavior>
          <a className={styles.highlight}>Наталія Казанцева</a>
        </Link>
        , і я пропоную широкий спектр послуг, які допоможуть вам повернути активність, гарне
        самопочуття та баланс всього організму.
      </p>

      {/* ——— грід послуг ——— */}
      <ul className={styles.servicesGrid}>
        {services.map(service => (
          <li key={service.slug} className={styles.serviceCard}>
            <Link href={`/services/${service.slug}`} passHref legacyBehavior>
              <a className={styles.serviceLink}>
                {service.metadata.image && (
                  <Image
                    src={service.metadata.image}
                    alt={service.metadata.title}
                    width={600}
                    height={400}
                    className={styles.cardImage}
                    style={{ borderRadius: 2, marginBottom: 2 }}
                  />
                )}
                <h2 className={styles.serviceTitle}>{service.metadata.title}</h2>
                <p className={styles.serviceDescription}>{service.metadata.description}</p>
                <span className={styles.serviceHint}>Дізнатись більше →</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a
          href="/rules"
          style={{
            color: '#249B89',
            fontWeight: 500,
            fontSize: '1.3rem',
            textDecoration: 'underline',
          }}
        >
          Ознайомтесь з правилами відвідування перед записом →
        </a>
      </div>

      <PromoBlock />
      <SeoText slug={undefined} />
    </section>
  );
}
