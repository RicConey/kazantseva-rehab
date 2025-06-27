// app/components/ServiceLayout.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ServiceLayout.module.css';

// Этот компонент будет оберткой для контента каждой услуги
export default function ServiceLayout({ metadata, children }) {
  // Разделяем дочерние элементы на секции для удобства стилизации
  const content = children.props.children;
  const intro = content.find(c => c.props.mdxType === 'p');
  const sections = content.filter(c => c.props.mdxType === 'h3');
  const indications = content.find(
    c => c.props.children === 'Показання до застосування сухої голки:'
  )?.props.children;
  const benefits = content.find(c => c.props.children === 'Переваги методу сухої голки:')?.props
    .children;

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
          <p>Готові відчути полегшення та повернути свободу рухів?</p>
          <Link href="/prices" className={styles.ctaButton}>
            Переглянути ціни та записатись
          </Link>
        </div>
      </div>
    </div>
  );
}
