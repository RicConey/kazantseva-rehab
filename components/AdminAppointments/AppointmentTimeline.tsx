'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
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
  toggleTooltip: (id: number | null) => void;
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
  const EDGE_GAP = 8;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [clampedLeft, setClampedLeft] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (activeTooltipId === null) {
      setClampedLeft(null);
      return;
    }
    const wrapperEl = document.querySelector(
      `[data-appt-id="${activeTooltipId}"]`
    ) as HTMLElement | null;
    const tipEl = tooltipRef.current;
    const timelineEl = timelineRef.current;
    if (!wrapperEl || !tipEl || !timelineEl) {
      setClampedLeft(null);
      return;
    }

    const wrapRect = wrapperEl.getBoundingClientRect();
    const tipRect = tipEl.getBoundingClientRect();
    const tlRect = timelineEl.getBoundingClientRect();

    const centerX = wrapRect.left + wrapRect.width / 2;
    const leftFree = centerX - tipRect.width / 2;
    const rightFree = centerX + tipRect.width / 2;

    let shiftX = 0;
    if (leftFree < tlRect.left + EDGE_GAP) {
      shiftX = tlRect.left + EDGE_GAP - leftFree;
    } else if (rightFree > tlRect.right - EDGE_GAP) {
      shiftX = tlRect.right - EDGE_GAP - rightFree;
    }

    const local = wrapRect.width / 2 - tipRect.width / 2 + shiftX;
    setClampedLeft(local);
  }, [activeTooltipId, list, timelineRef]);

  const tickCount = Math.floor(scaleDuration) + 1;

  return (
    <div className={styles.timeline} ref={timelineRef}>
      {Array.from({ length: tickCount }, (_, i) => {
        const leftPct = (i / scaleDuration) * 100;
        return (
          <React.Fragment key={i}>
            <div className={styles.timelineTick} style={{ left: `${leftPct}%` }} />
            <span className={styles.timelineLabel} style={{ left: `${leftPct}%` }}>
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
        const leftPct = ((startH - scaleStart) / scaleDuration) * 100;
        const widthPct = (a.duration / 60 / scaleDuration) * 100;
        const bg = colorMap[a.client] || '#249b89';

        const isActive = activeTooltipId === a.id;

        return (
          <div
            key={a.id}
            data-appt-id={a.id}
            className={styles.apptWrapper}
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            onMouseEnter={() => toggleTooltip(a.id)}
            onMouseLeave={() => toggleTooltip(null)}
            onTouchEnd={e => {
              e.stopPropagation();
              toggleTooltip(isActive ? null : a.id);
            }}
          >
            <div className={styles.apptBlock} style={{ backgroundColor: bg }} />
            <div
              ref={tooltipRef}
              className={styles.tooltip}
              style={{
                visibility: isActive ? 'visible' : 'hidden',
                ...(clampedLeft !== null && isActive
                  ? { left: `${clampedLeft}px`, transform: 'none' }
                  : {}),
              }}
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
