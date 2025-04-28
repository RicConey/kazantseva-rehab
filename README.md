# Kazantseva Rehabilitation — Next.js 14 Full‑Stack App

> 🇺🇦 **Веб‑сайт та адмін‑панель приватного реабілітолога Наталії Казанцевої.**  
> EN **Public website and admin dashboard for physiotherapist Nataliia Kazantseva.**

[![Deploy on Vercel](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://vercel.com/import/project) 
![Next](https://img.shields.io/badge/Next.js-14.x-blue?logo=nextdotjs) ![Prisma](https://img.shields.io/badge/Prisma-6.x-blueviolet?logo=prisma) ![Neon](https://img.shields.io/badge/PostgreSQL-Neon-green)

---

## 📑 Table of Contents / Зміст
1. [Demo](#demo) | Демо
2. [Key Features](#features) | Основні можливості
3. [Tech Stack](#tech-stack) | Тех‑стек
4. [Project Structure](#structure) | Структура
5. [Local Setup](#local) | Локальний запуск
6. [Database & Prisma](#database) | База даних і Prisma
7. [Deployment](#deployment) | Деплой
8. [Admin Dashboard](#admin) | Адмін‑панель
9. [Security](#security) | Безпека
10. [API Examples](#api) | Приклади API
11. [Roadmap](#roadmap)
12. [License](#license)

---

## 🔍 Demo / Демо <a id="demo"></a>
| URL | Description |
|-----|-------------|
| https://kazantseva-rehabilitation.com.ua | 🌐 **Public site** / Публічний сайт |
| `/admin` | 🔒 **Admin dashboard** (JWT‑protected) / Адмін‑панель (лише admin) |


---

## ✨ Key Features / Основні можливості <a id="features"></a>

| 🇺🇦 Українською | EN English |
|-----------------|--------------|
| **Публічний сайт**<br>• SSR + ISR на Next.js<br>• SEO: sitemap.xml, OG, structured data<br>• Контент українською, мінімум JS<br>• Динамічний прайс із Neon PostgreSQL (кеш з адмінки) | **Public site**<br>• SSR + ISR with Next.js<br>• SEO‑ready: sitemap, OpenGraph, structured data<br>• Ukrainian primary content, ultra‑lean JS bundle<br>• Dynamic price list from Neon PostgreSQL (cache invalidated from admin) |
| **Адмін‑панель**<br>• JWT‑авторизація та Edge‑middleware guard<br>• Повний CRUD: Клієнти, Сеанси, Таймлайн, Фінанси, Локації, Прайс<br>• Таймлайн з drag‑scroll та мобільними жестами<br>• Фінзвіти: день, тиждень, місяць, рік<br>• Експорт у CSV (в розробці) | **Admin dashboard**<br>• JWT authentication + Edge middleware guard<br>• Full CRUD: Clients, Appointments, Timeline, Finance, Locations, Price List<br>• Interactive timeline with drag‑scroll & mobile gestures<br>• Finance reports: day, week, month, year<br>• CSV export (work in progress) |


---

## 🛠 Tech Stack / Тех‑стек <a id="tech-stack"></a>
| Layer | Інструменти/Tools |
|-------|----------------|
| Frontend | Next.js 14, React 19, Tailwind CSS |
| Backend  | Next.js API routes, Prisma ORM, Neon PostgreSQL |
| Auth     | NextAuth (JWT) + bcrypt |
| UI / Viz | Recharts, react‑calendar‑timeline |
| DevOps   | Vercel, ESLint / Prettier, pnpm |

---

## 📂 Project Structure / Структура <a id="structure"></a>
```text
.
├─ app/                 # Next.js App Router (pages + API)
│  ├─ admin/            # Dashboard (protected)
│  └─ api/              # REST endpoints
├─ components/          # Reusable UI
├─ prisma/              # Schema + migrations + seed
├─ lib/                 # Helpers (auth, db, rate‑limit)
├─ utils/               # Client‑side helpers
├─ public/              # Static assets / screenshots
└─ styles/              # Tailwind / globals.css
```

---

## 🚀 Local Setup / Локальний запуск <a id="local"></a>
```bash
# Clone / Клонування
$ git clone https://github.com/RicConey/kazantseva-rehab.git && cd kazantseva-rehab

# Env vars / Змінні середовища
$ cp .env.example .env   # заповніть secrets

# Install deps / Встановити залежності
$ pnpm install  # Node ≥ 20

# Prisma migrate / Міграції
$ npx prisma migrate dev --name init

# Run dev / Запуск
$ pnpm dev   # http://localhost:3000
```

---

## 🗄️ Database & Prisma / База даних і Prisma <a id="database"></a>
- **Entities / Сутності**: `User`, `Client`, `Appointment`, `Location`, `Price`, `FinanceReport`, `Note`.
- `prisma/seed.ts` adds initial admin user / додає першого admin‑користувача.
- Regenerate client after schema change: `pnpm prisma generate`.

---

## ☁️ Deployment / Деплой <a id="deployment"></a>
| Step | 🇺🇦 | EN |
|------|-----|-----|
| 1 | Створіть базу в Neon і додайте `DATABASE_URL` | Create Neon DB and set `DATABASE_URL` |
| 2 | Імпортуйте репозиторій у Vercel та задайте env vars | Import repo to Vercel & add env vars |
| 3 | *(опц.)* `pnpm dlx vercel link && vercel env pull` | *(opt.)* link & pull env locally |
| 4 | Production‑branch — `main` | Production branch — `main` |

---

## 📊 Admin Dashboard / Адмін‑панель <a id="admin"></a>
| Path | Module |
|------|--------|
| `/admin/clients` | Clients / Клієнти |
| `/admin/appointments` | Timeline / Таймлайн |
| `/admin/finance` | Finance / Фінанси |
| `/admin/prices` | Price List / Прайс |

---

## 🔒 Security / Безпека <a id="security"></a>
1. **NextAuth Credentials** — HS‑256 JWT; passwords hashed with `bcrypt`.
2. **Edge Middleware** — rejects non‑admin requests to any `/admin/**` route.
3. **Server‑side Guard** — each mutating API route calls `requireAdmin()`.
4. **CSRF Token** — `next-auth.csrf-token` hidden field in sign‑in form.
5. **Rate‑Limit** — simple IP‑based limiter (`lib/rate-limit.ts`).
6. **Secure Headers** — CSP & HSTS via `next.config.js`.

---

## 🛠 API Examples / Приклади API <a id="api"></a>
```bash
# 1) Public price list / Публічний прайс
curl https://kazantseva-rehabilitation.com.ua/api/prices

# 2) Create appointment (admin JWT cookie required)
curl -X POST https://kazantseva-rehabilitation.com.ua/api/admin/appointments \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=…" \
  -d '{
        "clientId": "clt_123",
        "date": "2025-05-01",
        "time": "10:00",
        "duration": 60,
        "locationId": 1,
        "notes": "Rehabilitation session"
      }'

# 3) Finance summary for selected period / Звіт фінансів
curl "https://kazantseva-rehabilitation.com.ua/api/finance?period=month&from=2025-05-01&to=2025-05-31" -b "next-auth.session-token=…"
```

---

## 🗺️ Roadmap <a id="roadmap"></a>
| Stage | 🇺🇦 Задачі | EN — Tasks |
|-------|-----------|-----------|
| **Short Term** | CSV експорт фінансів | Finance CSV export |
| **Mid Term** | Повна i18n (переключення EN)<br>Email / SMS нагадування сеансів<br>PWA offline для публічної частини<br>Розширена аналітика фінансів | Full i18n (switchable EN)<br>Email / SMS reminders<br>PWA offline support<br>Extended finance analytics |
| **Long Term** | ACL ролі (manager, accountant) + логи<br>Повторювані сеанси + авто-рахунки<br>GitHub Actions CI (lint + test)<br>E2E та unit тести<br>Dockerised onboarding | ACL roles + audit logs<br>Recurring appointments + invoices<br>GitHub Actions CI<br>E2E & unit tests<br>Dockerised dev env |

---

## ✉️ Contact / Контакти
```
info@nkz.com.ua
```

---

## 📄 License <a id="license"></a>
MIT — ви вільні форкати та робити pull‑requests / feel free to fork & contribute.

