// app/admin/prices/page.tsx

import { getServerSession } from 'next-auth';
import { authConfig } from '../../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';
import AdminPrices from '../../../components/AdminPrices/AdminPrices';

export const dynamic = 'force-dynamic';

export default async function AdminPricesPage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  // Если нет — перенаправляем на страницу входа
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый компонент
  return <AdminPrices />;
}
