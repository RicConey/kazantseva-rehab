// app/components/ServiceLayout.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ServiceLayout.module.css';

// Этот компонент будет оберткой для контента каждой услуги
export default function ServiceLayout({ metadata, children }) {
  return (
    <div className={styles.layoutContainer}>
      {/* --- Блок 1: Герой (Изображение + Заголовок) --- */}
      <div className={styles.heroSection}>
        <Image
          src={metadata.image}
          alt={metadata.title}
          layout="fill"
          objectFit="cover"
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>{metadata.title}</h1>
          <p className={styles.mainDescription}>{metadata.description}</p>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* --- Блок 2: Вступление и основное описание --- */}
        <div className={styles.mainContent}>{children}</div>

        {/* --- Блок 3: Призыв к действию --- */}
        <div className={styles.ctaSection}>
          <p>{metadata.ctaText || 'Готові відчути полегшення та повернути свободу рухів?'}</p>
          <Link href="/prices" className={styles.ctaButton}>
            Переглянути ціни та записатись
          </Link>
        </div>
      </div>
    </div>
  );
}
