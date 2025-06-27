// app/layout.tsx
import '../styles/globals.css';
import Header from './Header';
import Providers from './providers';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import BottomNav from 'app/components/BottomNav';
import Script from "next/script";
import React from "react";

export const metadata = {
  title: 'Kazantseva Rehabilitation – Реабілітація Наталія Казанцева у Вишневому',
  description:
    "Професійна реабілітація, остеопатія, масаж, фітобочка, краніосакральна терапія у Вишневому Київська область. Відновлення здоров'я, зменшення болю, корекція постави.",
  keywords:
    'реабілітація Вишневе, остеопатія Вишневе, масаж Вишневе, краніосакральна терапія Вишневе, фітобочка Вишневе, вісцеральна терапія Вишневе',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Kazantseva Rehabilitation – Реабілітація Наталія Казанцева у Вишневому',
    description:
      "Реабілітація, остеопатія, масаж, краніосакральна терапія у Вишневому. Відновлення здоров'я професійно!",
    url: 'https://kazantseva-rehabilitation.com.ua/',
    type: 'website',
    images: [
      {
        url: 'https://kazantseva-rehabilitation.com.ua/logo.png',
        width: 1110,
        height: 768,
        alt: "Kazantseva Rehabilitation – Ваш шлях до здоров'я",
      },
    ],
  },
  alternates: { canonical: 'https://kazantseva-rehabilitation.com.ua/' },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Реабілітація Наталія Казанцева',
  image: 'https://kazantseva-rehabilitation.com.ua/logo.png', // Убедитесь, что ссылка на логотип правильная
  url: 'https://kazantseva-rehabilitation.com.ua/',
  telephone: '+380503843042',
  email: 'info@nkz.com.ua',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'вулиця Молодіжна, 16А',
    addressLocality: 'Вишневе',
    addressRegion: 'Київська область',
    postalCode: '08132',
    addressCountry: 'UA',
  },
  areaServed: ['Вишневе', 'Крюківщина', 'Борщагівка', 'Київ'],
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        {/* Внедряем JSON-LD скрипт на все страницы сайта */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Providers>
          <div className="site-wrapper">
            <div className="content-pusher">
              <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Header />
                <main className="main-content" style={{ padding: '20px' }}>
                  {children}
                </main>
              </div>
            </div>
            <footer className="site-footer">
              &copy; {new Date().getFullYear()} Kazantseva Rehabilitation. Всі права захищені.
            </footer>
          </div>
        </Providers>
        <BottomNav />
        <Script
            src="https://stats.kazantseva-rehabilitation.com.ua/script.js"
            data-website-id="a4e5e81b-0e89-4195-ab41-ab82b43539d1"
            strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
