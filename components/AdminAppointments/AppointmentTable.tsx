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
  location: { id: number; name: string };
}

interface LocationOption {
  id: number;
  name: string;
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
    locationId: number;
  };
  setEditForm: React.Dispatch<React.SetStateAction<any>>;
  loadingAdd: boolean;
  loadingSaveId: number | null;
  loadingDeleteId: number | null;
  startEdit: (a: Appointment) => void;
  cancelEdit: () => void;
  saveEdit: (id: number, form: any) => void;
  deleteItem: (id: number) => void;
  errorFields: Record<string, boolean>;
  errorMessage?: string;
  locations: LocationOption[];
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
  locations,
}: Props) {
  // Помечает поле с ошибкой
  const cls = (f: string) => (errorFields[f] ? styles.inputError : '');

  // Определяем мобильный режим
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Спиннер при загрузке
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <FaSpinner className={styles.spin} />
        <span className={styles.loadingText}>Завантаження сеансів…</span>
      </div>
    );
  }

  // Пустой список
  if (!list || list.length === 0) {
    return (
      <div className={styles.loadingWrapper}>
        <span>Немає сеансів на {todayStr}</span>
      </div>
    );
  }

  // Итоговая сумма
  const totalForDay = list.reduce((sum, a) => sum + a.price, 0);

  // Формируем строки
  const rows: React.ReactNode[] = [];
  let lastLocation: string | null = null;

  for (const a of list) {
    // Заголовок группы локации
    if (a.location.name !== lastLocation) {
      rows.push(
        <tr key={`hdr-${a.id}`}>
          <td colSpan={5} className={styles.locationHeader}>
            {a.location.name}
          </td>
        </tr>
      );
      lastLocation = a.location.name;
    }

    const isSaving = loadingSaveId === a.id;
    const startDt = new Date(a.startTime);
    const endDt = new Date(startDt.getTime() + a.duration * 60000);
    const displayTime = `${kyivFormatter.format(startDt)}–${kyivFormatter.format(endDt)}`;

    // Режим редактирования
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

      const editFields = (
        <>
          {/* Дата и время */}
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

          {/* Длительность */}
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

          {/* Клиент */}
          <div className={styles.field}>
            <label>ФІО</label>
            {clientField}
          </div>

          {/* Выбор кабинета */}
          <div className={styles.field}>
            <label>Кабінет</label>
            <select
              className={styles.input}
              value={editForm.locationId}
              onChange={e => setEditForm((f: any) => ({ ...f, locationId: +e.target.value }))}
              disabled={isSaving}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Примечания */}
          <div className={styles.field}>
            <label>Заметки</label>
            <input
              type="text"
              value={editForm.notes}
              onChange={e => setEditForm((f: any) => ({ ...f, notes: e.target.value }))}
              disabled={isSaving}
            />
          </div>

          {/* Сумма */}
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

      // Мобильная версия
      if (isMobile) {
        rows.push(
          <tr key={`edit-mobile-${a.id}`} className={styles.mobileEditingRow}>
            <td colSpan={5}>
              {editFields}
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
      } else {
        // Desktop-версия
        rows.push(
          <tr key={`edit-${a.id}`} className={styles.editingRow}>
            <td data-label="Час">{displayTime}</td>
            <td data-label="Хв">{a.duration}</td>
            <td data-label="ФІО">{clientField}</td>
            <td data-label="Кабінет">
              <select
                className={styles.input}
                value={editForm.locationId}
                onChange={e => setEditForm((f: any) => ({ ...f, locationId: +e.target.value }))}
                disabled={isSaving}
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </td>
            <td data-label="Заметки / Сума">{editFields}</td>
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
      continue;
    }

    // Обычная строка (без колонки 'Кабінет')
    rows.push(
      <tr key={a.id}>
        <td data-label="Час">{displayTime}</td>
        <td data-label="Хв">{a.duration}</td>
        <td data-label="ФІО">
          {a.clientId && a.clientRel ? (
            <Link href={`/admin/clients/${a.clientRel.id}`} legacyBehavior>
              {a.clientRel.name}
            </Link>
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
  }

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
        <tbody>{rows}</tbody>
      </table>
      <div className={styles.totalForDay}>
        <strong>Сума за сьогодні: {totalForDay} ₴</strong>
      </div>
    </div>
  );
}
