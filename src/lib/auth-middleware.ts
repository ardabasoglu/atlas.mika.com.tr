import { auth } from '@/lib/auth';

export type Role = 'SYSTEM_ADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';

interface RequireAuthOptions {
  roles?: Role[];
  redirectTo?: string;
}

/**
 * Higher-order function that creates an authentication and authorization middleware
 */
export function requireAuth(options: RequireAuthOptions = {}) {
  return async function handler(request: Request) {
    // Extract the session from the request
    const session = await auth.api.getSession({
      headers: new Headers(request.headers),
    });
    
    // If no session exists, redirect to login
    if (!session) {
      const redirectTo = options.redirectTo || '/login';
      return Response.redirect(new URL(redirectTo, request.url));
    }

    // If specific roles are required, check if the user has one of them
    if (options.roles && !options.roles.includes(session.user.role as Role)) {
      // Return 403 Forbidden if user doesn't have required role
      return new Response('Forbidden: Insufficient permissions', { status: 403 });
    }

    // Return null to continue with the request
    return null;
  };
}

/**
 * Check if a user has a specific role
 */
export function hasRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some(role => userRole === role);
}

/**
 * Role-based authorization utilities
 */
export const RoleGuard = {
  /**
   * Check if user is a system admin
   */
  isSystemAdmin: (role: Role): boolean => role === 'SYSTEM_ADMIN',
  
  /**
   * Check if user is an admin (system admin or admin)
   */
  isAdmin: (role: Role): boolean => role === 'SYSTEM_ADMIN' || role === 'ADMIN',
  
  /**
   * Check if user is a member (any role except guest)
   */
  isMember: (role: Role): boolean => role !== 'GUEST',
  
  /**
   * Check if user is a guest
   */
  isGuest: (role: Role): boolean => role === 'GUEST',
};