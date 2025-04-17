// pages/about/page.js

"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import CertificateGallery from "./CertificateGallery";
import styles from "./About.module.css";
import SeoText from "../../components/SeoText";

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

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "Наталія Казанцева",
        "url": "https://kazantseva-rehabilitation.com.ua/",
        "telephone": "+380503843042",
        "email": "info@nkz.com.ua",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "вулиця Молодіжна, 16А",
            "addressLocality": "Вишневе",
            "addressRegion": "Київська область",
            "postalCode": "08132"
        },
        "areaServed": ["Вишневе", "Крюківщина", "Борщагівка", "Липки", "Печерськ", "Поділ"],
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Чи потрібне направлення лікаря?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ні, направлення лікаря не є обов’язковим для запису на прийом."
                }
            },
            {
                "@type": "Question",
                "name": "Як записатися на прийом?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Запис можна здійснити за телефоном або через месенджери Telegram, Viber, WhatsApp."
                }
            }
        ]
    };

    return (
        <>
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            </Head>
            <section className="baseText">

                <back-button />

                <h2 className={styles.title}>Про мене</h2>

                <p>
                    Я, <span className={styles.highcolor}>Наталія Казанцева</span>, спеціаліст з тілесної реабілітації, мануальної терапії, остеопатії та лікувального масажу.<br />
                    Стаж роботи: понад 8 років.
                </p>

                <p>
                    Здійснюю прийом у маленькому затишному кабінеті у Вишневому, обладнаному для роботи з пацієнтами з порушеннями функціонального стану опорно-рухового апарату, соматичними дисфункціями, післяопераційними або посттравматичними ускладненнями. В роботі поєдную клінічний аналіз, мануальні техніки та нейром’язову регуляцію.
                </p>

                <h2 className={styles.highlight}>Показання до звернення</h2>
                <ul>
                    <li>Хронічний або гострий больовий синдром (спина, шийний відділ, суглоби)</li>
                    <li>Наслідки травм, операцій, пологів (реабілітаційний етап)</li>
                    <li>Соматичні порушення на тлі стресу, вегетативної дисфункції, психоемоційного перенавантаження</li>
                    <li>Функціональні обмеження обсягу руху, порушення постурального контролю</li>
                    <li>М’язовий дисбаланс, локальні тригерні зони, фасціальна напруга</li>
                </ul>

                <h2 className={styles.highlight}>Методи роботи</h2>
                <ul>
                    <li><span className={styles.highcolor}>Функціональна діагностика:</span> оцінка біомеханіки, тканинного тонусу, рухливості структур</li>
                    <li><span className={styles.highcolor}>Остеопатичні техніки:</span> краніосакральна, вісцеральна, фасціальна корекція</li>
                    <li><span className={styles.highcolor}>Мануальна терапія:</span> міофасціальний реліз, мобілізація суглобів, корекція м'язового тонусу</li>
                    <li><span className={styles.highcolor}>Нейром’язова інтеграція:</span> нормалізація рухових патернів, сенсомоторний контроль</li>
                    <li><span className={styles.highcolor}>Лікувальний масаж:</span> системне розвантаження м'язових ланцюгів</li>
                </ul>

                <h2 className={styles.highlight}>Принципи роботи</h2>
                <ul>
                    <li>Індивідуальний підхід до кожного пацієнта</li>
                    <li>Перевага м’яких, структурно точних технік</li>
                    <li>Робота з причинами, а не лише симптомами</li>
                    <li>Поступове формування стійкого функціонального результату</li>
                    <li>Дотримання етичних і професійних стандартів медицини</li>
                </ul>

                <SeoText />

                <div className={styles.certButtonContainer}>
                    <button className={styles.certButton} onClick={() => setShowCerts(prev => !prev)}>
                        {showCerts ? "Сховати сертифікати та дипломи" : "Показати сертифікати та дипломи"}
                    </button>
                </div>

                {showCerts && <CertificateGallery certs={certFiles} />}

                <back-button />
            </section>
        </>
    );
}
