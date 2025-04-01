// pages/sitemap.xml.js

export async function getServerSideProps({ res }) {
    const baseUrl = 'https://kazantseva-rehabilitation.com.ua'

    // Статические страницы
    const staticPaths = [
        '',
        'about',
        'contact',
        'prices'
    ]

    // Динамические слаги из servicesMap
    const dynamicSlugs = [
        'rehabilitation',
        'acupuncture',
        'craniosacral',
        'fitobocha',
        'massage',
        'osteopathy',
        'visceral',
        'taping',
        'strokerehabilitation',
        'instantpainrelief',
        'cuppingtherapy',
    ]

    // Генерация ссылок
    const allUrls = [...staticPaths, ...dynamicSlugs].map((path) => {
        return `
  <url>
    <loc>${baseUrl}/${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    })

    // Генерация финального XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.join('\n')}
</urlset>`

    // Отправка ответа
    res.setHeader('Content-Type', 'application/xml')
    res.write(sitemap)
    res.end()

    return { props: {} }
}

export default function Sitemap() {
    return null
}
