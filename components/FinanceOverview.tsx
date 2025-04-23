'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeeklyTable from './WeeklyTable';
import styles from './AdminAppointments.module.css';
import BackButton from '@components/BackButton';

interface MonthRow {
  periodStart: string;
  total: number;
}

export default function FinanceOverview() {
  const today = new Date();
  const [monthData, setMonthData] = useState<MonthRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const year = today.getFullYear();
      const res = await axios.get<MonthRow[]>(`/api/finance/monthly-range?year=${year}`);
      setMonthData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <p style={{ color: '#249b89', textAlign: 'center', margin: '1rem 0' }}>
        Завантаженя місяців…
      </p>
    );
  }

  // Подготовка месяцев
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
  const monthTotals = ukMonths.map((name, idx) => {
    const key = `${today.getFullYear()}-${String(idx + 1).padStart(2, '0')}-01`;
    const row = monthData.find(m => m.periodStart === key);
    return { name, total: row?.total ?? 0 };
  });
  const yearTotal = monthTotals.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className={styles.container}>
      <BackButton />
      <h1 className={styles.title}>Фінансова звітність</h1>

      {/* Недельная таблица */}
      <section>
        <h2 className={styles.title}>Доходи по дням тижня</h2>
        <WeeklyTable />
      </section>

      {/* Месячная таблица */}
      <section>
        <h2 className={styles.title}>Доходи за місяцями</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '1rem 0',
          }}
        >
          <table className={styles.table}>
            <tbody>
              {monthTotals.map((m, i) => (
                <tr key={i}>
                  <td className={styles.tableCell}>{m.name}</td>
                  <td className={styles.tableCell} style={{ textAlign: 'right' }}>
                    {m.total.toLocaleString()} грн
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Итог за год */}
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
          {yearTotal.toLocaleString()} грн
        </p>
      </section>
      <BackButton />
    </div>
  );
}
