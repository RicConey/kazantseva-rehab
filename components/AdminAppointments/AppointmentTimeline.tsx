// components/AdminAppointments/AppointmentTimeline.tsx
'use client';

import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/svg-arrow.css';
import styles from '../AdminAppointments.module.css';

export interface Appointment {
  id: number;
  startTime: string;
  duration: number;
  client: string;
  clientId?: string | null;
  clientRel?: { id: string; name: string } | null;
  notes?: string | null;
  location: { id: number; name: string };
  price: number;
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
  const locations = Array.from(new Map(list.map(a => [a.location.id, a.location])).values()).sort(
    (a, b) => a.id - b.id
  );

  const LANE_HEIGHT = 30;
  const subLaneHeight = LANE_HEIGHT / locations.length;
  const tickCount = Math.floor(scaleDuration) + 1;

  return (
    <div
      className={styles.timeline}
      ref={timelineRef}
      style={{ position: 'relative', overflow: 'visible', height: `${LANE_HEIGHT}px` }}
    >
      {Array.from({ length: tickCount }, (_, i) => {
        const hour = scaleStart + i;
        const leftPct = (i / scaleDuration) * 100;
        return (
          <React.Fragment key={i}>
            <div className={styles.timelineTick} style={{ left: `${leftPct}%` }} />
            <span className={styles.timelineLabel} style={{ left: `${leftPct}%` }}>
              {hour}
            </span>
          </React.Fragment>
        );
      })}

      {list.map(a => {
        const dt = new Date(a.startTime);
        const startHour = dt.getHours() + dt.getMinutes() / 60;
        const leftPct = ((startHour - scaleStart) / scaleDuration) * 100;
        const widthPct = (a.duration / 60 / scaleDuration) * 100;
        const displayName = a.clientRel?.name ?? a.client;
        const bg = colorMap[displayName] || '#249b89';
        const startStr = kyivFormatter.format(dt);
        const endStr = kyivFormatter.format(new Date(dt.getTime() + a.duration * 60000));

        return (
          <Tippy
            key={a.id}
            content={
              <>
                <div>
                  <strong>
                    {startStr}–{endStr}
                  </strong>
                </div>
                <div>
                  <strong>{displayName}</strong>
                </div>
                <div>Локація: {a.location.name}</div>
                <div>Тривалість: {a.duration} хв</div>
                {a.notes && <div>📝 {a.notes}</div>}
                <div>{a.price} ₴</div>
              </>
            }
            placement="bottom"
            theme="light"
            arrow={true}
            animation="shift-away"
            duration={[200, 200]}
            maxWidth="90vw"
            popperOptions={{
              modifiers: [
                { name: 'preventOverflow', options: { padding: 8 } },
                { name: 'flip', options: { fallbackPlacements: ['top', 'left', 'right'] } },
              ],
            }}
          >
            <div
              data-appt-id={a.id}
              className={styles.apptWrapper}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                top: `${locations.findIndex(loc => loc.id === a.location.id) * subLaneHeight}px`,
                height: `${subLaneHeight}px`,
                overflow: 'visible',
                backgroundColor: bg,
              }}
              onMouseEnter={() => toggleTooltip(a.id)}
              onMouseLeave={() => toggleTooltip(null)}
              onTouchStart={e => {
                e.stopPropagation();
                toggleTooltip(activeTooltipId === a.id ? null : a.id);
              }}
            >
              <div className={styles.apptBlock} />
            </div>
          </Tippy>
        );
      })}
    </div>
  );
}
