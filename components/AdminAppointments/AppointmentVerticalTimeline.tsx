'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../AdminAppointments.module.css';

export interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string; // свободное текстовое поле
  clientId?: string | null; // опциональный FK на Client.id
  clientRel?: { id: string; name: string } | null; // загруженный объект клиента
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
  showTimeLabels: boolean;
}

export default function AppointmentVerticalTimeline({
  list,
  scaleStart,
  scaleDuration,
  colorMap,
  timelineRef,
  activeTooltipId,
  toggleTooltip,
  kyivFormatter,
  showTimeLabels,
}: Props) {
  const EDGE_GAP = 8;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [clampedTop, setClampedTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (activeTooltipId === null) {
      setClampedTop(null);
      return;
    }
    const wrap = document.querySelector(
      `[data-appt-id="${activeTooltipId}"]`
    ) as HTMLElement | null;
    const tip = tooltipRef.current;
    const tl = timelineRef.current;
    if (!wrap || !tip || !tl) {
      setClampedTop(null);
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const tlRect = tl.getBoundingClientRect();

    const centerY = wrapRect.top + wrapRect.height / 2;
    const topFree = centerY - tipRect.height / 2;
    const bottomFree = centerY + tipRect.height / 2;

    let shift = 0;
    if (topFree < tlRect.top + EDGE_GAP) {
      shift = tlRect.top + EDGE_GAP - topFree;
    } else if (bottomFree > tlRect.bottom - EDGE_GAP) {
      shift = tlRect.bottom - EDGE_GAP - bottomFree;
    }

    setClampedTop(wrapRect.height / 2 - tipRect.height / 2 + shift);
  }, [activeTooltipId, list, timelineRef]);

  const tickCount = Math.floor(scaleDuration) + 1;

  return (
    <div className={styles.timelineVertical} ref={timelineRef}>
      {Array.from({ length: tickCount }, (_, i) => {
        const topPct = (i / scaleDuration) * 100;
        return (
          <React.Fragment key={i}>
            <div className={styles.timelineTickVertical} style={{ top: `${topPct}%` }} />
            {showTimeLabels && (
              <span className={styles.timelineLabelVertical} style={{ top: `${topPct}%` }}>
                {scaleStart + i}:00
              </span>
            )}
          </React.Fragment>
        );
      })}

      {list.map(a => {
        const dt = new Date(a.startTime);
        const endDt = new Date(dt.getTime() + a.duration * 60000);
        const startH = dt.getHours() + dt.getMinutes() / 60;
        const topPct = ((startH - scaleStart) / scaleDuration) * 100;
        const heightPct = (a.duration / 60 / scaleDuration) * 100;

        // окончательное имя клиента
        const displayName = a.clientId && a.clientRel ? a.clientRel.name : a.client;

        // цвет по ключу displayName
        const bg = colorMap[displayName] || '#249b89';
        const isActive = activeTooltipId === a.id;

        return (
          <div
            key={a.id}
            data-appt-id={a.id}
            className={styles.apptWrapperVertical}
            style={{ top: `${topPct}%`, height: `${heightPct}%` }}
            onMouseEnter={() => toggleTooltip(a.id)}
            onMouseLeave={() => toggleTooltip(null)}
            onTouchEnd={e => {
              e.stopPropagation();
              toggleTooltip(isActive ? null : a.id);
            }}
          >
            <div className={styles.apptBlockVertical} style={{ backgroundColor: bg }} />
            <div
              ref={tooltipRef}
              className={styles.tooltip}
              style={{
                visibility: isActive ? 'visible' : 'hidden',
                left: '100%',
                transform:
                  clampedTop != null && isActive
                    ? `translateY(${clampedTop}px)`
                    : 'translateY(-50%)',
              }}
            >
              <div>
                <strong>
                  {kyivFormatter.format(dt)}–{kyivFormatter.format(endDt)}
                </strong>
              </div>
              <div>
                <strong>
                  {a.clientId && a.clientRel ? (
                    <Link href={`/admin/clients/${a.clientRel.id}`}>{a.clientRel.name}</Link>
                  ) : (
                    a.client
                  )}
                </strong>
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
