// app/about/CertificateGallery.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CertificateGallery.module.css';
import { useSwipeable } from 'react-swipeable';
import { useDrag } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CertificateGallery({ certs }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(0);

  const resetState = () => {
    setIsZoomed(false);
    setPan({ x: 0, y: 0 });
  };

  const openModal = index => {
    setSelectedIndex(index);
    resetState();
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setDirection(1);
    const nextIndex = (selectedIndex + 1) % certs.length;
    setSelectedIndex(nextIndex);
    resetState();
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setDirection(-1);
    const prevIndex = (selectedIndex - 1 + certs.length) % certs.length;
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
    ({ tap, movement: [mx, my] }) => {
      if (tap) {
        setIsZoomed(prev => !prev);
        setPan({ x: 0, y: 0 });
        return;
      }
      if (isZoomed) {
        setPan({ x: mx, y: my });
      }
    },
    { from: [pan.x, pan.y] }
  );

  const variants = {
    enter: direction => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: direction => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <>
      <div className={styles.galleryContainer}>
        {certs.map((file, i) => (
          <Image
            key={i}
            src={`/certificates/${file}`}
            alt={`Сертификат ${i + 1}`}
            width={600}
            height={847}
            className={styles.certImage}
            onClick={() => openModal(i)}
            priority={i < 2}
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

            <div className={styles.imageContainer} onClick={e => e.stopPropagation()}>
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
                >
                  <Image
                    {...bind()}
                    src={`/certificates/${certs[selectedIndex]}`}
                    alt={`Сертификат ${selectedIndex + 1}`}
                    width={600}
                    height={847}
                    className={`${styles.modalImage} ${isZoomed ? styles.panning : ''}`}
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${isZoomed ? 2 : 1})`,
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
