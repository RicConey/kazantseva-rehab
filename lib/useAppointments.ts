// lib/useAppointments.ts

import useSWR from 'swr';

export function useAppointments(date: string) {
  const { data, error, mutate } = useSWR(`/api/appointments?date=${date}`, url =>
    fetch(url).then(res => res.json())
  );

  return {
    data: data || [],
    error,
    mutate, // функция для обновления
  };
}
