/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://kazantseva-rehabilitation.com.ua', // ваш основной домен
    generateRobotsTxt: true,          // (опционально) генерировать robots.txt
    sitemapSize: 7000,                // (опционально) макс. кол-во URL в одном sitemap-файле
    // outDir: './public',            // (опционально) папка, в которую будут генерироваться файлы (по умолчанию public)
    // additionalSitemaps: [         // (опционально) если нужно подключить доп. карты
    //   'https://ваш-домен.com/my-custom-sitemap-1.xml',
    // ],
    // transform: async (config, path) => { // (опционально) кастомизация ссылок в sitemap
    //   // пример: исключить какие-то роуты или изменить приоритет
    //   return {
    //     loc: path, // => это уже преобразованный путь
    //     changefreq: 'daily',
    //     priority: 0.7,
    //     lastmod: new Date().toISOString(),
    //     alternateRefs: config.alternateRefs ?? [],
    //   }
    // }
}
