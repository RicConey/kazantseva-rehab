'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import AdminAppointments from '../../../components/AdminAppointments';

export default function Page() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);
  if (status === 'loading' || !session) return <div>Загрузка...</div>;
  return <AdminAppointments />;
}
