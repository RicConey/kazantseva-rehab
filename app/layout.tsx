// app/layout.tsx
import '../styles/globals.css';
import AnalyticsProvider from './analytics-provider';
import Header from './Header';
import Providers from './providers';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

// Это ваши SEO-данные — Next.js сам их вставит в <head>
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
        url: 'https://kazantseva-rehabilitation.com.ua/og-image.jpg',
        width: 1110,
        height: 768,
        alt: "Kazantseva Rehabilitation – Ваш шлях до здоров'я",
      },
    ],
  },
  alternates: { canonical: 'https://kazantseva-rehabilitation.com.ua/' },
  robots: 'index, follow',
};

// Опционально: viewport можно также экспортировать здесь (Next.js поддерживает)
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Providers>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Header />
            <main style={{ padding: '20px' }}>{children}</main>
          </div>
          <footer style={{ textAlign: 'center', padding: '10px 0' }}>
            &copy; {new Date().getFullYear()} Kazantseva Rehabilitation. Всі права захищені.
          </footer>
        </Providers>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
