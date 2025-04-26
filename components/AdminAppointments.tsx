'use client';

import { useMemo, useRef, useState } from 'react';
import { useAppointments } from '@lib/useAppointments';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import AppointmentTable from './AdminAppointments/AppointmentTable';
import NewAppointmentForm from './AdminAppointments/NewAppointmentForm';
import AppointmentTimeline from './AdminAppointments/AppointmentTimeline';

export default function AdminAppointments() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // если в URL есть ?date=YYYY-MM-DD — берем его, иначе today
  const initialDate = searchParams.get('date') || new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(initialDate);
  const { data: list, mutate } = useAppointments(date);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    duration: '',
    client: '',
    notes: '',
    price: '',
    clientId: '', // важное добавление
  });

  const [editFormErrors, setEditFormErrors] = useState<Record<string, boolean>>({});
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [loadingSaveId, setLoadingSaveId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);
  const [errorEditId, setErrorEditId] = useState<number | null>(null);

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
    setErrorEditId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFormErrors({});
    setEditErrorMessage(null);
    setErrorEditId(null);
  };

  const isOverlap = (start: Date, duration: number, excludeId?: number): boolean => {
    const end = new Date(start.getTime() + duration * 60000);
    return list.some(a => {
      if (a.id === excludeId) return false;
      const aStart = new Date(a.startTime);
      const aEnd = new Date(aStart.getTime() + a.duration * 60000);
      return start < aEnd && end > aStart;
    });
  };

  async function saveEdit(id: number) {
    setEditFormErrors({});
    setEditErrorMessage(null);
    setErrorEditId(null);

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
      setErrorEditId(id);
      return;
    }

    const [Y, M, D] = d.split('-').map(Number);
    const [h, m] = time.split(':').map(Number);
    const ld = new Date(Y, M - 1, D, h, m);

    if (isOverlap(ld, durNum, id)) {
      setEditErrorMessage('Час перекривається з іншими сеансами');
      setErrorEditId(id);
      return;
    }

    const payload: any = {
      startTime: ld.toISOString(),
      duration: durNum,
      notes: notes.trim() || null,
      price: priceNum,
      id,
    };

    if (clientId) {
      payload.clientId = clientId;
    } else {
      payload.client = client.trim();
    }

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
        setErrorEditId(id);
      } else {
        await mutate();
        cancelEdit();
      }
    } catch {
      setEditErrorMessage('Не вдалося зберегти');
      setErrorEditId(id);
    } finally {
      setLoadingSaveId(null);
    }
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Видалити сеанс?')) return;
    setLoadingDeleteId(id);
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      await mutate();
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const timelineRef = useRef<HTMLDivElement>(null);
  const scaleStart = 8;
  const scaleDuration = 13.5; // до 21:30

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    list.forEach(a => {
      const key = a.clientRel?.name ?? a.client;
      map[key] = stringToHSLColor(key);
    });
    return map;
  }, [list]);

  const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

  function stringToHSLColor(str: string, saturation = 65, lightness = 55): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  return (
    <>
      <NewAppointmentForm todayStr={todayStr} onCreated={mutate} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
      >
        <label htmlFor="dayPicker" style={{ fontWeight: 500 }}>
          Дата:
        </label>
        <input
          id="dayPicker"
          type="date"
          value={date}
          onChange={e => {
            const newDate = e.target.value;
            setDate(newDate);
            // подтягиваем URL — необязательно, но удобно для "поделиться"
            router.push(`/admin/appointments?date=${newDate}`);
          }}
          style={{
            padding: '6px 10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <AppointmentTimeline
        list={list}
        scaleStart={scaleStart}
        scaleDuration={scaleDuration}
        colorMap={colorMap}
        timelineRef={timelineRef}
        activeTooltipId={activeTooltipId}
        toggleTooltip={setActiveTooltipId}
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
