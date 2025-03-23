"use client";

import Link from "next/link";
import styles from "./Prices.module.css";

const priceList = [
    {
        service: "Загальний остеопатичний масаж тіла",
        slug: "osteopathy",
        price: "1100грн / 1600грн",
        duration: "60хв / 90хв",
    },
    {
        service: "Остеопатичний масаж спини",
        slug: "osteopathy",
        price: "800грн",
        duration: "40хв",
    },
    {
        service: "Міопластичний масаж лиця та зони декольте",
        slug: "massage",
        price: "800грн (з маскою) / 650грн (без маски)",
        duration: "40хв",
    },
    {
        service: "Вісцеральний масаж живота",
        slug: "visceral",
        price: "800грн",
        duration: "30хв",
    },
    {
        service: "Остеопатичний лімфодренаж всього тіла",
        slug: "osteopathy",
        price: "1700грн",
        duration: "90хв",
    },
    {
        service: "Дитячий загальний лікувальний масаж",
        slug: "massage",
        price: "600грн (3-10 років) / 750грн (11-14 років)",
        duration: "30хв / 40хв",
    },
    {
        service: "Акупунктура (додатково до массажу)",
        slug: "acupuncture",
        price: "+500грн",
        duration: "—",
    },
    {
        service: "Тейпування (додатково до массажу)",
        slug: "rehabilitation",
        price: "від 300грн",
        duration: "—",
    },
    {
        service: "Фітобочка",
        slug: "fitobochka",
        price: "550грн",
        duration: "—",
    },
    {
        service: "ДПДГ (метод психотерапії ПТСР)",
        slug: "rehabilitation",
        price: "900грн, для військових знижка 50%",
        duration: "60хв",
    },
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

            <table className={styles.priceTable}>
                <thead>
                <tr>
                    <th>Послуга</th>
                    <th>Ціна</th>
                    <th>Тривалість</th>
                </tr>
                </thead>
                <tbody>
                {priceList.map((item, index) => (
                    <tr key={index}>
                        <td className={styles.serviceCell} data-label="Послуга">
                            <Link href={`/services/${item.slug}`} passHref legacyBehavior>
                                <a className={styles.serviceLink}>
                                    {item.service}
                                    <span className={styles.arrow}>→</span>
                                </a>
                            </Link>
                        </td>
                        <td className={styles.priceCell} data-label="Ціна">
                            {item.price}
                        </td>
                        <td className={styles.durationCell} data-label="Тривалість">
                            {item.duration}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.backButtonContainer}>
                <Link href="/" passHref legacyBehavior>
                    <a className={styles.backButton}>← Назад на головну</a>
                </Link>
            </div>
        </section>
    );
}