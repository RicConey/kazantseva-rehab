// components/FinanceOverview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyTable from './WeeklyTable';
import { FaSpinner } from 'react-icons/fa';
import styles from './AdminAppointments.module.css';

interface MonthRow {
  periodStart: string;
  total: number;
}

export default function FinanceOverview() {
  const [monthData, setMonthData] = useState<MonthRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMonths() {
      setLoading(true);
      setError(null);
      try {
        const year = new Date().getFullYear();
        const res = await axios.get<MonthRow[]>(`/api/finance/monthly-range?year=${year}`);
        if (!cancelled) {
          setMonthData(res.data);
        }
      } catch (e) {
        if (!cancelled) {
          setError('Не вдалося завантажити дані');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMonths();

    return () => {
      cancelled = true;
    };
  }, []); // пустой массив — эффект запускается один раз

  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <FaSpinner className={styles.spin} />
        <span className={styles.loadingText}>Завантаження даних…</span>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>{error}</p>;
  }

  // Подготовка данных для таблицы
  const ukMonths = [
    'Січень',
    'Лютий',
    'Березень',
    'Квітень',
    'Травень',
    'Червень',
    'Липень',
    'Серпень',
    'Вересень',
    'Жовтень',
    'Листопад',
    'Грудень',
  ];
  const today = new Date();
  const year = today.getFullYear();
  const monthTotals = ukMonths.map((name, idx) => {
    const key = `${year}-${String(idx + 1).padStart(2, '0')}-01`;
    const row = monthData.find(m => m.periodStart === key);
    return { name, total: row?.total ?? 0 };
  });
  const yearTotal = monthTotals.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Фінансова звітність</h1>

      <section>
        <h2 className={styles.title}>Доходи по дням тижня</h2>
        <WeeklyTable />
      </section>

      <section>
        <h2 className={styles.title}>Доходи за місяцями</h2>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <table className={styles.table}>
            <tbody>
              {monthTotals.map((m, i) => (
                <tr key={i}>
                  <td className={styles.tableCell}>{m.name}</td>
                  <td className={styles.tableCell} style={{ textAlign: 'right' }}>
                    {m.total.toLocaleString()} грн
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className={styles.title}>Підсумок за рік</h2>
        <p
          style={{
            textAlign: 'center',
            color: '#249b89',
            fontSize: '1.5rem',
            fontWeight: 600,
            margin: '1rem 0',
          }}
        >
          {yearTotal.toLocaleString()} грн
        </p>
      </section>
    </div>
  );
}
