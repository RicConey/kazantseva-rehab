"use client";

import { useState, useEffect } from "react";
import CertificateGallery from "./CertificateGallery";
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
            {/* Кнопка "Назад" вверху */}
            <back-button>1</back-button>

            <h1 className={styles.title}>Про мене</h1>
            <p>
                Я,{" "}
                <a className={styles.highlight}>Наталія Казанцева</a>
                , вже багато років займаюся реабілітацією, терапією та альтернативною медициною. Мій підхід ґрунтується на індивідуальній
                роботі з кожним клієнтом, комплексному відновленні організму та гармонізації фізичного й емоційного стану.
            </p>
            <p>
                Завдяки постійному вдосконаленню методик і прагненню до високих стандартів лікування, я допомагаю людям повернути баланс,
                зняти хронічний біль та відновити радість життя. Мої результати підтверджені численними позитивними відгуками, і я пишаюся тим,
                що можу допомогти кожному, хто довіряє мені своє здоров’я.
            </p>

            {/* Кнопка "Показати сертифікати та дипломи" */}
            <div className={styles.certButtonContainer}>
                <button className={styles.certButton} onClick={() => setShowCerts((prev) => !prev)}>
                    {showCerts ? "Сховати сертифікати та дипломи" : "Показати сертифікати та дипломи"}
                </button>
            </div>

            {/* Галерея сертифікатів */}
            {showCerts && <CertificateGallery certs={certFiles} />}

            {/* Кнопка "Назад" внизу */}
            <back-button></back-button>
        </section>
    );
}
