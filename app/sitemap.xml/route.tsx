import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const baseUrl = 'https://kazantseva-rehabilitation.com.ua';
  const servicesDir = path.join(process.cwd(), 'app', 'services-data');

  try {
    const files = await fs.readdir(servicesDir);

    const slugs = files
      .filter(file => /\.(js|jsx|ts|tsx)$/.test(file))
      .map(file => path.basename(file, path.extname(file)));

    const urls = slugs.map(
      slug => `
  <url>
    <loc>${baseUrl}/services/${slug}</loc>
    <changefreq>weekly</changefreq>
  </url>`
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/prices</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/rules</loc><changefreq>monthly</changefreq></url>
  ${urls.join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return new Response('Помилка генерації sitemap', { status: 500 });
  }
}
