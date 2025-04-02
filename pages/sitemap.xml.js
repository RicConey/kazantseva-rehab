export async function getServerSideProps({ res }) {
    const baseUrl = 'https://kazantseva-rehabilitation.com.ua'

    // Статические страницы
    const staticPaths = [
        '',
        'about',
        'contact',
        'prices'
    ]

    // Динамические слаги
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

    const allUrls = [
        ...staticPaths.map((path) => ({
            loc: `${baseUrl}/${path}`,
        })),
        ...dynamicSlugs.map((slug) => ({
            loc: `${baseUrl}/services/${slug}`,
        })),
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
        .map(
            ({ loc }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc === `${baseUrl}/` ? '1.0' : '0.8'}</priority>
  </url>`
        )
        .join('')}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.write(sitemap)
    res.end()

    return { props: {} }
}

export default function Sitemap() {
    return null
}
