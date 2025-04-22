// components/AdminAppointments.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './AdminAppointments.module.css';
import { parseISO, format } from 'date-fns';
import { toast } from 'react-toastify';
import NewAppointmentForm from './AdminAppointments/NewAppointmentForm';
import DateFilter from './AdminAppointments/DateFilter';
import AppointmentTimeline from './AdminAppointments/AppointmentTimeline';
import AppointmentTable from './AdminAppointments/AppointmentTable';
import SkeletonTable from './AdminAppointments/SkeletonTable';
import BackButton from '@components/BackButton';

interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  notes?: string | null;
  price: number;
}

export default function AdminAppointments() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const todayStr = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(dateParam ?? todayStr);

  const timelineRef = useRef<HTMLDivElement>(null);
  const kyivFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Kyiv',
      }),
    []
  );

  // ——— Общее состояние ———
  const [list, setList] = useState<Appointment[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSaveId, setLoadingSaveId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  // ——— Новая форма ———
  const [newForm, setNewForm] = useState({
    date: todayStr,
    time: '',
    duration: '',
    client: '',
    notes: '',
    price: '', // поле для суммы
  });
  const [newFormErrors, setNewFormErrors] = useState<Record<string, boolean>>({});
  const [newFormErrorMessage, setNewFormErrorMessage] = useState<string | null>(null);

  // ——— Редактирование ———
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(newForm);
  const [editFormErrors, setEditFormErrors] = useState<Record<string, boolean>>({});
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [errorEditId, setErrorEditId] = useState<number | null>(null);

  // ——— Цвета клиентов ———
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  useEffect(() => {
    const m: Record<string, string> = {};
    list.forEach(a => {
      if (!m[a.client]) {
        let h = 0;
        for (const c of a.client) h = c.charCodeAt(0) + ((h << 5) - h);
        m[a.client] = `hsl(${Math.abs(h) % 360},80%,65%)`;
      }
    });
    setColorMap(m);
  }, [list]);

  // ——— Загрузка списка по дате ———
  useEffect(() => {
    setLoadingList(true);
    fetch(`/api/appointments?date=${encodeURIComponent(date)}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Appointment[]) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoadingList(false));

    setNewForm(f => ({ ...f, date }));
  }, [date]);

  // клик вне — закрываем тултип
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-appt-id]')) {
        setActiveTooltipId(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function isOverlap(start: Date, dur: number, skipId?: number) {
    const end = new Date(start.getTime() + dur * 60000);
    return list.some(appt => {
      if (appt.id === skipId) return false;
      const s = new Date(appt.startTime);
      const e = new Date(s.getTime() + appt.duration * 60000);
      return start < e && s < end;
    });
  }

  // ——— Добавление ———
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewFormErrors({});
    setNewFormErrorMessage(null);

    const errs: Record<string, boolean> = {};
    const { date: d, time, duration, client, notes, price } = newForm;
    const durNum = parseInt(duration, 10);
    const priceNum = parseInt(price, 10);

    if (!d) errs.date = true;
    if (!time) errs.time = true;
    if (isNaN(durNum)) errs.duration = true;
    if (!client.trim()) errs.client = true;
    if (isNaN(priceNum)) errs.price = true; // проверка суммы
    if (Object.keys(errs).length) {
      setNewFormErrors(errs);
      setNewFormErrorMessage('Поля заповнені некоректно');
      return;
    }

    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);

    if (isOverlap(ld, durNum)) {
      setNewFormErrorMessage('Час перекривається з іншими сеансами');
      return;
    }

    setLoadingAdd(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: ld.toISOString(),
          duration: durNum,
          client: client.trim(),
          notes: notes.trim() || null,
          price: priceNum, // передаём сумму
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setNewFormErrorMessage(json.error || 'Не вдалося додати запис');
      } else {
        setList(prev =>
          [...prev, json]
            .filter(a => parseISO(a.startTime).toISOString().slice(0, 10) === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
        setNewForm({ date: todayStr, time: '', duration: '', client: '', notes: '', price: '' });
      }
    } catch {
      setNewFormErrorMessage('Не вдалося додати запис');
    } finally {
      setLoadingAdd(false);
    }
  }

  // ——— Редактирование ———
  function startEdit(a: Appointment) {
    const dt = parseISO(a.startTime);
    setEditingId(a.id);
    setEditForm({
      date: format(dt, 'yyyy-MM-dd'),
      time: format(dt, 'HH:mm'),
      duration: String(a.duration),
      client: a.client,
      notes: a.notes || '',
      price: String(a.price), // наполняем сумму
    });
    setEditFormErrors({});
    setEditErrorMessage(null);
    setErrorEditId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditFormErrors({});
    setEditErrorMessage(null);
    setErrorEditId(null);
  }

  async function saveEdit(id: number) {
    setEditFormErrors({});
    setEditErrorMessage(null);
    setErrorEditId(null);

    const errs: Record<string, boolean> = {};
    const { date: d, time, duration, client, notes, price } = editForm;
    const durNum = parseInt(duration, 10);
    const priceNum = parseInt(price, 10);

    if (!d) errs.date = true;
    if (!time) errs.time = true;
    if (isNaN(durNum)) errs.duration = true;
    if (!client.trim()) errs.client = true;
    if (isNaN(priceNum)) errs.price = true; // проверка суммы
    if (Object.keys(errs).length) {
      setEditFormErrors(errs);
      setEditErrorMessage('Поля заповнені некоректно');
      setErrorEditId(id);
      return;
    }

    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);

    if (isOverlap(ld, durNum, id)) {
      setEditErrorMessage('Час перекривається з іншими сеансами');
      setErrorEditId(id);
      return;
    }

    setLoadingSaveId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: ld.toISOString(),
          duration: durNum,
          client: client.trim(),
          notes: notes.trim() || null,
          price: priceNum, // передаём сумму
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditErrorMessage(json.error || 'Не вдалося зберегти');
        setErrorEditId(id);
      } else {
        setList(prev =>
          prev
            .map(x => (x.id === id ? json : x))
            .filter(a => parseISO(a.startTime).toISOString().slice(0, 10) === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
        cancelEdit();
      }
    } catch {
      setEditErrorMessage('Не вдалося зберегти');
      setErrorEditId(id);
    } finally {
      setLoadingSaveId(null);
    }
  }

  // ——— Удаление ———
  async function deleteItem(id: number) {
    setLoadingDeleteId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (!res.ok) toast.error('Не вдалося видалити');
      else setList(prev => prev.filter(x => x.id !== id));
    } catch {
      toast.error('Не вдалося видалити');
    } finally {
      setLoadingDeleteId(null);
    }
  }

  return (
    <div className={styles.container}>
      <BackButton />

      <h1 className={styles.title}>Запис клієнтів</h1>

      <NewAppointmentForm
        todayStr={todayStr}
        newForm={newForm}
        setNewForm={setNewForm}
        loadingAdd={loadingAdd}
        handleAdd={handleAdd}
        errorFields={newFormErrors}
        errorMessage={newFormErrorMessage}
      />

      <DateFilter date={date} setDate={setDate} disabled={loadingAdd} />

      <AppointmentTimeline
        list={list}
        scaleStart={8}
        scaleDuration={13.5}
        colorMap={colorMap}
        timelineRef={timelineRef}
        activeTooltipId={activeTooltipId}
        toggleTooltip={id => setActiveTooltipId(prev => (prev === id ? null : id))}
        kyivFormatter={kyivFormatter}
      />

      {loadingList ? (
        <SkeletonTable />
      ) : (
        <AppointmentTable
          list={list}
          todayStr={todayStr}
          editingId={editingId!}
          editForm={editForm}
          setEditForm={setEditForm}
          loadingAdd={loadingAdd}
          loadingSaveId={loadingSaveId}
          loadingDeleteId={loadingDeleteId}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          deleteItem={deleteItem}
          kyivFormatter={kyivFormatter}
          errorFields={editFormErrors}
          errorMessage={errorEditId === editingId ? editErrorMessage : undefined}
        />
      )}

      <BackButton />
    </div>
  );
}
