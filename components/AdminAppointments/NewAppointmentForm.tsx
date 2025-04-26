'use client';

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from '../AdminAppointments.module.css';

interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

interface Props {
  todayStr: string;
  onCreated?: () => void;
}

type Mode = 'existing' | 'new' | 'free';

export default function NewAppointmentForm({ todayStr, onCreated }: Props) {
  // локальное состояние показа формы
  const [open, setOpen] = useState(false);

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [mode, setMode] = useState<Mode>('existing');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState<string>();

  const [clientQuery, setClientQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<ClientOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    existingClientId: '',
    freeName: '',
    newPhone: '+38',
    newName: '',
    newBirthDate: '',
    newNotes: '',
    date: '',
    time: '',
    duration: '',
    notes: '',
    price: '',
  });

  // 1) Загрузить клиентов
  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then((data: any[]) =>
        setClients(data.map(c => ({ id: c.id, name: c.name, phone: c.phone })))
      )
      .catch(() => setClients([]))
      .finally(() => setLoadingClients(false));
  }, []);

  // 2) Подсказки после 3 символов
  useEffect(() => {
    const query = clientQuery.trim().toLowerCase();
    const digits = clientQuery.replace(/\D/g, '');

    if (query.length < 3) {
      setFilteredClients([]);
      return;
    }

    setFilteredClients(
      clients.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(query);
        const phoneMatch = digits.length > 0 && c.phone.includes(digits);
        return nameMatch || phoneMatch;
      })
    );
  }, [clientQuery, clients]);
  // 2.5) Устанавливаем clientQuery по existingClientId
  useEffect(() => {
    if (!form.existingClientId || !clients.length) return;

    const match = clients.find(c => c.id === form.existingClientId);
    if (match && clientQuery !== match.name) {
      setClientQuery(match.name);
    }
  }, [clients, form.existingClientId, clientQuery]);
  // 3) Клик вне — скрываем подсказки
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        showSuggestions &&
        suggestionsRef.current &&
        inputRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [showSuggestions]);

  const handleClientSelect = (c: ClientOption) => {
    setForm(f => ({ ...f, existingClientId: c.id }));
    setClientQuery(c.name);
    setShowSuggestions(false);
  };

  const formatPhone = (v: string) => {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('38')) d = d.slice(2);
    return '+38' + d.slice(0, 10);
  };
  const handleNewPhoneChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, newPhone: formatPhone(e.target.value) }));

  const formatDateDMY = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  };

  // создание сеанса
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    // базовая валидация
    if (!form.date || !form.time || !form.duration || !form.price) {
      setError('Заповніть всі обовʼязкові поля');
      return;
    }
    // режим existing
    if (mode === 'existing' && !form.existingClientId) {
      setError('Оберіть клієнта');
      return;
    }
    // режим new
    if (mode === 'new') {
      if (form.newPhone.length !== 13) {
        setError('Номер телефону має бути +38 і 10 цифр');
        return;
      }
      if (!form.newName.trim()) {
        setError('Введіть ім’я нового клієнта');
        return;
      }
    }
    // режим free
    if (mode === 'free' && !form.freeName.trim()) {
      setError('Введіть ім’я клієнта');
      return;
    }

    setLoadingAdd(true);
    try {
      let clientId: string | undefined;
      let clientName = '';

      if (mode === 'existing') {
        clientId = form.existingClientId;
      } else if (mode === 'new') {
        const res = await fetch('/api/admin/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: form.newPhone,
            name: form.newName.trim(),
            birthDate: formatDateDMY(form.newBirthDate),
            notes: form.newNotes.trim() || null,
          }),
        });
        if (!res.ok) throw new Error('Не вдалося створити клієнта');
        const created = await res.json();
        clientId = created.id;
      } else {
        clientName = form.freeName.trim();
      }

      const startTime = new Date(`${form.date}T${form.time}`).toISOString();
      const payload: any = {
        startTime,
        duration: Number(form.duration),
        notes: form.notes.trim() || null,
        price: Number(form.price),
      };
      if (mode === 'free') {
        payload.client = clientName;
      } else {
        payload.client = '';
        payload.clientId = clientId;
      }

      const r2 = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r2.ok) {
        const j = await r2.json();
        throw new Error(j.error || 'Не вдалося створити сеанс');
      }

      // сброс и закрыть форму
      setForm({
        existingClientId: '',
        freeName: '',
        newPhone: '+38',
        newName: '',
        newBirthDate: '',
        newNotes: '',
        date: '',
        time: '',
        duration: '',
        notes: '',
        price: '',
      });
      setClientQuery('');
      setMode('existing');
      setOpen(false);
      onCreated?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <>
      {!open && (
        <button className={styles.addButton} onClick={() => setOpen(true)}>
          Додати
        </button>
      )}

      {open && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Скасувати */}
            <div className={styles.modeButtonsRow}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setOpen(false)}
                disabled={loadingAdd}
              >
                Скасувати
              </button>
            </div>

            {/* переключатель режимов */}
            <div className={styles.modeButtonsRow}>
              <button
                type="button"
                className={`${styles.modeButton} ${mode === 'existing' ? styles.activeMode : ''}`}
                onClick={() => setMode('existing')}
                disabled={loadingAdd}
              >
                Існуючий
              </button>
              <button
                type="button"
                className={`${styles.modeButton} ${mode === 'new' ? styles.activeMode : ''}`}
                onClick={() => setMode('new')}
                disabled={!!form.existingClientId || loadingAdd}
              >
                Створити нового
              </button>
              <button
                type="button"
                className={`${styles.modeButton} ${mode === 'free' ? styles.activeMode : ''}`}
                onClick={() => setMode('free')}
                disabled={loadingAdd}
              >
                Без збереження
              </button>
            </div>

            {/* EXISTING */}
            {mode === 'existing' && (
              <div className={styles.field} style={{ position: 'relative' }}>
                <label>Клієнт</label>

                {form.existingClientId ? (
                  <div className={styles.staticField}>{clientQuery || 'Клієнт з бази'}</div>
                ) : (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      className={styles.input}
                      placeholder="Введіть мін. 3 символи"
                      value={clientQuery}
                      onChange={e => {
                        const value = e.target.value;
                        setClientQuery(value);
                        if (!form.existingClientId) {
                          setForm(f => ({ ...f, existingClientId: '' }));
                        }
                        setShowSuggestions(value.length >= 3);
                      }}
                      disabled={loadingClients || loadingAdd}
                    />
                    {showSuggestions && filteredClients.length > 0 && (
                      <div ref={suggestionsRef} className={styles.suggestions}>
                        {filteredClients.map(c => (
                          <div
                            key={c.id}
                            className={styles.suggestionItem}
                            onClick={() => handleClientSelect(c)}
                          >
                            {c.name} – {c.phone}
                          </div>
                        ))}
                      </div>
                    )}
                    <input type="hidden" readOnly value={form.existingClientId} />
                  </>
                )}
              </div>
            )}

            {/* NEW */}
            {mode === 'new' && (
              <div className={styles.newClientSection}>
                {/* телефон, имя, дата нар., заметки */}
                <div className={styles.field}>
                  <label>Телефон</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={form.newPhone}
                    onChange={handleNewPhoneChange}
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
                    onChange={e => setForm(f => ({ ...f, newName: e.target.value }))}
                    maxLength={50}
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
                    onChange={e => setForm(f => ({ ...f, newBirthDate: e.target.value }))}
                    required
                    disabled={loadingAdd}
                  />
                </div>
                <div className={styles.field}>
                  <label>Нотатки</label>
                  <textarea
                    className={styles.input}
                    value={form.newNotes}
                    onChange={e => setForm(f => ({ ...f, newNotes: e.target.value }))}
                    maxLength={200}
                    disabled={loadingAdd}
                  />
                </div>
              </div>
            )}

            {/* FREE */}
            {mode === 'free' && (
              <div className={styles.field}>
                <label>Ім’я клієнта</label>
                <input
                  type="text"
                  className={styles.input}
                  value={form.freeName}
                  onChange={e => setForm(f => ({ ...f, freeName: e.target.value }))}
                  required
                  disabled={loadingAdd}
                />
              </div>
            )}

            {/* Дата + Час (1 ряд) */}
            <div className={styles.dateTimeRow}>
              <div className={styles.field}>
                <label>Дата сеансу</label>
                <input
                  type="date"
                  className={styles.input}
                  min={todayStr}
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                  disabled={loadingAdd}
                />
              </div>
              <div className={styles.field}>
                <label>Час сеансу</label>
                <input
                  type="time"
                  className={styles.input}
                  value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  required
                  disabled={loadingAdd}
                />
              </div>
            </div>

            {/* Тривалість + Ціна (2 ряд) */}
            <div className={styles.twoColumnsRow}>
              <div className={styles.field}>
                <label>Тривалість (хв)</label>
                <input
                  type="number"
                  className={`${styles.input} ${styles.shortInput}`}
                  min={1}
                  value={form.duration}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      duration: e.target.value.replace(/\D/g, '').slice(0, 3),
                    }))
                  }
                  required
                  disabled={loadingAdd}
                />
              </div>
              <div className={styles.field}>
                <label>Ціна</label>
                <input
                  type="number"
                  className={`${styles.input} ${styles.shortInputPrice}`}
                  min={0}
                  value={form.price}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      price: e.target.value.replace(/\D/g, '').slice(0, 7),
                    }))
                  }
                  required
                  disabled={loadingAdd}
                />
              </div>
            </div>

            {/* Нотатки */}
            <div className={styles.field}>
              <label>Нотатки</label>
              <input
                type="text"
                className={styles.input}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                disabled={loadingAdd}
              />
            </div>

            {error && <div className={`${styles.errorField} ${styles.fullWidth}`}>{error}</div>}

            <div className={styles.fullWidth} style={{ textAlign: 'right' }}>
              <button type="submit" disabled={loadingAdd} className={styles.submitButton}>
                {loadingAdd ? <FaSpinner className={styles.spin} /> : 'Додати запис'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
