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
            slug: "massage",
            title: "Масаж тіла та обличчя",
            description:
                "Комплексний масаж, що сприяє розслабленню м’язів, покращенню кровообігу та відновленню життєвих сил.",
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
        {slug: "strokerehabilitation",
            title: "Реабілітація після інсульту",
            description:
                "Комплексна програма відновлення, спрямована на повернення втрачених рухових функцій.",
        },
        {slug: "instantpainrelief",
            title: "Метод миттєвого лікування болю",
            description:
                "Комплексний підхід, що передбачає точну діагностику і цілеспрямований вплив на першопричину болю.",
        },
        {
            slug: "fitobocha",
            title: "Фітобочка",
            description:
                "Процедура з використанням натуральних рослинних компонентів для оздоровлення організму, виведення токсинів та релаксації.",
        },
        {
            slug: "taping",
            title: "Тейпування",
            description: `Тейпування – це сучасна методика, що полягає у використанні спеціальних еластичних стрічок (тейпів) для підтримки м’язів, суглобів та фасцій.`,
        },
        {
            slug: "cuppingtherapy",
            title: "Вакуумно-роликовий масаж",
            description: `Вакуумно-роликовий масаж - поєднує вакуумну терапію з м’яким механічним впливом на тканини.`,
        },
    ];

    return (
        <section className={styles.section}>
            <h1 className={styles.intro}>Kazantseva Rehabilitation – ваш шлях до здоров'я починається тут</h1>
            <p className={styles.intro}>
                Шукаєте ефективну реабілітацію, масаж, остеопатію чи краніосакральну терапію у Вишневому?
                Наталія Казанцева пропонує вам професійні послуги для відновлення здоров'я, корекції постави,
                зняття болю та збалансування всієї систем. Нижче представлені основні напрямки нашої роботи.
            </p>
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
