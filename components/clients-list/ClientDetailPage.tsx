'use client';

import ClientDetail, { Client as ClientType, Session } from './ClientDetail';

interface Props {
  client: ClientType; // уже содержит id, name, phone, birthDate, notes
  sessions: Session[]; // список всех сеансов
}

export default function ClientDetailPage({ client, sessions }: Props) {
  // Просто прокидываем в низ,
  // вся логика отображения и редактирования — внутри ClientDetail
  return <ClientDetail client={client} sessions={sessions} />;
}
