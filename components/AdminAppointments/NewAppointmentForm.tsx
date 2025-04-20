// File: /components/AdminAppointments/NewAppointmentForm.tsx
'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from '../AdminAppointments.module.css';

interface Props {
  todayStr: string;
  newForm: {
    date: string;
    time: string;
    duration: string;
    client: string;
    notes: string;
  };
  setNewForm: React.Dispatch<
    React.SetStateAction<{
      date: string;
      time: string;
      duration: string;
      client: string;
      notes: string;
    }>
  >;
  loadingAdd: boolean;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function NewAppointmentForm({
  todayStr,
  newForm,
  setNewForm,
  loadingAdd,
  handleAdd,
}: Props) {
  return (
    <form className={styles.form} onSubmit={handleAdd}>
      <input
        type="date"
        min={todayStr}
        value={newForm.date}
        onChange={e => setNewForm(f => ({ ...f, date: e.target.value }))}
        required
        disabled={loadingAdd}
      />
      <input
        type="time"
        value={newForm.time}
        onChange={e => setNewForm(f => ({ ...f, time: e.target.value }))}
        required
        disabled={loadingAdd}
      />
      <input
        type="text"
        className={styles.durationInput}
        placeholder="хв"
        inputMode="numeric"
        pattern="\d*"
        maxLength={3}
        value={newForm.duration}
        onChange={e =>
          setNewForm(f => ({
            ...f,
            duration: e.target.value.replace(/\D/g, '').slice(0, 3),
          }))
        }
        required
        disabled={loadingAdd}
      />
      <input
        type="text"
        placeholder="ФІО"
        value={newForm.client}
        onChange={e => setNewForm(f => ({ ...f, client: e.target.value }))}
        required
        disabled={loadingAdd}
      />
      <input
        type="text"
        placeholder="Заметки"
        value={newForm.notes}
        onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
        disabled={loadingAdd}
      />
      <button type="submit" disabled={loadingAdd}>
        {loadingAdd ? (
          <>
            <FaSpinner className={styles.spin} /> Додаємо...
          </>
        ) : (
          'Додати запис'
        )}
      </button>
    </form>
  );
}
