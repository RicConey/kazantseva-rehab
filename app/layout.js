import "../styles/globals.css";
import AnalyticsProvider from "./analytics-provider";
import Header from "./Header";
import Head from "next/head";
import Script from "next/script";
import Providers from "./providers"; // наш клиентский провайдер

export const viewport = {
    width: "device-width",
    initialScale: 1.0,
};

export const metadata = {
    title: "Kazantseva Rehabilitation – Реабілітація Наталія Казанцева у Вишневому",
    description:
        "Професійна реабілітація, остеопатія, масаж, фітобочка, краніосакральна терапія у Вишневому Київська область. Відновлення здоров'я, зменшення болю, корекція постави.",
    keywords:
        "реабілітація Вишневе, остеопатія Вишневе, масаж Вишневе, краніосакральна терапія Вишневе, фітобочка Вишневе, вісцеральна терапія Вишневе",
    author: "Наталія Казанцева",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "Kazantseva Rehabilitation – Реабілітація Наталія Казанцева у Вишневому",
        description:
            "Реабілітація, остеопатія, масаж, краніосакральна терапія у Вишневому. Відновлення здоров'я професійно!",
        url: "https://kazantseva-rehabilitation.com.ua/",
        type: "website",
        images: [
            {
                url: "https://kazantseva-rehabilitation.com.ua/og-image.jpg",
                width: 1110,
                height: 768,
                alt: "Kazantseva Rehabilitation – Ваш шлях до здоров'я",
            },
        ],
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
        "image": "https://kazantseva-rehabilitation.com.ua/og-image.jpg",
        "description":
            "Професійна реабілітація, остеопатія, масаж, краніосакральна терапія та інші послуги для здоров'я у місті Вишневе Київська область +380503843042.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Вишневе",
            "addressRegion": "Київська область",
            "postalCode": "08132",
            "streetAddress": "вулиця Молодіжна, 16А"
        },
        "telephone": "+380503843042",
        "sameAs": [
            "https://www.instagram.com/kaza_natali"
        ]
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
        {/* Глобальное подключение Web Component "back-button" */}
        <Script src="/back-button.js" strategy="beforeInteractive" />
        <Providers>
            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
                <Header />
                <main style={{ padding: "20px" }}>{children}</main>
            </div>
            <footer style={{ textAlign: "center", padding: "10px 0" }}>
                &copy; {new Date().getFullYear()} Kazantseva Rehabilitation. Всі права захищені.
            </footer>
        </Providers>
        <AnalyticsProvider />
        </body>
        </html>
    );
}
