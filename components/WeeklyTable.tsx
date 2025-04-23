// components/WeeklyTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays } from 'date-fns';
import { uk } from 'date-fns/locale';
import styles from './AdminAppointments.module.css';

interface DayRow {
  periodStart: string;
  total: number;
}

export default function WeeklyTable() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [dayData, setDayData] = useState<DayRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных за неделю
  useEffect(() => {
    (async () => {
      setLoading(true);
      const from = format(weekStart, 'yyyy-MM-dd');
      const to = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const res = await axios.get<DayRow[]>(`/api/finance/daily-range?from=${from}&to=${to}`);
      setDayData(res.data);
      setLoading(false);
    })();
  }, [weekStart]);

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => {
    const nxt = addDays(weekStart, 7);
    if (nxt <= startOfWeek(today, { weekStartsOn: 1 })) {
      setWeekStart(nxt);
    }
  };

  if (loading) {
    return (
      <p style={{ color: '#249b89', textAlign: 'center', margin: '1rem 0' }}>Завантаженя тижня…</p>
    );
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekVals = days.map(d => {
    const iso = format(d, 'yyyy-MM-dd');
    const row = dayData.find(r => r.periodStart === iso);
    return row != null ? row.total : null;
  });
  const weekSum = weekVals.reduce((s, v) => s + (v ?? 0), 0);

  return (
    <div>
      {/* Заголовок с месяцем и навигацией */}
      <div className={styles.weeklyHeader}>
        <h3 className={styles.weekMonth}>{format(weekStart, 'LLLL yyyy', { locale: uk })}</h3>
        <div className={styles.weekNav}>
          <button onClick={prevWeek}>‹</button>
          <button onClick={nextWeek}>›</button>
        </div>
      </div>

      {/* Таблица дней недели */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {days.map((d, i) => (
                <th key={i} className={styles.tableHeader} style={{ borderLeft: '1px solid #ddd' }}>
                  {format(d, 'EE dd', { locale: uk }).replace('.', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekVals.map((v, i) => (
                <td
                  key={i}
                  className={styles.tableCell}
                  style={{ borderLeft: '1px solid #ddd', textAlign: 'center' }}
                >
                  {v != null ? v.toLocaleString() : ''}
                </td>
              ))}
            </tr>
          </tbody>

          {/* Итог недели в одной ячейке с рамкой */}
          <tfoot>
            <tr>
              <td
                colSpan={7}
                className={styles.tableCell}
                style={{
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  color: '#249b89',
                  fontSize: '1.3rem',
                }}
              >
                {weekSum.toLocaleString()} грн
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
