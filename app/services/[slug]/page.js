// app/services/[slug]/page.js
import { notFound } from "next/navigation";

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
        <section className="baseText">
            <back-button></back-button>

            <service.Component />

            <back-button></back-button>
        </section>
    );
}

