// components/clients-list/ClientInfo.tsx
'use client';

import React from 'react';

interface Props {
  name: string;
  phone: string;
  birthDate: Date;
  notes?: string | null;
}

export default function ClientInfo({ name, phone, birthDate, notes }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl mb-2">{name}</h1>
      <p>
        <strong>Телефон:</strong> {phone}
      </p>
      <p>
        <strong>Дата народження:</strong> {birthDate.toLocaleDateString('uk-UA')}
      </p>
      <p>
        <strong>Нотатки:</strong> {notes || '—'}
      </p>
    </div>
  );
}
