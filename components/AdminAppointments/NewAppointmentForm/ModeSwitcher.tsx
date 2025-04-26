// components/appointments/ModeSwitcher.tsx
'use client';

import React from 'react';
import styles from '../../AdminAppointments.module.css';

type Mode = 'existing' | 'new' | 'free';

interface Props {
  mode: Mode;
  setMode: (m: Mode) => void;
  disabled: boolean;
}

export default function ModeSwitcher({ mode, setMode, disabled }: Props) {
  return (
    <div className={styles.modeButtonsRow}>
      <button
        type="button"
        className={`${styles.modeButton} ${mode === 'existing' ? styles.activeMode : ''}`}
        onClick={() => setMode('existing')}
        disabled={disabled}
      >
        Існуючий
      </button>
      <button
        type="button"
        className={`${styles.modeButton} ${mode === 'new' ? styles.activeMode : ''}`}
        onClick={() => setMode('new')}
        disabled={disabled}
      >
        Створити нового
      </button>
      <button
        type="button"
        className={`${styles.modeButton} ${mode === 'free' ? styles.activeMode : ''}`}
        onClick={() => setMode('free')}
        disabled={disabled}
      >
        Без збереження
      </button>
    </div>
  );
}
