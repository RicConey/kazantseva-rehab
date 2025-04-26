// utils/appointmentValidation.ts

/**
 * Перевіряє, що сеанс починається не раніше 08:00 і закінчується не пізніше 21:30 того ж дня.
 * @param start - обʼєкт Date початку
 * @param duration - тривалість в хвилинах
 * @returns null, якщо все ОК, або рядок з помилкою
 */
export function validateSessionTime(start: Date, duration: number): string | null {
  const hour = start.getHours();
  const minute = start.getMinutes();
  // раніше 08:00
  if (hour < 8) {
    return 'Сеанс не може починатися раніше 08:00.';
  }

  const end = new Date(start.getTime() + duration * 60000);
  const endHour = end.getHours();
  const endMinute = end.getMinutes();
  // пізніше 21:30
  if (endHour > 21 || (endHour === 21 && endMinute > 30)) {
    return 'Сеанс повинен закінчуватися не пізніше 21:30.';
  }

  return null;
}
