// app/admin/clients/[id]/page.tsx

import { requireAdmin } from '@lib/auth';
import prisma from '@lib/prisma';
import ClientDetailPage from '@components/clients-list/ClientDetailPage';
import { Session } from '@components/clients-list/ClientDetail';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // Ждём id из URL
  const { id } = await params;

  // Берём клиента с его сеансами
  const clientData = await prisma.client.findUnique({
    where: { id },
    include: { appointments: true },
  });

  if (!clientData) {
    return <p>Клієнт не знайдений.</p>;
  }

  // Собираем массив сеансов
  const sessions: Session[] = clientData.appointments
    .map(a => {
      const start = new Date(a.startTime);
      const end = new Date(start.getTime() + a.duration * 60000);
      return {
        id: a.id,
        start,
        end,
        duration: a.duration,
        price: a.price,
      };
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime());

  // Рендерим страницу с флагом загрузки false
  return (
    <ClientDetailPage
      client={{
        id: clientData.id,
        name: clientData.name,
        phone: clientData.phone,
        birthDate: new Date(clientData.birthDate),
        notes: clientData.notes ?? null,
      }}
      sessions={sessions}
      sessionsLoading={false}
    />
  );
}
