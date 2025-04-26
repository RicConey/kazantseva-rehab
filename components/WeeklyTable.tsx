// components/WeeklyTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import styles from './AdminAppointments.module.css';

interface DayRow {
  periodStart: string;
  total: number;
}

export default function WeeklyTable() {
  const router = useRouter();
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [dayData, setDayData] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных за неделю
  useEffect(() => {
    let cancelled = false;

    async function fetchWeek() {
      setLoading(true);
      setError(null);
      try {
        const from = format(weekStart, 'yyyy-MM-dd');
        const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        const res = await axios.get<DayRow[]>(`/api/finance/daily-range?from=${from}&to=${to}`);
        if (!cancelled) setDayData(res.data);
      } catch (e) {
        if (!cancelled) setError('Не вдалося завантажити дані тижня');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeek();
    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => {
    const nxt = addDays(weekStart, 7);
    if (nxt <= startOfWeek(today, { weekStartsOn: 1 })) {
      setWeekStart(nxt);
    }
  };

  // Спиннер или ошибка
  if (loading || error) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        {loading && (
          <div className={styles.loadingWrapper}>
            <FaSpinner className={styles.spin} />
            <span className={styles.loadingText}>Завантаження тижня…</span>
          </div>
        )}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    );
  }

  // Даты недели и суммы
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekVals = days.map(d => {
    const iso = format(d, 'yyyy-MM-dd');
    const row = dayData.find(r => r.periodStart === iso);
    return row != null ? row.total : null;
  });
  const weekSum = weekVals.reduce((s, v) => s + (v ?? 0), 0);

  return (
    <div>
      {/* Заголовок с навигацией */}
      <div className={styles.weeklyHeader}>
        <h3 className={styles.weekMonth}>{format(weekStart, 'LLLL yyyy', { locale: uk })}</h3>
        <div className={styles.weekNav}>
          <button onClick={prevWeek}>‹</button>
          <button onClick={nextWeek}>›</button>
        </div>
      </div>

      {/* Таблица */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {days.map((d, i) => (
                <th key={i} className={styles.tableCell} style={{ borderLeft: '1px solid #ddd' }}>
                  {format(d, 'EE dd', { locale: uk }).replace('.', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((d, i) => {
                const v = weekVals[i];
                const iso = format(d, 'yyyy-MM-dd');
                return (
                  <td
                    key={i}
                    className={styles.tableCell}
                    style={{ borderLeft: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => router.push(`/admin/appointments?date=${iso}`)}
                  >
                    {v != null ? v.toLocaleString() : ''}
                  </td>
                );
              })}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={7}
                className={styles.tableCell}
                style={{
                  textAlign: 'center',
                  color: '#249b89',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {weekSum.toLocaleString()} грн
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
