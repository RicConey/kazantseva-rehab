"use client";

import { useState } from "react";
import styles from "./CertificateGallery.module.css";

export default function CertificateGallery({ certs }) {
    const [selected, setSelected] = useState(null);

    const openModal = (src) => setSelected(src);
    const closeModal = () => setSelected(null);

    return (
        <>
            <div className={styles.galleryContainer}>
                {certs.map((file, i) => (
                    <img
                        key={i}
                        src={`/certificates/${file}`}
                        alt={`Сертифікат ${i + 1}`}
                        className={styles.certImage}
                        onClick={() => openModal(`/certificates/${file}`)}
                    />
                ))}
            </div>

            {selected && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <img src={selected} alt="Сертифікат" className={styles.modalImage} />
                </div>
            )}
        </>
    );
}
