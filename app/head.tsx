// Этот файл Next.js автоматически вставит в <head> только для /about

export default function Head() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Наталія Казанцева',
    url: 'https://kazantseva-rehabilitation.com.ua/',
    telephone: '+380503843042',
    email: 'info@kazantseva-rehabilitation.com.ua',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вулиця Молодіжна, 16А',
      addressLocality: 'Вишневе',
      addressRegion: 'Київська область',
      postalCode: '08132',
    },
    areaServed: ['Вишневе', 'Крюківщина', 'Борщагівка', 'Липки', 'Печерськ', 'Поділ'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Чи потрібне направлення лікаря?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ні, направлення лікаря не є обов’язковим для запису на прийом.',
        },
      },
      {
        '@type': 'Question',
        name: 'Як записатися на прийом?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Запис можна здійснити за телефоном або через месенджери Telegram, Viber, WhatsApp.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
