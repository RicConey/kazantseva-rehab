"use client";

import { use } from "react"; // Добавляем use для работы с Promise
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Rehabilitation from "../services-data/Rehabilitation";
import Acupuncture from "../services-data/Acupuncture";
import Craniosacral from "../services-data/Craniosacral";
import Fitobocha from "../services-data/Fitobocha";
import Massage from "../services-data/Massage";
import Osteopathy from "../services-data/Osteopathy";
import Visceral from "../services-data/Visceral";
import Taping from "../services-data/Taping";
import StrokeRehabilitation from "../services-data/StrokeRehabilitation";
import InstantPainRelief from "../services-data/InstantPainRelief";
import CuppingTherapy from "../services-data/CuppingTherapy";
import styles from "./ServiceDetail.module.css";

// Маппинг slug → компонент услуги
const servicesMap = {
    rehabilitation: Rehabilitation,
    acupuncture: Acupuncture,
    craniosacral: Craniosacral,
    fitobocha: Fitobocha,
    massage: Massage,
    osteopathy: Osteopathy,
    visceral: Visceral,
    taping: Taping,
    strokerehabilitation: StrokeRehabilitation,
    instantpainrelief: InstantPainRelief,
    cuppingtherapy: CuppingTherapy,
};

export default function ServiceDetailPage({ params: paramsPromise }) {
    const router = useRouter();
    const params = use(paramsPromise); // Разворачиваем params через use()
    const { slug } = params;
    const ServiceComponent = servicesMap[slug];

    if (!ServiceComponent) {
        return notFound();
    }

    return (
        <section className={styles.section}>
            {/* Верхняя кнопка "Назад" */}
            <div className={styles.backButtonContainer}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    ← Назад
                </button>
            </div>

            {/* Выводим контент услуги */}
            <ServiceComponent />

            {/* Нижняя кнопка "Назад" */}
            <div className={styles.backButtonContainer}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    ← Назад
                </button>
            </div>
        </section>
    );
}
