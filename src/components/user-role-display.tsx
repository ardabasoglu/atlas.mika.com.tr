'use client';

import { useSession } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';

export function UserRoleDisplay() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Badge variant="outline">Yükleniyor...</Badge>;
  }

  if (!session?.user) {
    return <Badge variant="outline">Misafir</Badge>;
  }

  const userRole = session.user.role || 'GUEST';

  const roleInfo: Record<string, string> = {
    SYSTEM_ADMIN: 'Sistem Yöneticisi',
    ADMIN: 'Yönetici',
    MEMBER: 'Üye',
    GUEST: 'Misafir',
  };

  const label = roleInfo[userRole] ?? roleInfo.GUEST;

  return <Badge variant="outline">{label}</Badge>;
}