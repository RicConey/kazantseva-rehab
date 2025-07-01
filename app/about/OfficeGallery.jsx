// app/about/OfficeGallery.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './OfficeGallery.module.css';

export default function OfficeGallery({ images }) {
  const [selected, setSelected] = useState(null);

  const openModal = src => setSelected(src);
  const closeModal = () => setSelected(null);

  return (
    <>
      <div className={styles.galleryContainer}>
        {images.map((file, i) => (
          <Image
            key={i}
            src={`/images/office/${file}`}
            alt={`Фото кабінету ${i + 1}`}
            width={800} // Ширина може бути іншою
            height={600} // Пропорції для пейзажних фото
            className={styles.officeImage}
            onClick={() => openModal(`/images/office/${file}`)}
            priority={i < 2}
          />
        ))}
      </div>

      {selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <Image
            src={selected}
            alt="Фото кабінету"
            width={1200}
            height={900}
            className={styles.modalImage}
            priority
          />
        </div>
      )}
    </>
  );
}
