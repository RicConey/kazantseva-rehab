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
    price: string; // ← добавлено поле price
  };
  setNewForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  errorFields: Record<string, boolean>;
  errorMessage?: string;
}

export default function NewAppointmentForm({
  todayStr,
  newForm,
  setNewForm,
  loadingAdd,
  handleAdd,
  errorFields,
  errorMessage,
}: Props) {
  const cls = (f: string) => (errorFields[f] ? styles.inputError : '');

  return (
    <form className={styles.form} onSubmit={handleAdd}>
      <input
        type="date"
        min={todayStr}
        value={newForm.date}
        onChange={e => setNewForm((f: any) => ({ ...f, date: e.target.value }))}
        disabled={loadingAdd}
        className={cls('date')}
        required
      />
      <input
        type="time"
        value={newForm.time}
        onChange={e => setNewForm((f: any) => ({ ...f, time: e.target.value }))}
        disabled={loadingAdd}
        className={cls('time')}
        required
      />
      <input
        type="text"
        placeholder="хв"
        inputMode="numeric"
        pattern="\d*"
        maxLength={3}
        value={newForm.duration}
        onChange={e =>
          setNewForm((f: any) => ({
            ...f,
            duration: e.target.value.replace(/\D/g, '').slice(0, 3),
          }))
        }
        disabled={loadingAdd}
        className={`${styles.durationInput} ${cls('duration')}`}
        required
      />
      <input
        type="text"
        placeholder="ФІО"
        value={newForm.client}
        onChange={e => setNewForm((f: any) => ({ ...f, client: e.target.value }))}
        disabled={loadingAdd}
        className={cls('client')}
        required
      />
      <input
        type="text"
        placeholder="Заметки"
        value={newForm.notes}
        onChange={e => setNewForm((f: any) => ({ ...f, notes: e.target.value }))}
        disabled={loadingAdd}
      />
      <input
        type="text"
        placeholder="Сума"
        inputMode="numeric"
        pattern="\d*"
        maxLength={5}
        value={newForm.price}
        onChange={e =>
          setNewForm((f: any) => ({
            ...f,
            price: e.target.value.replace(/\D/g, '').slice(0, 7),
          }))
        }
        disabled={loadingAdd}
        className={`${styles.priceInput} {cls('price')}`}
        required
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

      {errorMessage && <div className={styles.errorField}>{errorMessage}</div>}
    </form>
  );
}
