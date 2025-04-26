// app/admin/layout.tsx

import AdminMenu from '@components/AdminMenu';
import { getServerSession } from 'next-auth';
import authConfig from '../api/auth/[...nextauth]/auth.config';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminMenu />
      <main style={{ flex: 1, margin: 5 }}>{children}</main>
    </div>
  );
}
