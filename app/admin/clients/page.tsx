// app/admin/clients/page.tsx

import { requireAdmin } from '@lib/auth';
import ClientsManager from '@components/clients-list/ClientsManager';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return <ClientsManager />;
}
