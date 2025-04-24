// app/admin/appointments/page.tsx

import AdminAppointments from '../../../components/AdminAppointments';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  // Если пользователь не авторизован — перенаправляем на страницу входа
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый компонент
  return <AdminAppointments />;
}
