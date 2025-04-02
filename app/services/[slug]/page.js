// app/services/[slug]/page.js
import { use } from "react";
import { notFound } from "next/navigation";
import BackButton from "../../../components/BackButton";
import styles from "./ServiceDetail.module.css";

async function getServiceBySlug(slug) {
    try {
        const module = await import(`../../services-data/${slug}.js`);
        return {
            slug,
            metadata: module.metadata,
            Component: module.default,
        };
    } catch (error) {
        return null;
    }
}

export default async function ServiceDetailPage({ params }) {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
        return notFound();
    }

    return (
        <section className={styles.section}>
            <div className={styles.backButtonContainer}>
                <BackButton />
            </div>
            <service.Component />
            <div className={styles.backButtonContainer}>
                <BackButton />
            </div>
        </section>
    );
}

