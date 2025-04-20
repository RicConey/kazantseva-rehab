// File: /components/AdminAppointments/SkeletonTimeline.tsx
'use client';

import React from 'react';
import styles from '../AdminAppointments.module.css';

export default function SkeletonTimeline() {
  const ticks = 13; // scaleEnd - scaleStart + 1 (8–20 час)
  return (
    <div className={`${styles.timeline} ${styles.skeletonTimelineContainer}`}>
      {Array.from({ length: ticks }).map((_, i) => {
        const left = (i / (ticks - 1)) * 100;
        return (
          <div key={i} className={styles.skeletonTimelineBlock} style={{ left: `${left}%` }} />
        );
      })}
    </div>
  );
}
