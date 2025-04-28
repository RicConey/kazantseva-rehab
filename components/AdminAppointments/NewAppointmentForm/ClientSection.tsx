// components/appointments/ClientSection.tsx
'use client';

import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import styles from '../../AdminAppointments.module.css';

interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

interface LocationOption {
  id: number;
  name: string;
}

type Mode = 'existing' | 'new' | 'free';

interface Props {
  mode: Mode;
  loadingClients: boolean;
  loadingAdd: boolean;
  clients: ClientOption[];
  locations: LocationOption[];
  form: {
    existingClientId: string;
    freeName: string;
    newPhone: string;
    newName: string;
    newBirthDate: string;
    newNotes: string;
    messengerTypes: Array<'telegram' | 'whatsapp' | 'viber'>;
    locationId: number | '';
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
}

export default function ClientSection({
  mode,
  loadingClients,
  loadingAdd,
  clients,
  locations,
  form,
  setForm,
}: Props) {
  // Поиск среди существующих клиентов
  const [clientQuery, setClientQuery] = useState('');
  const [filtered, setFiltered] = useState<ClientOption[]>([]);
  const [showSug, setShowSug] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sugRef = useRef<HTMLDivElement>(null);

  // Фильтрация при вводе (минимум 3 символа)
  useEffect(() => {
    const q = clientQuery.trim().toLowerCase();
    if (mode === 'existing' && q.length >= 3) {
      const digits = clientQuery.replace(/\D/g, '');
      const results = clients.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const phoneDigits = c.phone.replace(/\D/g, '');
        const phoneMatch = digits.length > 0 && phoneDigits.includes(digits);
        return nameMatch || phoneMatch;
      });
      setFiltered(results);
      setShowSug(true);
    } else {
      setFiltered([]);
      setShowSug(false);
    }
  }, [clientQuery, clients, mode]);

  // Скрыть выпадашку при клике вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sugRef.current &&
        !sugRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSug(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMessenger = (type: 'telegram' | 'whatsapp' | 'viber') => {
    setForm((f: any) => {
      const arr: typeof f.messengerTypes = f.messengerTypes.includes(type)
        ? f.messengerTypes.filter((t: string) => t !== type)
        : [...f.messengerTypes, type];
      return { ...f, messengerTypes: arr };
    });
  };

  const formatPhone = (v: string) => {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('38')) d = d.slice(2);
    return '+38' + d.slice(0, 10);
  };

  // Подсветка совпадений фирменным цветом
  const highlight = (text: string, q: string) => {
    if (!q) return text;
    const escaped = q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Селект кабинета
  const LocationSelect = (
    <div className={styles.field}>
      <label htmlFor="location">Кабінет</label>
      <select
        id="location"
        className={styles.input}
        required
        disabled={loadingAdd}
        value={form.locationId}
        onChange={e => setForm((f: any) => ({ ...f, locationId: +e.target.value }))}
      >
        {locations.map(loc => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );

  if (mode === 'existing') {
    return (
      <>
        {LocationSelect}
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
                }}
                disabled={loadingClients || loadingAdd}
              />
              {showSug && filtered.length > 0 && (
                <div ref={sugRef} className={styles.suggestions}>
                  {filtered.map(c => (
                    <div
                      key={c.id}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setForm((f: any) => ({
                          ...f,
                          existingClientId: c.id,
                        }));
                        setClientQuery(c.name);
                        setShowSug(false);
                      }}
                    >
                      {highlight(c.name, clientQuery)} – {highlight(c.phone, clientQuery)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  if (mode === 'new') {
    return (
      <>
        {LocationSelect}
        <div className={styles.newClientSection}>
          <div
            className={styles.field}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <label style={{ marginRight: '0.5rem', whiteSpace: 'nowrap' }}>Телефон</label>
            <input
              type="text"
              className={styles.input}
              value={form.newPhone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setForm((f: any) => ({
                  ...f,
                  newPhone: formatPhone(e.target.value),
                }))
              }
              maxLength={13}
              required
              disabled={loadingAdd}
              style={{ flex: '1 1 auto' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto' }}>
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
                      width: 20,
                      height: 20,
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
      </>
    );
  }

  // mode === 'free'
  return (
    <>
      {LocationSelect}
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
    </>
  );
}
