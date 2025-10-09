// app/prices/page.tsx
export const dynamic = 'force-static';
export const revalidate = false;

import styles from './Prices.module.css';
import PromoBlock from 'app/components/PromoBlock';

// Тип для данных из вашего /api/prices
type PriceItem = {
  id: number;
  service: string;
  duration: string[] | string;
  price: string[] | string;
};

export default async function PricesPage() {
  // Получаем только данные о ценах
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/prices`, {
    next: {
      tags: ['prices'],
    },
  });
  const prices: PriceItem[] = await res.json();

  return (
    <div className="baseText" style={{ padding: '0 0 24px' }}>
      <h1 className={styles.title}>Ціни на послуги</h1>

      {/* ИНФОРМАЦИОННЫЙ БЛОК О ПОВЫШЕНИИ ЦЕН */}
      <div className={styles.infoBlock}>
        <p>
          <strong>Шановні клієнти!</strong>
        </p>
        <p>
          Звертаємо вашу увагу, що з <strong>01.11.2025</strong> відбудеться планове підвищення цін
          на послуги. Дякуємо за розуміння!
        </p>
      </div>
      {/* КОНЕЦ ИНФОРМАЦИОННОГО БЛОКА */}

      <div className={styles.container}>
        <table className={styles.priceTable}>
          <thead>
            <tr>
              <th>№</th>
              <th>Послуга</th>
              <th className={styles.centerAlign}>Хв</th>
              <th>Ціна, грн</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, index) => {
              const durations = Array.isArray(item.duration) ? item.duration : [item.duration];
              const pricesArr = Array.isArray(item.price) ? item.price : [item.price];
              // Логика для правильной "зебры"
              const isEvenGroup = index % 2 === 0;

              return durations.map((dur, i) => (
                <tr key={`${item.id}-${i}`} className={isEvenGroup ? styles.evenRow : ''}>
                  {i === 0 && (
                    <>
                      <td rowSpan={durations.length} className={styles.centerAlign}>
                        {index + 1}
                      </td>
                      <td rowSpan={durations.length}>
                        {/* Просто отображаем название услуги */}
                        {item.service}
                      </td>
                    </>
                  )}
                  <td className={styles.centerAlign}>{dur}</td>
                  <td>{pricesArr[i]}</td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
      <PromoBlock />
    </div>
  );
}
