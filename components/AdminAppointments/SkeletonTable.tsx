// File: /components/AdminAppointments/SkeletonTable.tsx
'use client';

import React from 'react';
import styles from '../AdminAppointments.module.css';

export default function SkeletonTable() {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i}>
                <div
                  className={styles.skeletonTableCell}
                  style={{ width: '60%', height: '1rem' }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: 5 }).map((_, col) => (
                <td key={col}>
                  <div
                    className={styles.skeletonTableCell}
                    style={{ width: '100%', height: '1rem' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
