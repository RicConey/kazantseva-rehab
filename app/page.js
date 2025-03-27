import Link from "next/link";
import styles from "./ServicePage.module.css";

export default function HomePage() {
    const services = [
        {
            slug: "rehabilitation",
            title: "Реабілітація",
            description:
                "Комплексний підхід до відновлення фізичного стану, допомога у відновленні балансу організму та зменшенні болю.",
        },
        {
            slug: "osteopathy",
            title: "Остеопатія",
            description:
                "Мануальна терапія, спрямована на відновлення рухливості суглобів, зняття напруги та корекцію постави.",
        },
        {
            slug: "craniosacral",
            title: "Краніосакральна терапія",
            description:
                "Унікальний метод, що працює з краніосакральною системою для гармонізації організму та зняття стресу.",
        },
        {
            slug: "visceral",
            title: "Вісцеральна терапія",
            description:
                "М’який вплив на внутрішні органи для покращення кровообігу, нормалізації функцій та зняття болю.",
        },
        {
            slug: "acupuncture",
            title: "Акупунктура",
            description:
                "Давня китайська методика з використанням тонких голок для стимуляції природних процесів самозцілення.",
        },
        {
            slug: "massage",
            title: "Масаж тіла та обличчя",
            description:
                "Комплексний масаж, що сприяє розслабленню м’язів, покращенню кровообігу та відновленню життєвих сил.",
        },
        {
            slug: "fitobocha",
            title: "Фітобочка",
            description:
                "Процедура з використанням натуральних рослинних компонентів для оздоровлення організму, виведення токсинів та релаксації.",
        },
    ];

    return (
        <section className={styles.section}>
            <h1 className={styles.intro}>Kazantseva Rehabilitation – Ваш шлях до здоров'я!</h1>
            <ul className={styles.servicesGrid}>
                {services.map((service) => (
                    <li key={service.slug} className={styles.serviceCard}>
                        <Link href={`/services/${service.slug}`} passHref legacyBehavior>
                            <a className={styles.serviceLink}>
                                <h2 className={styles.serviceTitle}>{service.title}</h2>
                                <p className={styles.serviceDescription}>{service.description}</p>
                                <span className={styles.serviceHint}>Дізнатись більше →</span>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
