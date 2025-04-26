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

// Формат номера (067)272-94-94
function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('38') ? digits.slice(2) : digits;
  if (local.length !== 10) return phone;
  return `(${local.slice(0, 3)})${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`;
}

export default function ClientsList({ clients }: Props) {
  // Локальный стейт для живых обновлений
  const [localClients, setLocalClients] = useState<Client[]>(clients);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ phone: '', name: '', birthDate: '', notes: '' });
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // авто-растяжка textarea
  useEffect(() => {
    if (notesRef.current) {
      const ta = notesRef.current;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
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

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
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
      alert('Помилка збереження');
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
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Телефон</th>
            <th>Ім’я</th>
            <th>Д/н</th>
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
                    <td colSpan={4}>
                      <div className={styles.mobileEditCard}>
                        <div className={styles.mobileEditField}>
                          <label>Телефон</label>
                          <input
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            className={styles.mobileInput}
                          />
                        </div>

                        <div className={styles.mobileEditField}>
                          <label>Ім’я</label>
                          <input
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            className={styles.mobileInput}
                          />
                        </div>

                        <div className={styles.mobileEditField}>
                          <label>Д/н</label>
                          <input
                            type="date"
                            value={form.birthDate}
                            onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                            className={styles.mobileInput}
                          />
                        </div>

                        <div className={styles.actionsMobile}>
                          <button onClick={() => handleSave(c.id)} className={styles.saveButton}>
                            Зберегти
                          </button>
                          <button onClick={handleCancel} className={styles.cancelButton}>
                            Скасувати
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td data-label="Телефон">
                    <a href={`tel:${c.phone}`} style={{ color: '#249b89' }}>
                      {formatPhoneDisplay(c.phone)}
                    </a>
                  </td>
                  <td data-label="Ім’я">
                    <Link href={`/admin/clients/${c.id}`}>{c.name}</Link>
                  </td>
                  <td data-label="Дата народження">{c.birthDate.toLocaleDateString('uk-UA')}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
