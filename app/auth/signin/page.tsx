// app/auth/signin/page.tsx
import SignInForm from './SignInForm';
import { cookies } from 'next/headers';

export default async function SignInPage() {
  // 1) Собираем все куки в строку "name=value; name2=value2"
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  // 2) Делаем fetch к эндпоинту CSRF NextAuth
  //    cache: 'no-store' гарантирует, что не будет кэша между запросами
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ''}/api/auth/csrf`, {
    headers: {
      // передаём туда куки, чтобы NextAuth мог прочитать/установить
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    // на случай, если CSRF эндпоинт не отработал — можно залогировать и вернуть пустую форму
    console.error('Failed to fetch CSRF token', await res.text());
  }

  const data = (await res.json()) as { csrfToken?: string };
  const csrfToken = data.csrfToken ?? '';

  // 3) Рендерим ваш клиентский компонент
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <SignInForm csrfToken={csrfToken} />
      </div>
    </div>
  );
}
