// app/admin/notes/page.tsx

import { getServerSession } from 'next-auth';
import { authConfig } from '../../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

import NotesPanel from '@components/notes/NotesPanel';
import adminStyles from '@components/AdminAppointments.module.css';
import notesStyles from '@components/notes/Notes.module.css';
import BackButton from '@components/BackButton';

export const dynamic = 'force-dynamic';

export default async function NotesPage() {
  // Проверяем сессию на сервере
  const session = await getServerSession(authConfig);
  // Если пользователь не авторизован — перенаправляем на страницу входа
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Иначе рендерим защищённый UI
  return (
    <div className={`${adminStyles.container} ${notesStyles.notesContainer}`}>
      <BackButton />
      <h1 className={adminStyles.title}>Нотатки</h1>
      <NotesPanel />
      <BackButton />
    </div>
  );
}
