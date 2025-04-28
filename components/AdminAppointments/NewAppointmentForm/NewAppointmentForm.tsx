// components/AdminAppointments/NewAppointmentForm/NewAppointmentForm.tsx

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Plus, Check, X } from 'lucide-react';
import styles from '../../AdminAppointments.module.css';
import ModeSwitcher from './ModeSwitcher';
import ClientSection from './ClientSection';
import SessionDetails from './SessionDetails';
import { validateSessionTime } from '../../../utils/appointmentValidation';

interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

interface LocationOption {
  id: number;
  name: string;
}

interface Props {
  todayStr: string;
  onCreated?: () => void;
}

type Mode = 'existing' | 'new' | 'free';

export default function NewAppointmentForm({ todayStr, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [mode, setMode] = useState<Mode>('existing');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState<string>();

  // Форма
  const [form, setForm] = useState({
    existingClientId: '',
    freeName: '',
    newPhone: '+38',
    newName: '',
    newBirthDate: '',
    newNotes: '',
    messengerTypes: [] as Array<'telegram' | 'whatsapp' | 'viber'>,
    date: '',
    time: '',
    duration: '',
    notes: '',
    price: '',
    locationId: '' as number | '', // обязательный кабинет
  });

  // Загрузка клиентов
  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then((data: any[]) =>
        setClients(
          data.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
          }))
        )
      )
      .catch(() => setClients([]))
      .finally(() => setLoadingClients(false));
  }, []);

  // Загрузка кабинетов и установка значения по-умолчанию
  useEffect(() => {
    fetch('/api/admin/locations')
      .then(r => r.json())
      .then((data: LocationOption[]) => {
        setLocations(data);
        if (data.length > 0) {
          // По умолчанию выбираем первый кабинет
          setForm(f => ({ ...f, locationId: data[0].id }));
        }
      })
      .catch(() => setLocations([]))
      .finally(() => setLoadingLocations(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    // Проверки обязательных полей
    if (!form.date || !form.time || !form.duration || !form.price) {
      setError('Заповніть всі обовʼязкові поля');
      return;
    }
    if (!form.locationId) {
      setError('Оберіть кабінет');
      return;
    }
    if (mode === 'existing' && !form.existingClientId) {
      setError('Оберіть клієнта');
      return;
    }
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
    if (mode === 'free' && !form.freeName.trim()) {
      setError('Введіть ім’я клієнта');
      return;
    }

    // Валидация времени
    const start = new Date(`${form.date}T${form.time}`);
    const dur = Number(form.duration);
    const timeError = validateSessionTime(start, dur);
    if (timeError) {
      setError(timeError);
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
            birthDate: form.newBirthDate.split('-').reverse().join('.'),
            notes: form.newNotes.trim() || null,
            messengerTypes: form.messengerTypes,
          }),
        });
        if (!res.ok) throw new Error('Не вдалося створити клієнта');
        const created = await res.json();
        clientId = created.id;
      } else {
        clientName = form.freeName.trim();
      }

      const payload: any = {
        startTime: new Date(`${form.date}T${form.time}`).toISOString(),
        duration: dur,
        notes: form.notes.trim() || null,
        price: Number(form.price),
        locationId: Number(form.locationId),
      };
      if (mode === 'free') {
        payload.client = clientName;
      } else {
        payload.client = '';
        payload.clientId = clientId;
      }

      const r2 = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r2.ok) {
        const j = await r2.json();
        throw new Error(j.error || 'Не вдалося створити сеанс');
      }

      // Сброс формы, включая кабинет в дефолт
      setForm({
        existingClientId: '',
        freeName: '',
        newPhone: '+38',
        newName: '',
        newBirthDate: '',
        newNotes: '',
        messengerTypes: [],
        date: '',
        time: '',
        duration: '',
        notes: '',
        price: '',
        locationId: locations[0]?.id ?? '',
      });
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
        <button className={styles.addButton} onClick={() => setOpen(true)} aria-label="Додати">
          <Plus size={10} />
        </button>
      )}
      {open && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <ModeSwitcher mode={mode} setMode={setMode} disabled={loadingAdd} />

            <ClientSection
              mode={mode}
              clients={clients}
              locations={locations}
              loadingClients={loadingClients}
              loadingAdd={loadingAdd}
              form={form}
              setForm={setForm}
            />

            <SessionDetails form={form} setForm={setForm} loadingAdd={loadingAdd} />

            {error && <div className={`${styles.errorField} ${styles.fullWidth}`}>{error}</div>}

            <div
              className={styles.fullWidth}
              style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}
            >
              <button
                type="submit"
                disabled={loadingAdd}
                className={styles.submitButton}
                aria-label="Додати запис"
              >
                {loadingAdd ? <FaSpinner className={styles.spin} /> : <Check size={10} />}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setOpen(false)}
                disabled={loadingAdd}
                aria-label="Скасувати"
              >
                <X size={10} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
