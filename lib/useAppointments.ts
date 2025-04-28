// lib/useAppointments.ts
import useSWR from 'swr';

export function useAppointments(date: string) {
  const { data, error, mutate } = useSWR(`/api/admin/appointments?date=${date}`, url =>
    fetch(url).then(res => res.json())
  );

  return {
    // окончательный список — либо data, либо пустой массив
    appointments: data || [],
    // считаем, что мы в лоадинге, пока data === undefined и нет ошибки
    isLoading: data === undefined && !error,
    error,
    mutate,
  };
}
