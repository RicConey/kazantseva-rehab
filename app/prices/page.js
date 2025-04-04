"use client";
import React from "react";
import styles from "./Prices.module.css";
import DPROTooltip from "../../components/DPROTooltip";

const prices = [
    { service: "Загальний остеопатичний масаж тіла", duration: ["60хв", "90хв"], price: ["1100грн", "1600грн"] },
    { service: "Остеопатичний масаж спини", duration: ["40хв"], price: ["800грн"] },
    { service: "Міопластичний масаж лиця та зони декольте", duration: ["40хв"], price: ["800грн (з маскою) / 650грн (без маски)"] },
    { service: "Вісцеральний масаж живота", duration: ["30хв"], price: ["800грн"] },
    { service: "Остеопатичний лімфодренаж всього тіла", duration: ["90хв"], price: ["1700грн"] },
    { service: "Дитячий загальний масаж", duration: ["30хв", "40хв"], price: ["600грн (3-10 років)", "750грн (11-14 років)"] },
    { service: "Фітобочка", duration: ["15-20хв"], price: ["550грн"] },
    {
        service: (
            <>
                Подолання наслідків травматичного досвіду методом <DPROTooltip />
            </>
        ),
        duration: ["60хв"],
        price: ["900грн (для військових знижка 50%)"],
    },




];

export default function PricesPage() {
    return (
        <div className={styles.container}>
            {/* Кнопка "Назад" сверху */}
            <back-button></back-button>

            <h1 className={styles.title}>Ціни на послуги</h1>
            <table className={styles.priceTable}>
                <thead>
                <tr>
                    <th>Послуга</th>
                    <th>Хв</th>
                    <th>Ціна</th>
                </tr>
                </thead>
                <tbody>
                {prices.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.duration.map((time, i) => (
                            <tr key={`${index}-${i}`}>
                                {i === 0 ? <td rowSpan={item.duration.length}>{item.service}</td> : null}
                                <td>{time}</td>
                                <td>{item.price[i]}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </table>

            {/* Кнопка "Назад" внизу */}
            <back-button></back-button>
        </div>
    );
}
