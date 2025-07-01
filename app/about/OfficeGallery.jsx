// app/about/OfficeGallery.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './OfficeGallery.module.css';
import { useSwipeable } from 'react-swipeable';

export default function OfficeGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openModal = index => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
  };

  // 2. Налаштовуємо обробники свайпів
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(), // Свайп вліво -> наступне фото
    onSwipedRight: () => handlePrev(), // Свайп вправо -> попереднє фото
    trackMouse: true, // Дозволяє "свайпати" мишкою на комп'ютері для тестування
    preventScrollOnSwipe: true, // Запобігає прокручуванню сторінки під час свайпу
  });

  return (
    <>
      <div className={styles.galleryContainer}>
        {images.map((file, i) => (
          <Image
            key={i}
            src={`/images/office/${file}`}
            alt={`Фото кабінету ${i + 1}`}
            width={800}
            height={600}
            className={styles.officeImage}
            onClick={() => openModal(i)}
            priority={i < 3}
          />
        ))}
      </div>

      {selectedIndex !== null && (
        // 3. "Розгортаємо" обробники свайпів на оверлей
        <div {...handlers} className={styles.modalOverlay} onClick={closeModal}>
          {/* Кнопки залишаються для десктопу */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            &#10094;
          </button>

          <Image
            src={`/images/office/${images[selectedIndex]}`}
            alt={`Фото кабінету ${selectedIndex + 1}`}
            width={1200}
            height={900}
            className={styles.modalImage}
            priority
          />

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
          >
            &#10095;
          </button>
        </div>
      )}
    </>
  );
}
