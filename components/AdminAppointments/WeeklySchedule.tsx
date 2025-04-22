'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import styles from '../AdminAppointments.module.css';
import BackButton from '@components/BackButton';

export interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  notes?: string | null;
}

const TZ = 'Europe/Kyiv';
const SCALE_START = 8;
const SCALE_DURATION = 13.5;

export default function WeeklySchedule() {
  const router = useRouter();

  // 1) State для понедельника недели 00:00
  const [mondayStart, setMondayStart] = useState<Date>(() => {
    const now = new Date();
    const diff = (now.getDay() + 6) % 7;
    const m = new Date(now);
    m.setDate(now.getDate() - diff);
    m.setHours(0, 0, 0, 0);
    return m;
  });

  // 2) Навигация между неделями
  const prevWeek = () =>
    setMondayStart(d => {
      const p = new Date(d);
      p.setDate(d.getDate() - 7);
      return p;
    });
  const nextWeek = () =>
    setMondayStart(d => {
      const n = new Date(d);
      n.setDate(d.getDate() + 7);
      return n;
    });

  // 3) Список из 7 дней (понедельник + i)
  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(mondayStart);
        d.setDate(mondayStart.getDate() + i);
        return d;
      }),
    [mondayStart]
  );

  // 4) Загрузка приёмов + флаг loading
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const from = mondayStart.toISOString();
    const to = new Date(mondayStart.getTime() + 7 * 86400000).toISOString();
    fetch(`/api/appointments?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(r => r.json())
      .then((data: Appointment[]) => setAppointments(data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [mondayStart]);

  // 5) Цвета клиентов чуть ярче
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    appointments.forEach(a => {
      if (!map[a.client]) {
        let h = 0;
        for (const c of a.client) h = c.charCodeAt(0) + ((h << 5) - h);
        map[a.client] = `hsl(${Math.abs(h) % 360},80%,65%)`;
      }
    });
    return map;
  }, [appointments]);

  // 6) Форматер времени (Киев)
  const kyivFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TZ,
      }),
    []
  );

  // 7) Часовые метки
  const hours = useMemo(
    () => Array.from({ length: Math.floor(SCALE_DURATION) + 1 }, (_, i) => SCALE_START + i),
    []
  );

  // 8) Месяц для шапки
  const monthLabel = mondayStart
    .toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
    .replace(/^./, s => s.toUpperCase());

  return (
    <div className={styles.container}>
      {/* Назад */}
      <BackButton />

      {/* Хедер: заголовок и навигация */}
      <div className={styles.weeklyHeader}>
        <h1 className={styles.title}>Тижневий розклад</h1>
        <div className={styles.weekNav}>
          <button onClick={prevWeek}>&lsaquo;</button>
          <span className={styles.weekMonth}>{monthLabel}</span>
          <button onClick={nextWeek}>&rsaquo;</button>
        </div>
      </div>

      {/* Сетка: часы + дни */}
      <div className={styles.weeklyGrid}>
        {/* Колонка часов */}
        <div className={styles.timeColumn}>
          <div className={styles.dayHeaderPlaceholder} />
          {hours.map(h => (
            <div key={h} className={styles.timeLabelGrid}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* 7 дней */}
        {days.map(d => {
          const dateKey = formatInTimeZone(d, TZ, 'yyyy-MM-dd');
          const isToday =
            formatInTimeZone(d, TZ, 'yyyy-MM-dd') ===
            formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd');
          const weekdayAbbrev = d.toLocaleDateString('uk-UA', { weekday: 'narrow' }).toUpperCase();
          const dayNumber = d.getDate();
          const dayAppts = appointments.filter(
            a => formatInTimeZone(new Date(a.startTime), TZ, 'yyyy-MM-dd') === dateKey
          );

          return (
            <div
              key={dateKey}
              className={`${styles.dayColumn} ${isToday ? styles.todayColumn : ''}`}
              onClick={() => router.push(`/admin/appointments?date=${dateKey}`)}
            >
              <div className={styles.dayHeaderGrid}>
                <span className={styles.weekdayAbbrev}>{weekdayAbbrev}</span>
                <span className={styles.dayNumber}>{dayNumber}</span>
              </div>

              <div className={styles.eventsContainer}>
                {/* Фоновые линии */}
                {hours.map((_, i) => (
                  <div
                    key={i}
                    className={styles.timelineTickGlobal}
                    style={{ top: `${(i / SCALE_DURATION) * 100}%` }}
                  />
                ))}

                {/* Если loading — рисуем скелетон, иначе реальные события */}
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={styles.skeletonWeeklyBlock}
                        style={{
                          top: `${((i * 2) / SCALE_DURATION) * 100}%`,
                          height: `${(1.5 / SCALE_DURATION) * 100}%`,
                        }}
                      />
                    ))
                  : dayAppts.map(a => {
                      const dt = new Date(a.startTime);
                      const startH = dt.getHours() + dt.getMinutes() / 60;
                      const topPct = ((startH - SCALE_START) / SCALE_DURATION) * 100;
                      const heightPct = (a.duration / 60 / SCALE_DURATION) * 100;
                      return (
                        <div
                          key={a.id}
                          data-appt-id={a.id}
                          className={styles.eventGrid}
                          style={{
                            top: `${topPct}%`,
                            height: `${heightPct}%`,
                            backgroundColor: colorMap[a.client],
                          }}
                        >
                          <div className={styles.eventContent}>{a.client}</div>
                        </div>
                      );
                    })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Кнопка назад внизу */}
      <BackButton />
    </div>
  );
}
