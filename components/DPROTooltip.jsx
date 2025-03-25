import { useState, useEffect, useRef } from "react";
import styles from "../app/prices/Prices.module.css";

export default function DPROTooltip() {
    const [visible, setVisible] = useState(false);
    const tooltipRef = useRef(null);

    const toggleTooltip = (e) => {
        e.stopPropagation();
        setVisible((prev) => !prev);
    };

    // Закрытие тултипа при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.parentElement.contains(event.target)
            ) {
                setVisible(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Пересчёт позиции тултипа, чтобы не выходил за край экрана
    useEffect(() => {
        if (visible && tooltipRef.current) {
            const tooltipEl = tooltipRef.current;
            const rect = tooltipEl.getBoundingClientRect();
            const screenWidth = window.innerWidth;

            // Сбросим стили, чтобы правильно пересчитать положение
            tooltipEl.style.left = "";
            tooltipEl.style.right = "";
            tooltipEl.style.transform = "translateX(-50%)";

            // Если тултип «вылез» за левый край:
            if (rect.left < 0) {
                tooltipEl.style.left = "0"; // прижмём к левому краю
                tooltipEl.style.transform = "none";
            }

            // Если тултип «вылез» за правый край:
            if (rect.right > screenWidth) {
                tooltipEl.style.right = "0"; // прижмём к правому краю
                tooltipEl.style.transform = "none";
            }
        }
    }, [visible]);

    return (
        <span className={styles.tooltipWrapper} onClick={toggleTooltip}>
      <span className={styles.tooltipTrigger}>ДПРО</span>
            {visible && (
                <span
                    ref={tooltipRef}
                    className={`${styles.tooltipText} ${styles.tooltipVisible}`}
                    lang="uk"
                >
          Десенсибілізація та репроцесінг рухами очей — метод психотерапії,
          розроблений Франсін Шапіро для лікування посттравматичних
          стресових розладів, спричинених травматичними подіями,
          такими як насильство чи участь у воєнних діях.
        </span>
            )}
    </span>
    );
}
