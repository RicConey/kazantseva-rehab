'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatInTimeZone } from 'date-fns-tz';
import styles from '../AdminAppointments.module.css';

export interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  clientId?: string | null;
  clientRel?: { id: string; name: string } | null;
  notes?: string | null;
}

const TZ = 'Europe/Kyiv';
const SCALE_START = 8;
const SCALE_DURATION = 13.5;

export default function WeeklySchedule() {
  const router = useRouter();

  // вычисление понедельника недели
  const [mondayStart, setMondayStart] = useState<Date>(() => {
    const now = new Date();
    const diff = (now.getDay() + 6) % 7;
    const m = new Date(now);
    m.setDate(now.getDate() - diff);
    m.setHours(0, 0, 0, 0);
    return m;
  });

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

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(mondayStart);
        d.setDate(mondayStart.getDate() + i);
        return d;
      }),
    [mondayStart]
  );

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

  // строим colorMap по окончательному имени
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    appointments.forEach(a => {
      const name = a.clientId && a.clientRel ? a.clientRel.name : a.client;
      if (!map[name]) {
        let h = 0;
        for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
        map[name] = `hsl(${Math.abs(h) % 360},80%,65%)`;
      }
    });
    return map;
  }, [appointments]);

  const kyivFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TZ,
      }),
    []
  );

  const hours = useMemo(
    () => Array.from({ length: Math.floor(SCALE_DURATION) + 1 }, (_, i) => SCALE_START + i),
    []
  );

  const monthLabel = mondayStart
    .toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
    .replace(/^./, s => s.toUpperCase());

  return (
    <div className={styles.container}>
      <div className={styles.weeklyHeader}>
        <h1 className={styles.title}>Тижневий розклад</h1>
        <div className={styles.weekNav}>
          <button onClick={prevWeek}>&lsaquo;</button>
          <span className={styles.weekMonth}>{monthLabel}</span>
          <button onClick={nextWeek}>&rsaquo;</button>
        </div>
      </div>

      <div className={styles.weeklyGrid}>
        {/* колонка с часами */}
        <div className={styles.timeColumn}>
          <div className={styles.dayHeaderPlaceholder} />
          {hours.map(h => (
            <div key={h} className={styles.timeLabelGrid}>
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* по дням */}
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
                {/* линии разметки */}
                {hours.map((_, i) => (
                  <div
                    key={i}
                    className={styles.timelineTickGlobal}
                    style={{ top: `${(i / SCALE_DURATION) * 100}%` }}
                  />
                ))}

                {/* события */}
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

                      const name = a.clientId && a.clientRel ? a.clientRel.name : a.client;

                      return (
                        <div
                          key={a.id}
                          data-appt-id={a.id}
                          className={styles.eventGrid}
                          style={{
                            top: `${topPct}%`,
                            height: `${heightPct}%`,
                            backgroundColor: colorMap[name],
                          }}
                        >
                          <div className={styles.eventContent}>
                            {a.clientId && a.clientRel ? (
                              <Link href={`/admin/clients/${a.clientRel.id}`}>
                                {a.clientRel.name}
                              </Link>
                            ) : (
                              a.client
                            )}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
