import { ReactNode } from 'react';
import { UserRole } from '../types';
import { getCurrentUser, hasRole, canAccessResource } from '../utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requireOwnership?: boolean;
  resourceUserId?: string;
  resourceAdvisorId?: string;
  assignedCommitteeIds?: string[];
  fallback?: ReactNode;
}

/**
 * Protected Route Component
 * ตรวจสอบสิทธิ์การเข้าถึงก่อนแสดงเนื้อหา
 */
export function ProtectedRoute({
  children,
  requiredRoles,
  requireOwnership = false,
  resourceUserId,
  resourceAdvisorId,
  assignedCommitteeIds,
  fallback,
}: ProtectedRouteProps) {
  const currentUser = getCurrentUser();

  // Check if user is authenticated
  if (!currentUser) {
    // Redirect to login - in a real app, use react-router Navigate
    window.location.href = '/login';
    return null;
  }

  // Check role-based access
  if (requiredRoles && !hasRole(currentUser.role, requiredRoles)) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
            <p className="text-gray-600">
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
            </p>
          </div>
        </div>
      )
    );
  }

  // Check resource ownership/access
  if (requireOwnership) {
    const hasAccess = canAccessResource(
      currentUser.role,
      currentUser.userId,
      resourceUserId,
      resourceAdvisorId,
      assignedCommitteeIds
    );

    if (!hasAccess) {
      return (
        fallback || (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีสิทธิ์เข้าถึง</h1>
              <p className="text-gray-600">
                คุณสามารถเข้าถึงได้เฉพาะข้อมูลของตัวเองเท่านั้น
              </p>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
}

/**
 * Role-based component wrapper
 */
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const currentUser = getCurrentUser();

  if (!currentUser || !hasRole(currentUser.role, allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

