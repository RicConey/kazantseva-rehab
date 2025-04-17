'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CertificateGallery.module.css';

export default function CertificateGallery({ certs }) {
  const [selected, setSelected] = useState(null);

  const openModal = src => setSelected(src);
  const closeModal = () => setSelected(null);

  return (
    <>
      <div className={styles.galleryContainer}>
        {certs.map((file, i) => (
          <Image
            key={i}
            src={`/certificates/${file}`}
            alt={`Сертифікат ${i + 1}`}
            width={600}
            height={847}
            className={styles.certImage}
            onClick={() => openModal(`/certificates/${file}`)}
            priority={i < 2} /* первые 2 сертифікати впливають на LCP */
          />
        ))}
      </div>

      {selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <Image
            src={selected}
            alt="Сертифікат"
            fill
            className={styles.modalImage}
            sizes="(max-width: 768px) 90vw, 60vw"
          />
        </div>
      )}
    </>
  );
}
