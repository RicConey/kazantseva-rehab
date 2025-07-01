// app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CertificateGallery from './CertificateGallery';
import OfficeGallery from './OfficeGallery';
import styles from './About.module.css';
import GoogleReviews from 'app/components/GoogleReviews';

// Иконки для списков
import { FiTarget, FiTool, FiCheckCircle, FiHome } from 'react-icons/fi';

export default function AboutPage() {
  const [showCerts, setShowCerts] = useState(false);
  const [certFiles, setCertFiles] = useState<string[]>([]);

  // 2. Створюємо масив з іменами файлів фото кабінету
  const officeImages = ['office-1.jpg', 'office-2.jpg', 'office-3.jpg'];

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch('/api/certificates');
        const data: string[] = await response.json();
        setCertFiles(data);
      } catch (error) {
        console.error('Помилка завантаження сертифікатів', error);
      }
    }
    fetchCertificates();
  }, []);

  return (
    <section className={`baseText ${styles.pageContainer}`}>
      {/* --- БЛОК 1: ВВЕДЕНИЕ С ФОТО --- */}
      <div className={styles.introSection}>
        <div className={styles.photoWrapper}>
          <Image
            src="/images/natalia-kazantseva.jpg"
            alt="Наталія Казанцева"
            width={250}
            height={250}
            className={styles.profilePhoto}
            priority
          />
        </div>
        <div className={styles.introText}>
          <h1 className={styles.title}>Про мене</h1>
          <p>
            Я, <span className={styles.highcolor}>Наталія Казанцева</span>, спеціаліст з тілесної
            реабілітації, мануальної терапії, остеопатії та лікувального масажу.
            <br />
            Стаж роботи: понад 8 років.
          </p>
          <p>
            Здійснюю прийом у затишному кабінеті у Вишневому, обладнаному для роботи з пацієнтами з
            порушеннями опорно-рухового апарату, соматичними дисфункціями та післяопераційними
            ускладненнями.
          </p>
        </div>
      </div>

      {/* --- БЛОК 2: ДЕТАЛИ (Списки с иконками) --- */}
      <div className={styles.detailsSection}>
        <div className={styles.listColumn}>
          <h2>
            <FiTarget /> Показання
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Хронічний або гострий біль
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Наслідки травм та операцій
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Порушення на тлі стресу
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Обмеження рухливості
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              М’язовий дисбаланс
            </li>
          </ul>
        </div>
        <div className={styles.listColumn}>
          <h2>
            <FiTool /> Методи роботи
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Функціональна діагностика
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Остеопатичні техніки
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Мануальна терапія
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Нейром’язова інтеграція
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Лікувальний масаж
            </li>
          </ul>
        </div>
        <div className={styles.listColumn}>
          <h2>
            <FiCheckCircle /> Принципи роботи
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Індивідуальний підхід
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Перевага м’яких технік
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Робота з причинами
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Стійкий результат
            </li>
            <li className={styles.listItem}>
              <FiCheckCircle className={styles.listIcon} />
              Дотримання стандартів
            </li>
          </ul>
        </div>
      </div>

      {/* --- БЛОК 3: ФОТО КАБІНЕТУ --- */}
      <div className={styles.officeGallerySection}>
        <h2>
          <FiHome /> Мій кабінет
        </h2>
        <OfficeGallery images={officeImages} />
      </div>

      {/* --- БЛОК 4: ОТЗЫВЫ КЛИЕНТОВ --- */}
      <div className={styles.reviewsSection}>
        <GoogleReviews />
      </div>

      {/* --- БЛОК 5: СЕРТИФИКАТЫ --- */}
      <div>
        <div className={styles.certButtonContainer}>
          <button className={styles.certButton} onClick={() => setShowCerts(prev => !prev)}>
            {showCerts ? 'Сховати сертифікати' : 'Показати сертифікати та дипломи'}
          </button>
        </div>
        {showCerts && <CertificateGallery certs={certFiles} />}
      </div>
    </section>
  );
}
