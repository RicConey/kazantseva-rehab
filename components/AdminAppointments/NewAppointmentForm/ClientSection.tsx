// components/appointments/ClientSection.tsx
'use client';

import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import styles from '../../AdminAppointments.module.css';

interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

type Mode = 'existing' | 'new' | 'free';

interface Props {
  mode: Mode;
  loadingClients: boolean;
  loadingAdd: boolean;
  clients: ClientOption[];
  form: {
    existingClientId: string;
    freeName: string;
    newPhone: string;
    newName: string;
    newBirthDate: string;
    newNotes: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function ClientSection({
  mode,
  loadingClients,
  loadingAdd,
  clients,
  form,
  setForm,
}: Props) {
  const [clientQuery, setClientQuery] = useState('');
  const [filtered, setFiltered] = useState<ClientOption[]>([]);
  const [showSug, setShowSug] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sugRef = useRef<HTMLDivElement>(null);

  // підвантаження клієнтів у поле existing
  useEffect(() => {
    const q = clientQuery.trim().toLowerCase();
    const digits = clientQuery.replace(/\D/g, '');
    if (q.length < 3) {
      setFiltered([]);
      return;
    }
    setFiltered(
      clients.filter(
        c => c.name.toLowerCase().includes(q) || (digits.length > 0 && c.phone.includes(digits))
      )
    );
  }, [clientQuery, clients]);

  // синхронізуємо clientQuery з existingClientId
  useEffect(() => {
    if (!form.existingClientId) return;
    const found = clients.find(c => c.id === form.existingClientId);
    if (found && clientQuery !== found.name) {
      setClientQuery(found.name);
    }
  }, [form.existingClientId, clients, clientQuery]);

  // клік поза полем — ховаємо підказки
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        showSug &&
        sugRef.current &&
        inputRef.current &&
        !sugRef.current.contains(e.target as Node) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSug(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showSug]);

  const pickClient = (c: ClientOption) => {
    setForm((f: any) => ({ ...f, existingClientId: c.id }));
    setClientQuery(c.name);
    setShowSug(false);
  };

  const formatPhone = (v: string) => {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('38')) d = d.slice(2);
    return '+38' + d.slice(0, 10);
  };

  if (mode === 'existing') {
    return (
      <div className={styles.field} style={{ position: 'relative' }}>
        <label>Клієнт</label>
        {form.existingClientId ? (
          <div className={styles.staticField}>{clientQuery}</div>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Введіть мін. 3 символи"
              value={clientQuery}
              onChange={e => {
                setClientQuery(e.target.value);
                setForm((f: any) => ({ ...f, existingClientId: '' }));
                setShowSug(e.target.value.length >= 3);
              }}
              disabled={loadingClients || loadingAdd}
            />
            {showSug && filtered.length > 0 && (
              <div ref={sugRef} className={styles.suggestions}>
                {filtered.map(c => (
                  <div key={c.id} className={styles.suggestionItem} onClick={() => pickClient(c)}>
                    {c.name} – {c.phone}
                  </div>
                ))}
              </div>
            )}
            <input type="hidden" value={form.existingClientId} readOnly />
          </>
        )}
      </div>
    );
  }

  if (mode === 'new') {
    return (
      <div className={styles.newClientSection}>
        <div className={styles.field}>
          <label>Телефон</label>
          <input
            type="text"
            className={styles.input}
            value={form.newPhone}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f: any) => ({ ...f, newPhone: formatPhone(e.target.value) }))
            }
            maxLength={13}
            required
            disabled={loadingAdd}
          />
        </div>
        <div className={styles.field}>
          <label>Ім’я</label>
          <input
            type="text"
            className={styles.input}
            value={form.newName}
            onChange={e => setForm((f: any) => ({ ...f, newName: e.target.value }))}
            required
            disabled={loadingAdd}
          />
        </div>
        <div className={styles.field}>
          <label>Дата нар.</label>
          <input
            type="date"
            className={styles.input}
            value={form.newBirthDate}
            onChange={e => setForm((f: any) => ({ ...f, newBirthDate: e.target.value }))}
            required
            disabled={loadingAdd}
          />
        </div>
        <div className={styles.field}>
          <label>Нотатки</label>
          <textarea
            className={styles.input}
            value={form.newNotes}
            onChange={e => setForm((f: any) => ({ ...f, newNotes: e.target.value }))}
            disabled={loadingAdd}
          />
        </div>
      </div>
    );
  }

  // mode === 'free'
  return (
    <div className={styles.field}>
      <label>Ім’я клієнта</label>
      <input
        type="text"
        className={styles.input}
        value={form.freeName}
        onChange={e => setForm((f: any) => ({ ...f, freeName: e.target.value }))}
        required
        disabled={loadingAdd}
      />
    </div>
  );
}
