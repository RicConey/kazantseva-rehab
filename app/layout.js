import "../styles/globals.css";
import AnalyticsProvider from "./analytics-provider";
import Header from "./Header";
import Head from "next/head";

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

export const metadata = {
    title: "Kazantseva Rehabilitation – Реабілітація Наталія Казанцева",
    description:
        "Професійна реабілітація, остеопатія, масаж, фітобочка, краніосакральна терапія, вісцеральна терапія та інші послуги для відновлення здоров'я.",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Kazantseva Rehabilitation – Реабілітація Наталія Казанцева",
        description:
            "Професійна реабілітація, остеопатія, масаж, фітобочка, краніосакральна терапія, вісцеральна терапія та інші послуги для відновлення здоров'я.",
        url: "https://kazantseva-rehabilitation.com.ua/",
        type: "website",
    },
    alternates: {
        canonical: "https://kazantseva-rehabilitation.com.ua/",
    },
    robots: "index, follow",
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Kazantseva Rehabilitation – Реабілітація Наталія Казанцева",
        "url": "https://kazantseva-rehabilitation.com.ua/",
        "logo": "https://kazantseva-rehabilitation.com.ua/logo.png",
        "description":
            "Професійна реабілітація, остеопатія, масаж, фітобочка, краніосакральна терапія, вісцеральна терапія та інші послуги для відновлення здоров'я.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Вишневе",
            "addressRegion": "Київська область",
            "postalCode": "08132",
            "streetAddress": "вулиця Молодіжна, 16А"
        },
        "telephone": "+380503843042"
    };

    return (
        <html lang="uk">
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href="https://kazantseva-rehabilitation.com.ua/" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </Head>
        <body>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <Header />
            <main style={{ padding: "20px" }}>{children}</main>
        </div>
        <footer style={{ textAlign: "center", padding: "10px 0" }}>
            &copy; {new Date().getFullYear()} Kazantseva Rehabilitation. Всі права захищені.
        </footer>
        <AnalyticsProvider />
        </body>
        </html>
    );
}
