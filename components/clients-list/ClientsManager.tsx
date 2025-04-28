// components/clients-list/ClientsManager.tsx
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import ClientsList, { Client as ClientType } from './ClientsList';
import styles from '../AdminAppointments.module.css';
import mobileStyles from './ClientsManager.module.css';
import { Loader2 } from 'lucide-react';

function parseDateDMY(str: string): string {
  const [y, m, d] = str.split('-');
  return `${d}.${m}.${y}`;
}

export default function ClientsManager() {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState({
    phone: '+38',
    fio: '',
    birthDate: '',
    notes: '',
    messengerTypes: [] as Array<'telegram' | 'whatsapp' | 'viber'>,
  });

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then((data: any[]) => {
        setClients(
          data.map(c => ({
            ...c,
            birthDate: new Date(c.birthDate),
            createdAt: new Date(c.createdAt),
          }))
        );
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleMessenger = (type: 'telegram' | 'whatsapp' | 'viber') => {
    setForm(f => {
      const arr = f.messengerTypes.includes(type)
        ? f.messengerTypes.filter(t => t !== type)
        : [...f.messengerTypes, type];
      return { ...f, messengerTypes: arr };
    });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.startsWith('38')) digits = digits.slice(2);
    digits = digits.slice(0, 10);
    setForm(f => ({ ...f, phone: '+38' + digits }));
  };

  const handleNotesInput = () => {
    const ta = notesRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.phone.length !== 13) {
      setError('Номер телефону має містити +38 і 10 цифр');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone.trim(),
          name: form.fio.trim(),
          birthDate: parseDateDMY(form.birthDate),
          notes: form.notes.trim() || null,
          messengerTypes: form.messengerTypes,
        }),
      });
      const data = await res.json().catch(() => ({}) as any);
      if (!res.ok) throw new Error(data.message || 'Помилка створення клієнта');

      setClients(prev => [
        { ...data, birthDate: new Date(data.birthDate), createdAt: new Date(data.createdAt) },
        ...prev,
      ]);
      setShowForm(false);
      setForm({ phone: '+38', fio: '', birthDate: '', notes: '', messengerTypes: [] });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-start mb-4">
        <button
          onClick={() => {
            setError(null);
            setShowForm(s => !s);
          }}
          className={styles.addButton}
        >
          {showForm ? 'Скасувати' : 'Додати клієнта'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={`${styles.form} ${mobileStyles.formMobile}`}>
          {error && <p className={styles.error}>{error}</p>}

          {/* Телефон и иконки мессенджеров в одном ряду */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px' }}
          >
            <input
              type="text"
              value={form.phone}
              onChange={handlePhoneChange}
              maxLength={13}
              required
              placeholder="Телефон"
              style={{ flex: '0 0 auto' }}
            />
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

          <input
            type="text"
            value={form.fio}
            onChange={e => setForm(f => ({ ...f, fio: e.target.value }))}
            maxLength={100}
            required
            placeholder="ФІО"
          />

          <input
            type="date"
            value={form.birthDate}
            onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
            required
          />

          <textarea
            ref={notesRef}
            rows={3}
            value={form.notes}
            onChange={e => {
              setForm(f => ({ ...f, notes: e.target.value }));
              handleNotesInput();
            }}
            placeholder="Нотатки"
            className="resize-none"
            style={{ overflow: 'hidden' }}
          />

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Завантаження...' : 'Створити клієнта'}
          </button>
        </form>
      )}

      {loading ? (
        <div className={mobileStyles.loadingWrapper}>
          <Loader2 className={mobileStyles.spinner} />
          <span className={mobileStyles.loadingText}>Завантаження даних…</span>
        </div>
      ) : (
        <ClientsList clients={clients} />
      )}
    </div>
  );
}
