// app/admin/head.tsx
export default function Head() {
  return (
    <>
      {/* попросим поисковики не индексировать страницу и не переходить по ссылкам */}
      <meta name="robots" content="noindex,nofollow,noarchive" />
      {/* дополнительно можно выключить кэширование */}
      <meta httpEquiv="Cache-Control" content="no-store" />
    </>
  );
}
