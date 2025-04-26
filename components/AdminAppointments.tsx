// components/AdminAppointments.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import { useAppointments } from '@lib/useAppointments';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import AppointmentTable from './AdminAppointments/AppointmentTable';
import NewAppointmentForm from './AdminAppointments/NewAppointmentForm/NewAppointmentForm';
import AppointmentTimeline from './AdminAppointments/AppointmentTimeline';
import { validateSessionTime } from '../utils/appointmentValidation';
import styles from './AdminAppointments.module.css';

export default function AdminAppointments() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDate = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initialDate);

  // Теперь хук отдаёт appointments и isLoading
  const { appointments: list, isLoading, error, mutate } = useAppointments(date);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    duration: '',
    client: '',
    notes: '',
    price: '',
    clientId: '',
  });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, boolean>>({});
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [loadingSaveId, setLoadingSaveId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const startEdit = (a: any) => {
    const dt = new Date(a.startTime);
    setEditingId(a.id);
    setEditForm({
      date: format(dt, 'yyyy-MM-dd'),
      time: format(dt, 'HH:mm'),
      duration: String(a.duration),
      client: a.client,
      notes: a.notes || '',
      price: String(a.price),
      clientId: a.clientId || '',
    });
    setEditFormErrors({});
    setEditErrorMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormErrors({});
    setEditErrorMessage(null);
  };

  const isOverlap = (start: Date, duration: number, excludeId?: number): boolean => {
    const end = new Date(start.getTime() + duration * 60000);
    return (
      list.some(a => {
        if (a.id === excludeId) return false;
        const aStart = new Date(a.startTime);
        const aEnd = new Date(aStart.getTime() + a.duration * 60000);
        return start < aEnd && end > aStart;
      }) ?? false
    );
  };

  async function saveEdit(id: number) {
    setEditFormErrors({});
    setEditErrorMessage(null);

    const errs: Record<string, boolean> = {};
    const { date: d, time, duration, client, notes, price, clientId } = editForm;
    const durNum = parseInt(duration, 10);
    const priceNum = parseInt(price, 10);

    if (!d) errs.date = true;
    if (!time) errs.time = true;
    if (isNaN(durNum)) errs.duration = true;
    if (!client?.trim() && !clientId) errs.client = true;
    if (isNaN(priceNum)) errs.price = true;

    if (Object.keys(errs).length) {
      setEditFormErrors(errs);
      setEditErrorMessage('Поля заповнені некоректно');
      return;
    }

    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);

    const timeError = validateSessionTime(ld, durNum);
    if (timeError) {
      setEditErrorMessage(timeError);
      return;
    }
    if (isOverlap(ld, durNum, id)) {
      setEditErrorMessage('Час перекривається з іншими сеансами');
      return;
    }

    const payload: any = {
      startTime: ld.toISOString(),
      duration: durNum,
      notes: notes.trim() || null,
      price: priceNum,
      id,
    };
    if (clientId) payload.clientId = clientId;
    else payload.client = client.trim();

    setLoadingSaveId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditErrorMessage(json.error || 'Не вдалося зберегти');
      } else {
        await mutate();
        cancelEdit();
      }
    } catch {
      setEditErrorMessage('Не вдалося зберегти');
    } finally {
      setLoadingSaveId(null);
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Видалити сеанс?')) return;
    setLoadingDeleteId(id);
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    await mutate();
    setLoadingDeleteId(null);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scaleStart = 8;
  const scaleDuration = 13.5;

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    list.forEach(a => {
      const key = a.clientRel?.name ?? a.client;
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
      }
      map[key] = `hsl(${Math.abs(hash) % 360},65%,55%)`;
    });
    return map;
  }, [list]);

  return (
    <>
      <NewAppointmentForm todayStr={todayStr} onCreated={mutate} />

      <div className={styles.datePickerRow}>
        <label htmlFor="dayPicker">Дата:</label>
        <input
          id="dayPicker"
          type="date"
          value={date}
          onChange={e => {
            setDate(e.target.value);
            router.push(`/admin/appointments?date=${e.target.value}`);
          }}
        />
      </div>

      <AppointmentTimeline
        list={list}
        scaleStart={scaleStart}
        scaleDuration={scaleDuration}
        colorMap={colorMap}
        timelineRef={timelineRef}
        activeTooltipId={null}
        toggleTooltip={() => {}}
        kyivFormatter={
          new Intl.DateTimeFormat('uk-UA', {
            timeZone: 'Europe/Kyiv',
            hour: '2-digit',
            minute: '2-digit',
          })
        }
      />

      <AppointmentTable
        list={list}
        isLoading={isLoading}
        todayStr={todayStr}
        kyivFormatter={
          new Intl.DateTimeFormat('uk-UA', {
            timeZone: 'Europe/Kyiv',
            hour: '2-digit',
            minute: '2-digit',
          })
        }
        editingId={editingId}
        editForm={editForm}
        setEditForm={setEditForm}
        loadingAdd={false}
        loadingSaveId={loadingSaveId}
        loadingDeleteId={loadingDeleteId}
        startEdit={startEdit}
        cancelEdit={cancelEdit}
        saveEdit={saveEdit}
        deleteItem={deleteItem}
        errorFields={editFormErrors}
        errorMessage={editErrorMessage}
      />
    </>
  );
}
