// components/clients-list/ClientDetail.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Check, X } from 'lucide-react';
import styles from '../AdminAppointments.module.css';
import { FaSpinner } from 'react-icons/fa';

export interface Session {
  id: number;
  start: Date;
  end: Date;
  duration: number;
  price: number;
  location: { id: number; name: string }; // добавлено поле локації
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  birthDate: Date;
  notes?: string | null;
  // теперь массив мессенджеров
  messengerTypes?: Array<'telegram' | 'whatsapp' | 'viber'>;
}

interface Props {
  client: Client;
  sessions?: Session[];
  sessionsLoading: boolean;
}

export default function ClientDetail({ client, sessions = [], sessionsLoading }: Props) {
  const router = useRouter();

  const toLocalDateInputValue = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: client.name,
    phone: client.phone,
    birthDate: toLocalDateInputValue(client.birthDate),
    notes: client.notes || '',
    messengerTypes: client.messengerTypes || [],
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const notesEditRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && notesEditRef.current) {
      const ta = notesEditRef.current;
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [form.notes, isEditing]);

  const toggleMessenger = (type: 'telegram' | 'whatsapp' | 'viber') => {
    setForm(f => {
      const arr = f.messengerTypes.includes(type)
        ? f.messengerTypes.filter(t => t !== type)
        : [...f.messengerTypes, type];
      return { ...f, messengerTypes: arr };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          birthDate: form.birthDate,
          notes: form.notes.trim() || null,
          // вот тут он и «сохраняется»
          messengerTypes: form.messengerTypes,
        }),
      });
      setIsEditing(false);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // формируем ссылки на каждую платформу
  const messengerLinks: Record<string, string> = {
    whatsapp: `https://wa.me/${client.phone.replace(/\D/g, '')}`,
    viber: `viber://chat?number=%2B${client.phone.replace(/\D/g, '')}`,
    telegram: `https://t.me/+${client.phone.replace(/\D/g, '')}`,
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.formCard}>
          <h2 className={styles.title}>Редагування клієнта</h2>

          {/* Ім’я */}
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

          {/* Телефон */}
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

          {/* Мессенджери – три иконки-чекбокса */}
          <div className={styles.field}>
            <label className={styles.label}>Месенджери</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['telegram', 'whatsapp', 'viber'] as const).map(type => (
                <label key={type} style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.messengerTypes.includes(type)}
                    onChange={() => toggleMessenger(type)}
                    style={{ display: 'none' }}
                  />
                  <img
                    src={`/icons/${type}.svg`}
                    alt={type}
                    style={{
                      width: 24,
                      height: 24,
                      opacity: form.messengerTypes.includes(type) ? 1 : 0.3,
                      border: form.messengerTypes.includes(type)
                        ? '2px solid #249b89'
                        : '2px solid transparent',
                      borderRadius: 4,
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Дата народження */}
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

          {/* Нотатки */}
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
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={styles.submitButton}
              disabled={saving}
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.formCard}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
          >
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#249b89' }}>
              {client.name}
            </h2>
            <button onClick={() => setIsEditing(true)} className={styles.submitButton}>
              <Pencil size={16} />
            </button>
          </div>

          {/* Телефон + иконки */}
          <div className={styles.field} style={{ justifyContent: 'flex-start' }}>
            <label
              className={styles.label}
              style={{
                color: '#249b89',
                fontWeight: 'bold',
                marginRight: '0.5rem',
                minWidth: 0,
              }}
            >
              Телефон
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <a href={`tel:${client.phone}`} className={styles.staticField}>
                {client.phone}
              </a>
              {client.messengerTypes?.map(type => (
                <a key={type} href={messengerLinks[type]} target="_blank" rel="noopener noreferrer">
                  <img src={`/icons/${type}.svg`} alt={type} style={{ width: 20, height: 20 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Дата народження */}
          <div className={styles.field}>
            <label className={styles.label} style={{ color: '#249b89', fontWeight: 'bold' }}>
              Дата народження
            </label>
            <div className={styles.staticField}>{client.birthDate.toLocaleDateString('uk-UA')}</div>
          </div>

          {/* Нотатки */}
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

      {/* Сеанси клієнта */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          margin: '1rem 0',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#249b89' }}>
          Сеанси клієнта
        </h2>
        <button
          onClick={() =>
            router.push(`/admin/appointments?date=${new Date().toISOString().slice(0, 10)}`)
          }
          className={styles.addButton}
          aria-label="Додати сеанс"
        >
          <Pencil size={16} />
        </button>
      </div>

      {sessionsLoading ? (
        <div className={styles.loadingWrapper}>
          <FaSpinner className={styles.spin} />
          <span className={styles.loadingText}>Завантаження сеансів…</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className={styles.loadingWrapper}>
          <span>Немає сеансів</span>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Час</th>
                <th>Локація</th>
                <th>Хв</th>
                <th>Ціна</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr
                  key={s.id}
                  className={(() => {
                    const d = new Date(s.start);
                    d.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (d.getTime() === today.getTime()) return styles.currentSession;
                    if (d < today) return styles.pastSession;
                    return styles.futureSession;
                  })()}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    router.push(`/admin/appointments?date=${s.start.toISOString().slice(0, 10)}`)
                  }
                >
                  <td>{s.start.toLocaleDateString('uk-UA')}</td>
                  <td>
                    {s.start.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}–
                    {s.end.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>{s.location?.name ?? '—'}</td>
                  <td>{s.duration}</td>
                  <td>{s.price} ₴</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
