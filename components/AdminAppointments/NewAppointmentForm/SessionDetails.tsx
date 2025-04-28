// components/appointments/SessionDetails.tsx
'use client';

import React, { ChangeEvent } from 'react';
import styles from '../../AdminAppointments.module.css';

interface Props {
  form: {
    date: string;
    time: string;
    duration: string;
    price: string;
    notes: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
}

export default function SessionDetails({ form, setForm, loadingAdd }: Props) {
  return (
    <>
      <div className={styles.dateTimeRow}>
        <div className={styles.field}>
          <label>Дата сеансу</label>
          <input
            type="date"
            className={styles.input}
            value={form.date}
            onChange={e => setForm((f: any) => ({ ...f, date: e.target.value }))}
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
            onChange={e => setForm((f: any) => ({ ...f, time: e.target.value }))}
            required
            disabled={loadingAdd}
          />
        </div>
      </div>
      <div className={styles.twoColumnsRow}>
        <div className={styles.field}>
          <label>Тривалість (хв)</label>
          <input
            type="number"
            className={`${styles.input} ${styles.shortInput}`}
            min={1}
            value={form.duration}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f: any) => ({
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm((f: any) => ({ ...f, price: e.target.value.replace(/\D/g, '').slice(0, 7) }))
            }
            required
            disabled={loadingAdd}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label>Нотатки</label>
        <input
          type="text"
          className={styles.input}
          value={form.notes}
          onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
          disabled={loadingAdd}
        />
      </div>
    </>
  );
}
