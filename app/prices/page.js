"use client";

import Link from "next/link";
import styles from "./Prices.module.css";

// Список услуг и их соответствие страницам
const priceList = [
    { service: "Загальний остеопатичний масаж", slug: "osteopathy", details: "тіла 1100грн (60хв), 1600грн (90хв), спини 800грн (40хв)" },
    { service: "Міопластичний масаж лиця та зони декольте", slug: "massage", details: "з маскою 800грн (40хв), без 650грн" },
    { service: "Вісцеральний масаж живота", slug: "visceral", details: "800грн (30хв)" },
    { service: "Остеопатичний лімфодренаж всього тіла", slug: "osteopathy", details: "1700грн (90хв)" },
    { service: "Дитячий загальний лікувальний масаж", slug: "massage", details: "3-10 років: 600грн (30хв), 11-14 років: 750грн (40хв)" },
    { service: "Акупунктура (додатково до массажу)", slug: "acupuncture", details: "+500грн" },
    { service: "Тейпування (додатково до массажу)", slug: "rehabilitation", details: "від 300грн (залежить від розміру аплікації)" },
    { service: "Фітобочка", slug: "fitobochka", details: "550грн" },
    { service: "ДПДГ (метод психотерапії ПТСР)", slug: "rehabilitation", details: "900грн (60хв), для військових знижка 50%" }
];

export default function PricesPage() {
    return (
        <section className={styles.section}>
            <div className={styles.backButtonContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.backButton}>← Назад на головну</a>
                </Link>
            </div>

            <h1 className={styles.title}>Ціни на послуги</h1>

            <ul className={styles.priceList}>
                {priceList.map((item, index) => (
                    <li key={index} className={styles.priceItem}>
                        {/* Ссылка на страницу услуги */}
                        <Link href={`/services/${item.slug}`} className={styles.serviceLink}>
                            {item.service} <span className={styles.arrow}>→</span>
                        </Link>
                        <p>{item.details}</p>
                        {item.extra && <p className={styles.extra}>{item.extra}</p>}
                    </li>
                ))}
            </ul>

            <div className={styles.backButtonContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.backButton}>← Назад на головну</a>
                </Link>
            </div>
        </section>
    );
}
