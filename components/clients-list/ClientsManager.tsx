// components/clients-list/ClientsManager.tsx
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import ClientsList, { Client as ClientType } from './ClientsList';
import styles from '../AdminAppointments.module.css';
import mobileStyles from './ClientsManager.module.css';
import { Loader2 } from 'lucide-react'; // импорт спиннера

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
  });

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then((data: any[]) => {
        const parsed = data.map(c => ({
          ...c,
          birthDate: new Date(c.birthDate),
          createdAt: new Date(c.createdAt),
        }));
        setClients(parsed);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
        }),
      });

      const data = await res.json().catch(() => ({}) as { message?: string });

      if (!res.ok) {
        const message = data.message || 'Помилка створення клієнта';
        throw new Error(message);
      }

      const newClient = data;
      setClients(prev => [
        {
          ...newClient,
          birthDate: new Date(newClient.birthDate),
          createdAt: new Date(newClient.createdAt),
        },
        ...prev,
      ]);

      setShowForm(false);
      setForm({ phone: '+38', fio: '', birthDate: '', notes: '' });
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

          <input
            type="text"
            value={form.phone}
            onChange={handlePhoneChange}
            maxLength={13}
            required
            placeholder="Телефон"
          />

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
            title="Дата народження клієнта"
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

          <div style={{ marginTop: '8px', textAlign: 'left' }}>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Завантаження...' : 'Створити клієнта'}
            </button>
          </div>
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
