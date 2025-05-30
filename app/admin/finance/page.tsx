// app/admin/finance/page.tsx

import FinanceOverview from '../../../components/FinanceOverview';
import { getServerSession } from 'next-auth';
import { authConfig } from '../../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Фінансова звітність',
};

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  // Если нет — перенаправляем на страницу входа
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый компонент
  return (
    <main className="p-6">
      <FinanceOverview />
    </main>
  );
}
