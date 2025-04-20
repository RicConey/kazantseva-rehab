'use client';

import React from 'react';
import styles from '../AdminAppointments.module.css';

interface Props {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
}

export default function DateFilter({ date, setDate, disabled }: Props) {
  return (
      <div className={styles.controls}>
        <label>
          Показати дату:
          <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled={disabled}
          />
        </label>
      </div>
  );
}
