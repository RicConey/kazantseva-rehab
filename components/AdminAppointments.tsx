// File: /components/AdminAppointments.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './AdminAppointments.module.css';
import { parseISO, format } from 'date-fns';
import { toast } from 'react-toastify'; // оставляем только toast
import NewAppointmentForm from './AdminAppointments/NewAppointmentForm';
import DateFilter from './AdminAppointments/DateFilter';
import AppointmentTimeline from './AdminAppointments/AppointmentTimeline';
import AppointmentTable from './AdminAppointments/AppointmentTable';
import SkeletonTable from './AdminAppointments/SkeletonTable';

interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  notes?: string | null;
}

export default function AdminAppointments() {
  const todayStr = new Date().toISOString().slice(0, 10);
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

  function formatErrorMessage(msg: string) {
    return msg.replace(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})/g,
      iso => {
        try {
          return kyivFormatter.format(parseISO(iso));
        } catch {
          return iso;
        }
      }
    );
  }

  const [date, setDate] = useState(todayStr);
  const [list, setList] = useState<Appointment[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingSaveId, setLoadingSaveId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  const [newForm, setNewForm] = useState({
    date: todayStr,
    time: '',
    duration: '',
    client: '',
    notes: '',
  });
  const [newFormErrors, setNewFormErrors] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(newForm);
  const [editFormErrors, setEditFormErrors] = useState<Record<string, boolean>>({});

  // Загрузка списка
  useEffect(() => {
    setLoadingList(true);
    fetch(`/api/appointments?date=${date}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Appointment[]) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoadingList(false));
    setNewForm(f => ({ ...f, date }));
  }, [date]);

  // Генерация цветов
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  useEffect(() => {
    const m: Record<string, string> = {};
    list.forEach(a => {
      if (!m[a.client]) {
        let h = 0;
        for (const c of a.client) h = c.charCodeAt(0) + ((h << 5) - h);
        m[a.client] = `hsl(${Math.abs(h) % 360},70%,80%)`;
      }
    });
    setColorMap(m);
  }, [list]);

  // Закрытие тултипов вне записи
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

  // Добавление
  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewFormErrors({});
    const errs: Record<string, boolean> = {};
    const { date: d, time, duration, client, notes } = newForm;
    const durNum = parseInt(duration, 10);
    if (!d) errs.date = true;
    if (!time) errs.time = true;
    if (isNaN(durNum)) errs.duration = true;
    if (!client.trim()) errs.client = true;
    if (Object.keys(errs).length) {
      setNewFormErrors(errs);
      toast.error('Поля заповнені некоректно');
      return;
    }
    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);
    if (isOverlap(ld, durNum)) {
      toast.error('Час перекривається з іншими сеансами');
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
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(formatErrorMessage(json.error || 'Не вдалося додати запис'));
      } else {
        setList(prev =>
          [...prev, json]
            .filter(a => parseISO(a.startTime).toISOString().slice(0, 10) === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
        setNewForm({ date: todayStr, time: '', duration: '', client: '', notes: '' });
        toast.success('Запис додано');
      }
    } catch {
      toast.error('Не вдалося додати запис');
    } finally {
      setLoadingAdd(false);
    }
  }

  // Редактирование
  function startEdit(a: Appointment) {
    const dt = parseISO(a.startTime);
    setEditingId(a.id);
    setEditForm({
      date: format(dt, 'yyyy-MM-dd'),
      time: format(dt, 'HH:mm'),
      duration: String(a.duration),
      client: a.client,
      notes: a.notes || '',
    });
    setEditFormErrors({});
  }
  function cancelEdit() {
    setEditingId(null);
    setEditFormErrors({});
  }
  async function saveEdit(id: number) {
    setEditFormErrors({});
    const errs: Record<string, boolean> = {};
    const { date: d, time, duration, client, notes } = editForm;
    const durNum = parseInt(duration, 10);
    if (!d) errs.date = true;
    if (!time) errs.time = true;
    if (isNaN(durNum)) errs.duration = true;
    if (!client.trim()) errs.client = true;
    if (Object.keys(errs).length) {
      setEditFormErrors(errs);
      toast.error('Поля заповнені некоректно');
      return;
    }
    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);
    if (isOverlap(ld, durNum, id)) {
      toast.error('Час перекривається з іншими сеансами');
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
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(formatErrorMessage(json.error || 'Не вдалося зберегти'));
      } else {
        setList(prev =>
          prev
            .map(x => (x.id === id ? json : x))
            .filter(a => parseISO(a.startTime).toISOString().slice(0, 10) === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
        cancelEdit();
        toast.success('Зміни збережено');
      }
    } catch {
      toast.error('Не вдалося зберегти');
    } finally {
      setLoadingSaveId(null);
    }
  }

  // Удаление
  async function deleteItem(id: number) {
    setLoadingDeleteId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(prev => prev.filter(x => x.id !== id));
        toast.success('Запис видалено');
      } else {
        const json = await res.json();
        toast.error(formatErrorMessage(json.error || 'Не вдалося видалити'));
      }
    } catch {
      toast.error('Не вдалося видалити');
    } finally {
      setLoadingDeleteId(null);
    }
  }

  // Рендер
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Запис клієнтів</h1>

      <NewAppointmentForm
        todayStr={todayStr}
        newForm={newForm}
        setNewForm={setNewForm}
        loadingAdd={loadingAdd}
        handleAdd={handleAdd}
        errorFields={newFormErrors}
      />

      <DateFilter date={date} setDate={setDate} disabled={loadingAdd} />

      <AppointmentTimeline
        list={list}
        scaleStart={8}
        scaleDuration={12}
        colorMap={colorMap}
        timelineRef={timelineRef}
        activeTooltipId={activeTooltipId}
        toggleTooltip={() => {}}
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
        />
      )}
    </div>
  );
}
