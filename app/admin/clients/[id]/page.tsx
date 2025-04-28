// app/admin/clients/[id]/page.tsx

import React from 'react';
import { requireAdmin } from '@lib/auth';
import prisma from '@lib/prisma';
import ClientDetailPage from '@components/clients-list/ClientDetailPage';
import { Session, Client } from '@components/clients-list/ClientDetail';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Авторизация
  const denied = await requireAdmin();
  if (denied) return denied;

  // Ждём id из URL
  const { id } = await params;

  // Берём клиента с его сеансами и каждой сессией с локацией
  const clientData = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        include: {
          location: true, // подключаем локацию
        },
      },
    },
  });

  if (!clientData) {
    return <p>Клієнт не знайдений.</p>;
  }

  // Собираем массив сеансов с полем location
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
        location: { id: a.location.id, name: a.location.name },
      };
    })
    .sort((a, b) => b.start.getTime() - a.start.getTime());

  // Фильтруем типы мессенджеров
  const rawTypes = clientData.messengerTypes ?? [];
  const allowed = ['telegram', 'whatsapp', 'viber'] as const;
  const messengerTypes = rawTypes.filter((t): t is (typeof allowed)[number] =>
    allowed.includes(t as any)
  );

  // Собираем объект client для передачи
  const client: Client = {
    id: clientData.id,
    name: clientData.name,
    phone: clientData.phone,
    birthDate: new Date(clientData.birthDate),
    notes: clientData.notes ?? null,
    messengerTypes,
  };

  return <ClientDetailPage client={client} sessions={sessions} sessionsLoading={false} />;
}
