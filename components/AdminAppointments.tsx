// File: /components/AdminAppointments.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './AdminAppointments.module.css';
import { parseISO, format } from 'date-fns';

import NewAppointmentForm from './AdminAppointments/NewAppointmentForm';
import DateFilter from './AdminAppointments/DateFilter';
import AppointmentTimeline from './AdminAppointments/AppointmentTimeline';
import AppointmentTable from './AdminAppointments/AppointmentTable';
import SkeletonTimeline from './AdminAppointments/SkeletonTimeline';
import SkeletonTable from './AdminAppointments/SkeletonTable';

interface Appointment {
  id: number;
  startTime: string; // ISO UTC
  duration: number; // в минутах
  client: string;
  notes?: string | null;
}

export default function AdminAppointments() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Formatter для Киевского времени
  const kyivFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Kyiv',
      }),
    []
  );

  // Заменяет в тексте все ISO‑метки на формат HH:mm по Киеву
  function formatErrorMessage(msg: string) {
    return msg.replace(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})/g,
      iso => {
        try {
          const dt = parseISO(iso);
          return kyivFormatter.format(dt);
        } catch {
          return iso;
        }
      }
    );
  }

  // Состояния
  const [date, setDate] = useState(todayStr);
  const [list, setList] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(newForm);

  // Загрузка списка для выбранной даты
  useEffect(() => {
    setLoadingList(true);
    fetch(`/api/appointments?date=${date}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Appointment[]) => setList(data))
      .catch(() => setList([]))
      .finally(() => setLoadingList(false));
    setNewForm(f => ({ ...f, date }));
  }, [date]);

  // Генерация пастельных цветов
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  useEffect(() => {
    const m = { ...colorMap };
    list.forEach(a => {
      if (!m[a.client]) {
        let h = 0;
        for (const c of a.client) h = c.charCodeAt(0) + ((h << 5) - h);
        m[a.client] = `hsl(${Math.abs(h) % 360},70%,80%)`;
      }
    });
    setColorMap(m);
  }, [list]);

  // Закрыть тултип при клике вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-appt-id]')) {
        setActiveTooltipId(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Проверка перекрытий по времени
  function isOverlap(start: Date, dur: number, skipId?: number) {
    const end = new Date(start.getTime() + dur * 60000);
    return list.some(appt => {
      if (appt.id === skipId) return false;
      const s = new Date(appt.startTime);
      const e = new Date(s.getTime() + appt.duration * 60000);
      return start < e && s < end;
    });
  }

  // Добавление записи
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { date: d, time, duration, client, notes } = newForm;
    const durNum = parseInt(duration, 10);
    if (!d || !time || !client.trim() || isNaN(durNum)) {
      setError('Заповніть всі поля коректно');
      return;
    }
    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const localDate = new Date(Y, M - 1, D, h, m);
    const utcString = localDate.toISOString();

    if (isOverlap(localDate, durNum)) {
      setError('Час перекривається з іншими сеансами');
      return;
    }

    setLoadingAdd(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: utcString,
          duration: durNum,
          client: client.trim(),
          notes: notes.trim() || null,
        }),
      });
      const json: any = await res.json();
      if (!res.ok) {
        setError(formatErrorMessage(json.error || 'Не вдалося додати запис'));
      } else {
        setList(prev =>
          [...prev, json]
            .filter(a => parseISO(a.startTime).toISOString().slice(0, 10) === date)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        );
        setNewForm({ date: todayStr, time: '', duration: '', client: '', notes: '' });
      }
    } catch {
      setError('Не вдалося додати запис');
    } finally {
      setLoadingAdd(false);
    }
  }

  // Начало редактирования
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
    setError('');
  }
  function cancelEdit() {
    setEditingId(null);
    setError('');
  }

  // Сохранение редактирования
  async function saveEdit(id: number) {
    setError('');
    const { date: d, time, duration, client, notes } = editForm;
    const durNum = parseInt(duration, 10);
    if (isNaN(durNum)) {
      setError('Введіть коректну тривалість');
      return;
    }
    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const localDate = new Date(Y, M - 1, D, h, m);
    const utcString = localDate.toISOString();

    if (isOverlap(localDate, durNum, id)) {
      setError('Час перекривається з іншими сеансами');
      return;
    }

    setLoadingSaveId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: utcString,
          duration: durNum,
          client: client.trim(),
          notes: notes.trim() || null,
        }),
      });
      const json: any = await res.json();
      if (!res.ok) {
        setError(formatErrorMessage(json.error || 'Не вдалося зберегти'));
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
      setError('Не вдалося зберегти');
    } finally {
      setLoadingSaveId(null);
    }
  }

  // Удаление
  async function deleteItem(id: number) {
    if (!confirm('Ви впевнені?')) return;
    setLoadingDeleteId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setList(prev => prev.filter(x => x.id !== id));
      } else {
        const json: any = await res.json();
        setError(formatErrorMessage(json.error || 'Не вдалося видалити'));
      }
    } catch {
      setError('Не вдалося видалити');
    } finally {
      setLoadingDeleteId(null);
    }
  }

  // Тултип: показать/скрыть + корректировка позиции
  function toggleTooltip(id: number) {
    setActiveTooltipId(cur => {
      const next = cur === id ? null : id;
      if (next !== null) setTimeout(() => adjustTooltip(id), 0);
      return next;
    });
  }
  function adjustTooltip(id: number) {
    const wr = document.querySelector(`[data-appt-id="${id}"]`) as HTMLElement;
    const tip = wr?.querySelector(`.${styles.tooltip}`) as HTMLElement;
    const cn = timelineRef.current;
    if (!tip || !cn) return;
    tip.style.transform = 'translateX(-50%)';
    const t = tip.getBoundingClientRect(),
      c = cn.getBoundingClientRect();
    let shift = 0;
    if (t.left < c.left) shift = c.left - t.left + 4;
    else if (t.right > c.right) shift = c.right - t.right - 4;
    tip.style.transform = `translateX(calc(-50% + ${shift}px))`;
  }

  const scaleStart = 8,
    scaleEnd = 20,
    scaleDuration = scaleEnd - scaleStart;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Запис клієнтів</h1>
      {error && <div className={styles.error}>{error}</div>}

      <NewAppointmentForm
        todayStr={todayStr}
        newForm={newForm}
        setNewForm={setNewForm}
        loadingAdd={loadingAdd}
        handleAdd={handleAdd}
      />

      <DateFilter date={date} setDate={setDate} disabled={loadingAdd} />

      {loadingList ? (
        <SkeletonTimeline />
      ) : (
        <AppointmentTimeline
          list={list}
          scaleStart={scaleStart}
          scaleDuration={scaleDuration}
          colorMap={colorMap}
          timelineRef={timelineRef}
          activeTooltipId={activeTooltipId}
          toggleTooltip={toggleTooltip}
          kyivFormatter={kyivFormatter}
        />
      )}

      {loadingList ? (
        <SkeletonTable />
      ) : (
        <AppointmentTable
          list={list}
          todayStr={todayStr}
          editingId={editingId}
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
        />
      )}
    </div>
  );
}
