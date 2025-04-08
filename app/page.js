import Link from "next/link";
import styles from "./ServicePage.module.css";
import { getServiceSlugs } from "../lib/getServices";
import Image from "next/image";
import PromoBlock from "../components/PromoBlock";


// Функція для динамічного імпорту файлів послуг
async function getServices() {
    const slugs = getServiceSlugs();
    const services = await Promise.all(
        slugs.map(async (slug) => {
            const module = await import(`./services-data/${slug}.js`);
            // Если поле order не задано, присваиваем Infinity
            const order = module.metadata.order ?? Infinity;
            return {
                slug,
                metadata: { ...module.metadata, order },
                Component: module.default,
            };
        })
    );
    // Сортировка по значению order
    services.sort((a, b) => a.metadata.order - b.metadata.order);
    return services;
}

export default async function HomePage() {
    const services = await getServices();

    return (
        <section className="baseText">

            <div
                className="baseText"
                style={{ margin: "24px auto", maxWidth: "800px", textAlign: "center", lineHeight: "1.1", marginBottom: "1em" }}
            >
                <p
                    style={{
                        fontSize: "1.3rem",
                        textTransform: "uppercase",
                        color: "#249B89",
                        fontFamily: "LogoFont",
                        marginBottom: "5px",
                        letterSpacing: "1px",
                        fontWeight: "normal",
                    }}
                >
                    Kazantseva Rehabilitation
                </p>

                <p
                    style={{
                        fontSize: "1.3rem",
                        textTransform: "uppercase",
                        color: "#249B89",
                        fontFamily: "LogoFont",
                        marginBottom: "5px",
                        letterSpacing: "1px",
                        fontWeight: "normal",
                    }}
                >
                    ваш шлях до здоров'я починається тут
                </p>

            </div>


            <p className={styles.intro}>
                Шукаєте ефективну реабілітацію, професійний масаж чи комплексний підхід до відновлення здоров’я у Вишневому?
            </p>
            <p className={styles.intro}>
                Мене звати{" "}
                <Link href="/about" passHref legacyBehavior>
                    <a className={styles.highlight}>Наталія Казанцева</a>
                </Link>
                , і я пропоную широкий спектр послуг, які допоможуть вам повернути активність, гарне самопочуття та баланс всього організму.
            </p>

            <ul className={styles.servicesGrid}>
                {services.map((service) => (
                    <li key={service.slug} className={styles.serviceCard}>
                        <Link href={`/services/${service.slug}`} passHref legacyBehavior>
                            <a className={styles.serviceLink}>
                                {/* Показываем картинку, если есть */}
                                {service.metadata.image && (
                                    <Image
                                        src={service.metadata.image}
                                        alt={service.metadata.title}
                                        width={600}
                                        height={400}
                                        className={styles.cardImage}
                                        style={{ borderRadius: "2px", marginBottom: "2px" }}
                                    />
                                )}
                                <h2 className={styles.serviceTitle}>{service.metadata.title}</h2>
                                <p className={styles.serviceDescription}>
                                    {service.metadata.description}
                                </p>
                                <span className={styles.serviceHint}>Дізнатись більше →</span>
                            </a>
                        </Link>
                    </li>

                ))}
            </ul>

            <PromoBlock />

        </section>
    );
}
