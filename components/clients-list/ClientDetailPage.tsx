// components/clients-list/ClientDetailPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ClientDetail, { Client, Session } from './ClientDetail';

interface Props {
  client: Client;
  sessions?: Session[];
  sessionsLoading?: boolean;
}

export default function ClientDetailPage({
  client,
  sessions: initialSessions,
  sessionsLoading: initialLoading = true,
}: Props) {
  const [sessions, setSessions] = useState<Session[] | undefined>(initialSessions);
  const [loading, setLoading] = useState(initialLoading);

  // Если данные пришли сразу — отключаем спиннер
  useEffect(() => {
    if (initialLoading && initialSessions !== undefined) {
      setLoading(false);
    }
  }, [initialLoading, initialSessions]);

  return <ClientDetail client={client} sessions={sessions} sessionsLoading={loading} />;
}
