// app/prices/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import styles from './Prices.module.css';
import PromoBlock from '@components/PromoBlock';
import SeoText from '@components/SeoText';

type PriceItem = {
  id: number;
  service: string;
  duration: string[] | string;
  price: string[] | string;
};

export default async function PricesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/prices`, {
    next: {
      tags: ['prices'],
    },
  });
  const prices: PriceItem[] = await res.json();

  return (
    <div className="baseText" style={{ padding: '0 0 24px' }}>
      <h1 className={styles.title}>Ціни на послуги</h1>

      <div className={styles.container}>
        <table className={styles.priceTable}>
          <thead>
            <tr>
              <th>№</th>
              <th>Послуга</th>
              <th style={{ textAlign: 'center' }}>Хв</th>
              <th>Ціна</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, index) => {
              // Приводим к массивам, чтобы TS понял типы
              const durations = Array.isArray(item.duration) ? item.duration : [item.duration];
              const pricesArr = Array.isArray(item.price) ? item.price : [item.price];

              return durations.map((dur, i) => (
                <tr key={`${item.id}-${i}`}>
                  {i === 0 && (
                    <>
                      <td rowSpan={durations.length}>{index + 1}</td>
                      <td rowSpan={durations.length}>{item.service}</td>
                    </>
                  )}
                  <td style={{ textAlign: 'center' }}>{dur}</td>
                  <td>{pricesArr[i]}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
