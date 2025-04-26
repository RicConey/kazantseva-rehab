'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import styles from '../AdminAppointments.module.css';

export interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string; // свободное текстовое поле (имя/телефон)
  clientId?: string | null; // опциональный FK на Client.id
  clientRel?: {
    // связанный клиент, если выбран из базы
    id: string;
    name: string;
  } | null;
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

  // Корректируем позицию тултипа, чтобы не выходить за границы
  useLayoutEffect(() => {
    if (activeTooltipId === null) {
      setClampedLeft(null);
      return;
    }
    const wrapper = document.querySelector(
      `[data-appt-id="${activeTooltipId}"]`
    ) as HTMLElement | null;
    const tip = tooltipRef.current;
    const tl = timelineRef.current;
    if (!wrapper || !tip || !tl) {
      setClampedLeft(null);
      return;
    }
    const wrapRect = wrapper.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const tlRect = tl.getBoundingClientRect();

    const centerX = wrapRect.left + wrapRect.width / 2;
    const leftFree = centerX - tipRect.width / 2;
    const rightFree = centerX + tipRect.width / 2;

    let shiftX = 0;
    if (leftFree < tlRect.left + EDGE_GAP) {
      shiftX = tlRect.left + EDGE_GAP - leftFree;
    } else if (rightFree > tlRect.right - EDGE_GAP) {
      shiftX = tlRect.right - EDGE_GAP - rightFree;
    }

    setClampedLeft(wrapRect.width / 2 - tipRect.width / 2 + shiftX);
  }, [activeTooltipId, list, timelineRef]);

  const tickCount = Math.floor(scaleDuration) + 1;

  return (
    <div className={styles.timeline} ref={timelineRef}>
      {/* Шкала времени */}
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

      {/* Блоки приёмов */}
      {list.map(a => {
        const dt = new Date(a.startTime);
        const endDt = new Date(dt.getTime() + a.duration * 60000);
        const startStr = kyivFormatter.format(dt);
        const endStr = kyivFormatter.format(endDt);
        const startHour = dt.getHours() + dt.getMinutes() / 60;
        const leftPct = ((startHour - scaleStart) / scaleDuration) * 100;
        const widthPct = (a.duration / 60 / scaleDuration) * 100;

        // Отображаемое имя
        const displayName = a.clientRel?.name ?? a.client;

        // Цвет по имени
        const bg = colorMap[displayName] || '#249b89';
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
                <strong>{displayName}</strong>
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
