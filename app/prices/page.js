import styles from "./Prices.module.css";
import PromoBlock from "../../components/PromoBlock";
import SeoText from "../../components/SeoText";

export default async function PricesPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/prices`, {
        next: { revalidate: 3600 },
    });

    const prices = await res.json();

    return (
        <div className="baseText" style={{ padding: "0px 0px 24px" }}>
            <back-button></back-button>

            <h1 className={styles.title}>Ціни на послуги</h1>

            <div className={styles.container}>
                <table className={styles.priceTable}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Послуга</th>
                        <th style={{ textAlign: "center" }}>Хв</th>
                        <th>Ціна</th>
                    </tr>
                    </thead>
                    <tbody>
                    {prices.map((item, index) => {
                        const durationArray = Array.isArray(item.duration) ? item.duration : [item.duration];
                        const priceArray = Array.isArray(item.price) ? item.price : [item.price];

                        return durationArray.map((duration, i) => (
                            <tr key={`${item.id}-${i}`}>
                                {i === 0 && (
                                    <>
                                        <td rowSpan={durationArray.length}>{index + 1}</td>
                                        <td rowSpan={durationArray.length}>{item.service}</td>
                                    </>
                                )}
                                <td style={{ textAlign: "center" }}>{duration}</td>
                                <td>{priceArray[i]}</td>
                            </tr>
                        ));
                    })}
                    </tbody>
                </table>
            </div>

            <PromoBlock />
            <SeoText />

            <back-button></back-button>
        </div>
    );
}
