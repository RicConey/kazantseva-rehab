// app/admin/page.tsx

import { getServerSession } from 'next-auth';
import { authConfig } from '../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';
import WeeklySchedule from '@components/AdminAppointments/WeeklySchedule';

export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  // Если не авторизован — редирект на страницу входа
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый UI
  return <WeeklySchedule />;
}
