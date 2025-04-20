// File: /components/AdminAppointments/AppointmentTable.tsx
'use client';

import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import styles from '../AdminAppointments.module.css';

interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  notes?: string | null;
}

interface Props {
  list: Appointment[];
  todayStr: string;
  editingId: number | null;
  editForm: any;
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
  loadingSaveId: number | null;
  loadingDeleteId: number | null;
  startEdit: (a: Appointment) => void;
  cancelEdit: () => void;
  saveEdit: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  kyivFormatter: Intl.DateTimeFormat;
}

export default function AppointmentTable({
  list,
  todayStr,
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
  kyivFormatter,
}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Час</th>
            <th>Хв</th>
            <th>ФІО</th>
            <th>Заметки</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {list.map(a => {
            const dt = new Date(a.startTime);
            const isSaving = loadingSaveId === a.id;
            const isDeleting = loadingDeleteId === a.id;
            if (editingId === a.id) {
              return (
                <tr key={a.id}>
                  <td data-label="Дата / Час">
                    <input
                      type="date"
                      min={todayStr}
                      value={editForm.date}
                      onChange={e => setEditForm((f: any) => ({ ...f, date: e.target.value }))}
                      disabled={isSaving}
                    />
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={e => setEditForm((f: any) => ({ ...f, time: e.target.value }))}
                      disabled={isSaving}
                    />
                  </td>
                  <td data-label="Хв">
                    <input
                      type="text"
                      className={styles.durationInput}
                      value={editForm.duration}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setEditForm((f: any) => ({ ...f, duration: v }));
                      }}
                      disabled={isSaving}
                    />
                  </td>
                  <td data-label="ФІО">
                    <input
                      type="text"
                      value={editForm.client}
                      onChange={e => setEditForm((f: any) => ({ ...f, client: e.target.value }))}
                      disabled={isSaving}
                    />
                  </td>
                  <td data-label="Заметки">
                    <input
                      type="text"
                      value={editForm.notes}
                      onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
                      disabled={isSaving}
                    />
                  </td>
                  <td data-label="Дії" className={styles.actions}>
                    <button onClick={() => saveEdit(a.id)} disabled={isSaving}>
                      {isSaving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                    </button>
                    <button onClick={cancelEdit} disabled={isSaving}>
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              );
            }
            const displayTime = kyivFormatter.format(dt);
            return (
              <tr key={a.id}>
                <td data-label="Час">{displayTime}</td>
                <td data-label="Хв">{a.duration}</td>
                <td data-label="ФІО">{a.client}</td>
                <td data-label="Заметки">{a.notes || '-'}</td>
                <td data-label="Дії" className={styles.actions}>
                  <button
                    title="Редагувати"
                    onClick={() => startEdit(a)}
                    disabled={loadingAdd || loadingSaveId !== null}
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(a.id)} disabled={isDeleting}>
                    {isDeleting ? <FaSpinner className={styles.spin} /> : <FaTrash />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
