// components/AdminAppointments/AppointmentTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import styles from '../AdminAppointments.module.css';

interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  clientId?: string | null;
  clientRel?: { id: string; name: string } | null;
  notes?: string | null;
  price: number;
}

interface Props {
  list?: Appointment[];
  isLoading: boolean;
  todayStr: string;
  kyivFormatter: Intl.DateTimeFormat;
  editingId: number | null;
  editForm: {
    date: string;
    time: string;
    duration: string;
    client: string;
    notes: string;
    price: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
  loadingSaveId: number | null;
  loadingDeleteId: number | null;
  startEdit: (a: Appointment) => void;
  cancelEdit: () => void;
  saveEdit: (id: number, payload: any) => void;
  deleteItem: (id: number) => void;
  errorFields: Record<string, boolean>;
  errorMessage?: string;
}

export default function AppointmentTable({
  list,
  isLoading,
  todayStr,
  kyivFormatter,
  editingId,
  editForm,
  setEditForm,
  loadingAdd,
  loadingSaveId,
  loadingDeleteId,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteItem,
  errorFields,
  errorMessage,
}: Props) {
  const cls = (f: string) => (errorFields[f] ? styles.inputError : '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 1) Показ спиннера під час завантаження
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <FaSpinner className={styles.spin} />
        <span className={styles.loadingText}>Завантаження сеансів…</span>
      </div>
    );
  }

  // 2) Повідомлення, якщо сеансів немає
  if (!list || list.length === 0) {
    return (
      <div className={styles.loadingWrapper}>
        <span>Немає сеансів на {todayStr}</span>
      </div>
    );
  }

  // 3) Обчислення суми та рендер таблиці
  const totalForDay = list.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Час</th>
            <th>Хв</th>
            <th>ФІО</th>
            <th>Заметки / Сума</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => {
            const isSaving = loadingSaveId === a.id;
            const isDeleting = loadingDeleteId === a.id;
            const startDt = new Date(a.startTime);
            const endDt = new Date(startDt.getTime() + a.duration * 60000);
            const displayTime = `${kyivFormatter.format(startDt)}–${kyivFormatter.format(endDt)}`;

            // Режим редагування
            if (editingId === a.id) {
              const clientField =
                a.clientId && a.clientRel ? (
                  <div className={styles.staticField}>{a.clientRel.name}</div>
                ) : (
                  <input
                    type="text"
                    value={editForm.client}
                    onChange={e => setEditForm((f: any) => ({ ...f, client: e.target.value }))}
                    disabled={isSaving}
                    className={cls('client')}
                  />
                );

              const fields = (
                <>
                  <div className={styles.field}>
                    <label>Дата / Час</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={editForm.date}
                      onChange={e => setEditForm((f: any) => ({ ...f, date: e.target.value }))}
                      disabled={isSaving}
                      className={cls('date')}
                    />
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={e => setEditForm((f: any) => ({ ...f, time: e.target.value }))}
                      disabled={isSaving}
                      className={cls('time')}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Хв</label>
                    <input
                      type="text"
                      value={editForm.duration}
                      onChange={e =>
                        setEditForm((f: any) => ({
                          ...f,
                          duration: e.target.value.replace(/\D/g, '').slice(0, 3),
                        }))
                      }
                      disabled={isSaving}
                      className={`${styles.durationInput} ${cls('duration')}`}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>ФІО</label>
                    {clientField}
                  </div>
                  <div className={styles.field}>
                    <label>Заметки</label>
                    <input
                      type="text"
                      value={editForm.notes}
                      onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                      disabled={isSaving}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Сума</label>
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={e =>
                        setEditForm((f: any) => ({
                          ...f,
                          price: e.target.value.replace(/\D/g, '').slice(0, 7),
                        }))
                      }
                      disabled={isSaving}
                      className={cls('price')}
                    />
                  </div>
                </>
              );

              // Мобільна версія редактора
              if (isMobile) {
                return (
                  <tr key={a.id} className={styles.mobileEditingRow}>
                    <td colSpan={5}>
                      {fields}
                      <div className={styles.actionsMobile}>
                        <button onClick={() => saveEdit(a.id, editForm)} disabled={isSaving}>
                          {isSaving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                        </button>
                        <button onClick={cancelEdit} disabled={isSaving}>
                          <FaTimes />
                        </button>
                      </div>
                      {errorMessage && <div className={styles.errorField}>{errorMessage}</div>}
                    </td>
                  </tr>
                );
              }

              // Десктоп-версія редактора
              return (
                <tr key={a.id} className={styles.editingRow}>
                  <td data-label="Час">{displayTime}</td>
                  <td data-label="Хв">{a.duration}</td>
                  <td data-label="ФІО">{clientField}</td>
                  <td data-label="Заметки / Сума">
                    {a.notes || '-'}
                    <br />
                    <strong>{a.price} ₴</strong>
                  </td>
                  <td className={styles.actions}>
                    <button onClick={() => saveEdit(a.id, editForm)} disabled={isSaving}>
                      {isSaving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                    </button>
                    <button onClick={cancelEdit} disabled={isSaving}>
                      <FaTimes />
                    </button>
                    {errorMessage && <div className={styles.errorField}>{errorMessage}</div>}
                  </td>
                </tr>
              );
            }

            // Обычная строка таблицы
            return (
              <tr key={a.id}>
                <td data-label="Час">{displayTime}</td>
                <td data-label="Хв">{a.duration}</td>
                <td data-label="ФІО">
                  {a.clientId && a.clientRel ? (
                    <Link href={`/admin/clients/${a.clientRel.id}`}>{a.clientRel.name}</Link>
                  ) : (
                    a.client
                  )}
                </td>
                <td data-label="Заметки / Сума">
                  {a.notes || '-'}
                  <br />
                  <strong>{a.price} ₴</strong>
                </td>
                <td className={styles.actions}>
                  <button
                    title="Редагувати"
                    onClick={() => startEdit(a)}
                    disabled={loadingAdd || loadingSaveId != null}
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(a.id)} disabled={loadingDeleteId === a.id}>
                    {loadingDeleteId === a.id ? <FaSpinner className={styles.spin} /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.totalForDay}>
        <strong>Сума за сьогодні: {totalForDay} ₴</strong>
      </div>
    </div>
  );
}
