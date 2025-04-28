// components/ClientsList.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from '../AdminAppointments.module.css';

export type Client = {
  id: string;
  phone: string;
  name: string;
  birthDate: Date;
  notes?: string | null;
};

interface Props {
  clients: Client[];
}

// Формат номера для таблиці (067)272-94-94
function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('38') ? digits.slice(2) : digits;
  if (local.length !== 10) return phone;
  return `(${local.slice(0, 3)})${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`;
}

// Повний номер +380…
function getRawPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('380')) return `+${digits}`;
  if (digits.startsWith('0')) return `+38${digits}`;
  return `+${digits}`;
}

// Екранізація спецсимволів для RegExp
function escapeRegExp(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// Підсвічування збігів
function getHighlightedText(text: string, highlight: string): React.ReactNode[] {
  if (!highlight) return [text];
  const escaped = escapeRegExp(highlight);
  const regex = new RegExp(`(${escaped})`, 'i');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className={styles.highlight}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function ClientsList({ clients }: Props) {
  const [localClients, setLocalClients] = useState<Client[]>(clients);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: '',
    name: '',
    birthDate: '',
    notes: '',
  });
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Пошук
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const digits = searchTerm.replace(/\D/g, '');
  const lowerTerm = searchTerm.toLowerCase();

  const filteredSuggestions =
    searchTerm.length >= 3
      ? localClients.filter(c => {
          const phoneDigits = c.phone.replace(/\D/g, '');
          const phoneMatch = digits.length > 0 && phoneDigits.includes(digits);
          const nameMatch = c.name.toLowerCase().includes(lowerTerm);
          return phoneMatch || nameMatch;
        })
      : [];

  // Ховаємо дропдаун при кліку поза
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Авто-розтяжка textarea
  useEffect(() => {
    if (notesRef.current) {
      const ta = notesRef.current;
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [form.notes, editingId]);

  const handleEditClick = (c: Client) => {
    setEditingId(c.id);
    setForm({
      phone: c.phone,
      name: c.name,
      birthDate: c.birthDate.toISOString().split('T')[0],
      notes: c.notes || '',
    });
  };
  const handleCancel = () => setEditingId(null);

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          name: form.name,
          birthDate: form.birthDate,
          notes: form.notes,
        }),
      });
      if (!res.ok) {
        let message = 'Невідома помилка збереження.';
        if (res.status === 409) message = 'Клієнт з таким номером телефону вже існує.';
        else if (res.status === 503) message = 'Сервер тимчасово недоступний.';
        else {
          const err = await res.json().catch(() => null);
          if (err?.message) message = err.message;
        }
        alert(message);
        return;
      }
      const updated = await res.json();
      setLocalClients(prev =>
        prev.map(c =>
          c.id === id
            ? {
                ...c,
                phone: updated.phone,
                name: updated.name,
                birthDate: new Date(updated.birthDate),
                notes: updated.notes,
              }
            : c
        )
      );
      setEditingId(null);
    } catch {
      alert('Неможливо зʼєднатися з сервером. Перевірте підключення.');
    }
  };

  return (
    <div className={styles.tableWrapper}>
      {/* Пошукова стрічка */}
      <div ref={wrapperRef} style={{ marginBottom: '1rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Пошук за телефоном або ПІБ..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
        />
        {isFocused && searchTerm.length >= 3 && filteredSuggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '280px',
              overflow: 'auto',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              zIndex: 1000,
              boxSizing: 'border-box',
            }}
          >
            {filteredSuggestions.map(c => {
              const rawPhone = getRawPhone(c.phone);
              return (
                <Link
                  key={c.id}
                  href={`/admin/clients/${c.id}`}
                  onClick={() => setIsFocused(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem',
                    textDecoration: 'none',
                    color: '#000',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {getHighlightedText(rawPhone, searchTerm)} —{' '}
                  {getHighlightedText(c.name, searchTerm)}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Телефон</th>
            <th style={{ textAlign: 'center' }}>ФІО</th>
            <th style={{ textAlign: 'center' }}>Д/н</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localClients.map(c => (
            <React.Fragment key={c.id}>
              {editingId === c.id ? (
                <>
                  <tr className={styles.editingRow}>
                    <td>
                      <input
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={form.birthDate}
                        onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                        className={styles.input}
                      />
                    </td>
                    <td className={styles.actions}>
                      <button onClick={() => handleSave(c.id)}>Зберегти</button>
                      <button onClick={handleCancel}>Скасувати</button>
                    </td>
                  </tr>
                  <tr className={styles.mobileEditingRow}>
                    <td colSpan={4}>{/* мобильная версия редактирования */}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td data-label="Телефон" style={{ whiteSpace: 'nowrap' }}>
                    <a href={`tel:${c.phone}`} style={{ color: '#249b89', whiteSpace: 'nowrap' }}>
                      {formatPhoneDisplay(c.phone)}
                    </a>
                  </td>
                  <td data-label="ФІО" style={{ textAlign: 'center' }}>
                    <Link href={`/admin/clients/${c.id}`} style={{ color: '#249b89' }}>
                      {c.name}
                    </Link>
                  </td>
                  <td data-label="Д/н" style={{ textAlign: 'center' }}>
                    {c.birthDate.toLocaleDateString('uk-UA')}
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEditClick(c)}>Редагувати</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
