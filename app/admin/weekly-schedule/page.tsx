// app/admin/weekly-schedule/page.tsx

import WeeklySchedule from '../../../components/AdminAppointments/WeeklySchedule';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WeeklySchedulePage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  if (!session) {
    // Если нет — перенаправляем на страницу входа
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый компонент
  return <WeeklySchedule />;
}
