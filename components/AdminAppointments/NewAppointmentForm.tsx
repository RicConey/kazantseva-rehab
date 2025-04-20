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
    // ← вот это поле добавили:
    errorFields: Record<string, boolean>;
}

export default function NewAppointmentForm({
                                               todayStr,
                                               newForm,
                                               setNewForm,
                                               loadingAdd,
                                               handleAdd,
                                               errorFields,
                                           }: Props) {
    const cls = (f: string) => (errorFields[f] ? styles.inputError : '');

    return (
        <form className={styles.form} onSubmit={handleAdd}>
            <input
                type="date"
                min={todayStr}
                value={newForm.date}
                onChange={e => setNewForm(f => ({ ...f, date: e.target.value }))}
                disabled={loadingAdd}
                className={cls('date')}
                required
            />
            <input
                type="time"
                value={newForm.time}
                onChange={e => setNewForm(f => ({ ...f, time: e.target.value }))}
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
                    setNewForm(f => ({
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
                onChange={e => setNewForm(f => ({ ...f, client: e.target.value }))}
                disabled={loadingAdd}
                className={cls('client')}
                required
            />
            <input
                type="text"
                placeholder="Заметки"
                value={newForm.notes}
                onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
                disabled={loadingAdd}
            />
            <button type="submit" disabled={loadingAdd}>
                {loadingAdd ? <><FaSpinner className={styles.spin} /> Додаємо...</> : 'Додати запис'}
            </button>
        </form>
    );
}
