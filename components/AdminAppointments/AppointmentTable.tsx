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
  editingId: number;
  editForm: {
    date: string;
    time: string;
    duration: string;
    client: string;
    notes: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
  loadingSaveId: number | null;
  loadingDeleteId: number | null;
  startEdit: (a: Appointment) => void;
  cancelEdit: () => void;
  saveEdit: (id: number) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  kyivFormatter: Intl.DateTimeFormat;
  errorFields: Record<string, boolean>;
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
  errorFields,
}: Props) {
  const cls = (f: string) => (errorFields[f] ? styles.inputError : '');

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Час</th>
            <th>Хв</th>
            <th>ФІО</th>
            <th>Заметки</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => {
            const isSaving = loadingSaveId === a.id;
            const isDeleting = loadingDeleteId === a.id;
            const displayTime = kyivFormatter.format(new Date(a.startTime));

            if (editingId === a.id) {
              return (
                <React.Fragment key={a.id}>
                  {/* Desktop inline-edit row */}
                  <tr className={styles.editingRow}>
                    <td data-label="Дата / Час">
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
                    </td>
                    <td data-label="Хв">
                      <input
                        type="text"
                        className={`${styles.durationInput} ${cls('duration')}`}
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
                        className={cls('client')}
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
                    <td className={styles.actions}>
                      <button onClick={() => saveEdit(a.id)} disabled={isSaving}>
                        {isSaving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                      </button>
                      <button onClick={cancelEdit} disabled={isSaving}>
                        <FaTimes />
                      </button>
                    </td>
                  </tr>

                  {/* Mobile inline-edit row */}
                  <tr className={styles.mobileEditingRow}>
                    <td colSpan={5}>
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
                          className={`${styles.durationInput} ${cls('duration')}`}
                          value={editForm.duration}
                          onChange={e => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                            setEditForm((f: any) => ({ ...f, duration: v }));
                          }}
                          disabled={isSaving}
                        />
                      </div>
                      <div className={styles.field}>
                        <label>ФІО</label>
                        <input
                          type="text"
                          value={editForm.client}
                          onChange={e =>
                            setEditForm((f: any) => ({ ...f, client: e.target.value }))
                          }
                          disabled={isSaving}
                          className={cls('client')}
                        />
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
                      <div className={styles.actionsMobile}>
                        <button onClick={() => saveEdit(a.id)} disabled={isSaving}>
                          {isSaving ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                        </button>
                        <button onClick={cancelEdit} disabled={isSaving}>
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            }

            return (
              <tr key={a.id}>
                <td data-label="Час">{displayTime}</td>
                <td data-label="Хв">{a.duration}</td>
                <td data-label="ФІО">{a.client}</td>
                <td data-label="Заметки">{a.notes || '-'}</td>
                <td className={styles.actions}>
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
