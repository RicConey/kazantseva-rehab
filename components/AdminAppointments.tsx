// AdminAppointments.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './AdminAppointments.module.css';
import { parseISO, format } from 'date-fns';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

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
    fetch(`/api/appointments?date=${date}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Appointment[]) => setList(data))
      .catch(() => setList([]));
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
    // Собираем локальное время в UTC
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

      {/* Форма добавления */}
      <form className={styles.form} onSubmit={handleAdd}>
        <input
          type="date"
          min={todayStr}
          value={newForm.date}
          onChange={e => setNewForm(f => ({ ...f, date: e.target.value }))}
          required
          disabled={loadingAdd}
        />
        <input
          type="time"
          value={newForm.time}
          onChange={e => setNewForm(f => ({ ...f, time: e.target.value }))}
          required
          disabled={loadingAdd}
        />
        <input
          type="text"
          className={styles.durationInput}
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
          required
          disabled={loadingAdd}
        />
        <input
          type="text"
          placeholder="ФІО"
          value={newForm.client}
          onChange={e => setNewForm(f => ({ ...f, client: e.target.value }))}
          required
          disabled={loadingAdd}
        />
        <input
          type="text"
          placeholder="Заметки"
          value={newForm.notes}
          onChange={e => setNewForm(f => ({ ...f, notes: e.target.value }))}
          disabled={loadingAdd}
        />
        <button type="submit" disabled={loadingAdd}>
          {loadingAdd ? (
            <>
              <FaSpinner className={styles.spin} /> Додаємо...
            </>
          ) : (
            'Додати запис'
          )}
        </button>
      </form>

      {/* Фильтр даты */}
      <div className={styles.controls}>
        <label>
          Показати дату:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={loadingAdd}
          />
        </label>
      </div>

      {/* Таймлайн */}
      <div className={styles.timeline} ref={timelineRef}>
        {Array.from({ length: scaleDuration + 1 }, (_, i) => {
          const left = (i / scaleDuration) * 100;
          return (
            <React.Fragment key={i}>
              <div className={styles.timelineTick} style={{ left: `${left}%` }} />
              <span className={styles.timelineLabel} style={{ left: `${left}%` }}>
                {scaleStart + i}
              </span>
            </React.Fragment>
          );
        })}

        {list.map(a => {
          const dt = new Date(a.startTime);
          const endDt = new Date(dt.getTime() + a.duration * 60000);
          const startStr = kyivFormatter.format(dt);
          const endStr = kyivFormatter.format(endDt);
          const startH = dt.getHours() + dt.getMinutes() / 60;
          const left = ((startH - scaleStart) / scaleDuration) * 100;
          const width = (a.duration / 60 / scaleDuration) * 100;
          const bg = colorMap[a.client] || '#249b89';

          return (
            <div
              key={a.id}
              data-appt-id={a.id}
              className={styles.apptWrapper}
              style={{ left: `${left}%`, width: `${width}%` }}
              onMouseEnter={() => toggleTooltip(a.id)}
              onMouseLeave={() => setActiveTooltipId(null)}
              onClick={() => toggleTooltip(a.id)}
            >
              <div className={styles.apptBlock} style={{ backgroundColor: bg }} />
              <div
                className={styles.tooltip}
                style={{ visibility: activeTooltipId === a.id ? 'visible' : 'hidden' }}
              >
                <div>
                  <strong>
                    {startStr}–{endStr}
                  </strong>
                </div>
                <div>
                  <strong>{a.client}</strong>
                </div>
                <div>хв: {a.duration}</div>
                {a.notes && <div>📝 {a.notes}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Табличный вид */}
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
              const isS = loadingSaveId === a.id;
              const isD = loadingDeleteId === a.id;
              if (editingId === a.id) {
                return (
                  <tr key={a.id}>
                    <td data-label="Дата / Час">
                      <input
                        type="date"
                        min={todayStr}
                        value={editForm.date}
                        onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                        required
                        disabled={isS}
                      />
                      <input
                        type="time"
                        value={editForm.time}
                        onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                        required
                        disabled={isS}
                      />
                    </td>
                    <td data-label="Хв">
                      <input
                        type="text"
                        className={styles.durationInput}
                        value={editForm.duration}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setEditForm(f => ({ ...f, duration: v }));
                        }}
                        required
                        disabled={isS}
                      />
                    </td>
                    <td data-label="ФІО">
                      <input
                        type="text"
                        value={editForm.client}
                        onChange={e => setEditForm(f => ({ ...f, client: e.target.value }))}
                        required
                        disabled={isS}
                      />
                    </td>
                    <td data-label="Заметки">
                      <input
                        type="text"
                        value={editForm.notes}
                        onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                        disabled={isS}
                      />
                    </td>
                    <td data-label="Дії" className={styles.actions}>
                      <button title="Зберегти" onClick={() => saveEdit(a.id)} disabled={isS}>
                        {isS ? <FaSpinner className={styles.spin} /> : <FaCheck />}
                      </button>
                      <button title="Скасувати" onClick={cancelEdit} disabled={isS}>
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
                    <button title="Видалити" onClick={() => deleteItem(a.id)} disabled={isD}>
                      {isD ? <FaSpinner className={styles.spin} /> : <FaTrash />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
