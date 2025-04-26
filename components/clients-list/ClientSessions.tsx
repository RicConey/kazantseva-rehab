// components/clients-list/ClientSessions.tsx
'use client';

import React from 'react';

export interface Session {
  id: number;
  start: Date;
  end: Date;
  duration: number;
  price: number;
}

interface Props {
  sessions: Session[];
}

export default function ClientSessions({ sessions }: Props) {
  const fmtDate = (d: Date) => d.toLocaleDateString('uk-UA');
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  return (
    <ul className="list-disc pl-6">
      {sessions.map(s => (
        <li key={s.id} className="mb-1">
          {fmtDate(s.start)} {fmtTime(s.start)}–{fmtTime(s.end)} — {s.duration} хв — {s.price} ₴
        </li>
      ))}
    </ul>
  );
}
