// File: /components/AdminAppointments/AppointmentTimeline.tsx
'use client';

import React from 'react';
import styles from '../AdminAppointments.module.css';

interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  notes?: string | null;
}

interface Props {
  list: Appointment[];
  scaleStart: number;
  scaleDuration: number;
  colorMap: Record<string, string>;
  timelineRef: React.RefObject<HTMLDivElement>;
  activeTooltipId: number | null;
  toggleTooltip: (id: number) => void;
  kyivFormatter: Intl.DateTimeFormat;
}

export default function AppointmentTimeline({
  list,
  scaleStart,
  scaleDuration,
  colorMap,
  timelineRef,
  activeTooltipId,
  toggleTooltip,
  kyivFormatter,
}: Props) {
  return (
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
            onMouseLeave={() => toggleTooltip(a.id)}
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
  );
}
