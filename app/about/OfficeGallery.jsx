// app/about/OfficeGallery.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './OfficeGallery.module.css';
import { useSwipeable } from 'react-swipeable';

export default function OfficeGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  // 1. Новий стан для відстеження зуму
  const [isZoomed, setIsZoomed] = useState(false);

  // --- Функції для управління станом ---

  const openModal = index => {
    setSelectedIndex(index);
    setIsZoomed(false); // Скидаємо зум при відкритті нового фото
  };

  const closeModal = () => {
    setSelectedIndex(null);
    setIsZoomed(false); // Скидаємо зум при закритті
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setIsZoomed(false); // Скидаємо зум при переході
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setIsZoomed(false); // Скидаємо зум при переході
  };

  // 2. Функція для зуму по кліку на фото
  const handleImageClick = e => {
    e.stopPropagation(); // Не даємо кліку "спливти" до оверлея, щоб не закрити вікно
    setIsZoomed(prev => !prev);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
    preventScrollOnSwipe: true,
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
        <div {...handlers} className={styles.modalOverlay} onClick={closeModal}>
          {/* 3. Хрестик для закриття */}
          <button
            className={styles.closeButton}
            onClick={e => {
              e.stopPropagation();
              closeModal();
            }}
          >
            &times;
          </button>

          {/* Кнопки навігації для десктопу */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            &#10094;
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
          >
            &#10095;
          </button>

          {/* 4. Контейнер для зображення, щоб зум працював коректно */}
          <div className={styles.imageContainer} onClick={handleImageClick}>
            <Image
              src={`/images/office/${images[selectedIndex]}`}
              alt={`Фото кабінету ${selectedIndex + 1}`}
              width={1200}
              height={900}
              // 5. Динамічні класи для зображення
              className={`${styles.modalImage} ${isZoomed ? styles.zoomedImage : ''}`}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
