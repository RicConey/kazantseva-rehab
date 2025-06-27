// app/components/ServiceList.jsx
'use client'; // <-- Обязательно указываем, что это клиентский компонент

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../ServicePage.module.css'; // Стили берем с главной страницы

// Определяем варианты анимации
const cardVariants = {
  // Начальное состояние (карточка невидима)
  initial: {
    opacity: 0,
    y: 20, // Немного смещена вниз
  },
  // Конечное состояние (карточка появляется)
  animate: {
    opacity: 1,
    y: 0, // Возвращается на свою позицию
    transition: {
      duration: 0.4, // Длительность анимации в секундах
    },
  },
};

export default function ServiceList({ services }) {
  return (
    <ul className={styles.servicesGrid}>
      {services.map((service, index) => (
        // Каждую карточку оборачиваем в анимированный компонент motion.li
        <motion.li
          key={service.slug}
          className={styles.serviceCard}
          variants={cardVariants}
          initial="initial" // Начинаем с начального состояния
          whileInView="animate" // Анимируем, когда карточка появляется в области видимости
          viewport={{
            amount: 0.3, // Анимация начнется, когда 30% карточки видно
          }}
        >
          <Link href={`/services/${service.slug}`} className={styles.serviceLink}>
            {service.metadata.image && (
              <Image
                src={service.metadata.image}
                alt={service.metadata.title}
                width={600}
                height={400}
                className={styles.cardImage}
              />
            )}
            <h2 className={styles.serviceTitle}>{service.metadata.title}</h2>
            <p className={styles.serviceDescription}>{service.metadata.description}</p>
            <span className={styles.serviceHint}>Дізнатись більше →</span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
