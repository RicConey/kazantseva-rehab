"use client";

import { useState, useEffect } from "react";
import CertificateGallery from "./CertificateGallery";
import Link from "next/link";
import styles from "./About.module.css";

export default function AboutPage() {
    const [showCerts, setShowCerts] = useState(false);
    const [certFiles, setCertFiles] = useState([]);

    useEffect(() => {
        async function fetchCertificates() {
            try {
                const response = await fetch("/api/certificates");
                const data = await response.json();
                setCertFiles(data);
            } catch (error) {
                console.error("Помилка завантаження сертифікатів", error);
            }
        }
        fetchCertificates();
    }, []);

    return (
        <section className={styles.section}>
            {/* Кнопка "Назад на головну" вверху */}
            <div className={styles.backButtonContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.backButton}>← Назад на головну</a>
                </Link>
            </div>

            <h1 className={styles.title}>Про нас</h1>
            <p>
                <strong>Фахівець Наталія Казанцева</strong> має багаторічний досвід у сфері реабілітації, терапії та
                альтернативної медицини. Її методи базуються на індивідуальному підході до кожного пацієнта, комплексному
                відновленні організму та гармонізації фізичного й емоційного стану.
            </p>
            <p>
                Завдяки постійному вдосконаленню методик і прагненню до високих стандартів лікування, вона допомагає людям
                відновити баланс, зняти хронічні болі та повернути радість життя. Її досвід і професіоналізм підтверджені
                численними відгуками задоволених клієнтів.
            </p>

            {/* Кнопка "Показати сертифікати та дипломи" */}
            <div className={styles.certButtonContainer}>
                <button className={styles.certButton} onClick={() => setShowCerts((prev) => !prev)}>
                    {showCerts ? "Сховати сертифікати та дипломи" : "Показати сертифікати та дипломи"}
                </button>
            </div>

            {/* Галерея сертифікатів */}
            {showCerts && <CertificateGallery certs={certFiles} />}

            {/* Кнопка "Назад на головну" внизу */}
            <div className={styles.backButtonContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.backButton}>← Назад на головну</a>
                </Link>
            </div>
        </section>
    );
}
