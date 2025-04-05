// app/prices/page.jsx
import React from "react";
import styles from "./Prices.module.css";

export const dynamic = "force-dynamic"; // позволяет динамику + revalidate

export default async function PricesPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/prices`, {
        next: { revalidate: 21000 },
    });

    const prices = await res.json();

    return (
        <div className="baseText">
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
                {prices.map((item, index) => {
                    const durations = Array.isArray(item.duration) ? item.duration : [item.duration];
                    const priceList = Array.isArray(item.price) ? item.price : [item.price];

                    return (
                        <React.Fragment key={item.id || index}>
                            {durations.map((time, i) => (
                                <tr key={`${index}-${i}`}>
                                    {i === 0 && (
                                        <td rowSpan={durations.length}>
                                            {typeof item.service === "string" ? item.service : <DPROTooltip />}
                                        </td>
                                    )}
                                    <td>{time}</td>
                                    <td>{priceList[i]}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    );
                })}
                </tbody>
            </table>

            <back-button></back-button>
        </div>
    );
}
