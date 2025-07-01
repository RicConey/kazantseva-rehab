// app/about/OfficeGallery.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './OfficeGallery.module.css';
import { useSwipeable } from 'react-swipeable';
import { useDrag } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfficeGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(0);

  // Ссылка теперь нужна только на контейнер
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePopState = () => {
      if (selectedIndex !== null) setSelectedIndex(null);
    };
    if (selectedIndex !== null) window.history.pushState({ modal: true }, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedIndex]);

  const resetState = () => {
    setIsZoomed(false);
    setPan({ x: 0, y: 0 });
  };

  const openModal = index => {
    setSelectedIndex(index);
    resetState();
  };

  const closeModal = () => {
    if (window.history.state?.modal) window.history.back();
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setDirection(1);
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    resetState();
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setDirection(-1);
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    resetState();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isZoomed && handleNext(),
    onSwipedRight: () => !isZoomed && handlePrev(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const bind = useDrag(
    ({ tap, offset: [ox, oy] }) => {
      if (tap) {
        setIsZoomed(prev => !prev);
        setPan({ x: 0, y: 0 });
        return;
      }
      if (isZoomed) setPan({ x: ox, y: oy });
    },
    {
      // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
      bounds: () => {
        if (!isZoomed || !containerRef.current) return {};

        const { width: containerWidth, height: containerHeight } =
          containerRef.current.getBoundingClientRect();

        // Оригинальные пропорции фото кабинета
        const intrinsicWidth = 1200;
        const intrinsicHeight = 900;
        const zoomLevel = 1.5;

        // Рассчитываем отображаемый размер фото (как при object-fit: contain)
        const imageAspectRatio = intrinsicWidth / intrinsicHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let renderedWidth, renderedHeight;

        if (imageAspectRatio > containerAspectRatio) {
          renderedWidth = containerWidth;
          renderedHeight = containerWidth / imageAspectRatio;
        } else {
          renderedHeight = containerHeight;
          renderedWidth = containerHeight * imageAspectRatio;
        }

        const zoomedWidth = renderedWidth * zoomLevel;
        const zoomedHeight = renderedHeight * zoomLevel;

        const xOffset = Math.max(0, (zoomedWidth - containerWidth) / 2);
        const yOffset = Math.max(0, (zoomedHeight - containerHeight) / 2);

        return {
          left: -xOffset,
          right: xOffset,
          top: -yOffset,
          bottom: yOffset,
        };
      },
      rubberband: 0.1,
    }
  );

  const variants = {
    enter: direction => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: direction => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        {images.map((file, i) => (
          <Image
            key={i}
            src={`/images/office/${file}`}
            alt={`Фото кабинета ${i + 1}`}
            width={800}
            height={600}
            className={styles.officeImage}
            onClick={() => openModal(i)}
            priority={i < 3}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className={styles.modalOverlay}
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            {...swipeHandlers}
          >
            <button
              className={styles.closeButton}
              onClick={e => {
                e.stopPropagation();
                closeModal();
              }}
            >
              &times;
            </button>
            {!isZoomed && (
              <>
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
              </>
            )}
            <div className={styles.imageContainer} ref={containerRef}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  className={styles.motionWrapper}
                  key={selectedIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <Image
                    {...bind()}
                    src={`/images/office/${images[selectedIndex]}`}
                    alt={`Фото кабинета ${selectedIndex + 1}`}
                    width={1200}
                    height={900}
                    className={`${styles.modalImage} ${isZoomed ? styles.panning : ''}`}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${isZoomed ? 2.5 : 1})`,
                      cursor: isZoomed ? 'grab' : 'zoom-in',
                    }}
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
