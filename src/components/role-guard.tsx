'use client';

import { useSession } from '@/lib/auth-client';
import { RoleGuard } from '@/lib/auth-middleware';

type Role = 'SYSTEM_ADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export function RoleGuardComponent({ 
  children, 
  allowedRoles, 
  fallback = <div>Access Denied: Insufficient permissions</div> 
}: RoleGuardProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  const userRole = session?.user?.role as Role || 'GUEST';

  const hasAccess = allowedRoles.some(role => userRole === role);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for common role checks
export function SystemAdminGuard({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuardComponent allowedRoles={['SYSTEM_ADMIN']} fallback={fallback}>
      {children}
    </RoleGuardComponent>
  );
}

export function AdminGuard({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuardComponent allowedRoles={['SYSTEM_ADMIN', 'ADMIN']} fallback={fallback}>
      {children}
    </RoleGuardComponent>
  );
}

export function MemberGuard({ children, fallback }: Omit<RoleGuardProps, 'allowedRoles'>) {
  return (
    <RoleGuardComponent allowedRoles={['SYSTEM_ADMIN', 'ADMIN', 'MEMBER']} fallback={fallback}>
      {children}
    </RoleGuardComponent>
  );
}