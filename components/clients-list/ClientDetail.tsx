'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Check, X, Plus } from 'lucide-react';
import styles from '../AdminAppointments.module.css';

export interface Session {
  id: number;
  start: Date;
  end: Date;
  duration: number;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  birthDate: Date;
  notes?: string | null;
}

interface Props {
  client: Client;
  sessions: Session[];
}

export default function ClientDetail({ client, sessions }: Props) {
  const router = useRouter();

  const toLocalDateInputValue = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
      2,
      '0'
    )}`;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: client.name,
    phone: client.phone,
    birthDate: toLocalDateInputValue(client.birthDate),
    notes: client.notes || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const notesEditRef = useRef<HTMLTextAreaElement>(null);

  // Автоматичне розтягування textarea нотаток
  useEffect(() => {
    if (isEditing && notesEditRef.current) {
      const ta = notesEditRef.current;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [form.notes, isEditing]);

  const fmtDate = (d: Date) => d.toLocaleDateString('uk-UA');
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const getRowClass = (start: Date) => {
    const d = new Date(start);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return styles.currentSession;
    else if (d.getTime() < today.getTime()) return styles.pastSession;
    else return styles.futureSession;
  };

  const handleRowClick = (date: Date) => {
    const iso = date.toISOString().split('T')[0];
    router.push(`/admin/appointments?date=${iso}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          birthDate: form.birthDate,
          notes: form.notes.trim() || null,
        }),
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(json.message || res.statusText);

      setIsEditing(false);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const todayIso = new Date().toISOString().split('T')[0];

  // Стиль заголовків
  const headerStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#249b89',
    textAlign: 'center',
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.formCard}>
          <h2 className={styles.title}>Редагування клієнта</h2>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Ім’я
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.twoColumnsRow}>
            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="birthDate" className={styles.label}>
                Дата народження
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label
              htmlFor="notes"
              className={styles.label}
              style={{ color: '#249b89', fontWeight: 'bold' }}
            >
              Нотатки
            </label>
            <textarea
              id="notes"
              name="notes"
              ref={notesEditRef}
              value={form.notes}
              onChange={handleChange}
              className={styles.textarea}
              style={{ overflow: 'hidden' }}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.modeButtonsRow}>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
              disabled={saving}
              aria-label="Скасувати"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={styles.submitButton}
              disabled={saving}
              aria-label="Зберегти"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.formCard}>
          {/* Ім’я клієнта з кнопкою редагування */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <h2 style={headerStyle}>{client.name}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.submitButton}
              aria-label="Редагувати"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ color: '#249b89', fontWeight: 'bold' }}>
              Телефон
            </label>
            <a href={`tel:${client.phone}`} className={styles.staticField}>
              {client.phone}
            </a>
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ color: '#249b89', fontWeight: 'bold' }}>
              Дата народження
            </label>
            <div className={styles.staticField}>{fmtDate(client.birthDate)}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ color: '#249b89', fontWeight: 'bold' }}>
              Нотатки
            </label>
            <div className={styles.staticField} style={{ whiteSpace: 'pre-wrap' }}>
              {client.notes || '—'}
            </div>
          </div>
        </div>
      )}

      {/* Сеанси клієнта з кнопкою "+" поруч */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          margin: '1rem 0',
        }}
      >
        <h2 style={headerStyle}>Сеанси клієнта</h2>
        <button
          onClick={() => router.push(`/admin/appointments?date=${todayIso}`)}
          className={styles.addButton}
          aria-label="Додати сеанс"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Час</th>
              <th>Тривалість</th>
              <th>Ціна</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr
                key={s.id}
                className={getRowClass(s.start)}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(s.start)}
              >
                <td>{fmtDate(s.start)}</td>
                <td>
                  {fmtTime(s.start)}–{fmtTime(s.end)}
                </td>
                <td>{s.duration} хв</td>
                <td>{s.price} ₴</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
