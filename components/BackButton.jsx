"use client";

import { useRouter } from "next/navigation";
import styles from "../app/services/[slug]/ServiceDetail.module.css"; // Путь к CSS, где определены стили кнопки

export default function BackButton() {
    const router = useRouter();
    return (
        <button
            className={styles.backButton}
            onClick={() => router.back()}
        >
            ← Назад
        </button>
    );
}
