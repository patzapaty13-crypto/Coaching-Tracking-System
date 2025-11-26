/**
 * Audit Logging Utilities
 * บันทึกการกระทำสำคัญของระบบ
 */

export type AuditAction =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'profile_update'
  | 'student_create'
  | 'student_update'
  | 'student_delete'
  | 'coaching_session_create'
  | 'coaching_session_update'
  | 'coaching_session_delete'
  | 'evaluation_create'
  | 'evaluation_update'
  | 'file_upload'
  | 'file_delete'
  | 'permission_change'
  | 'role_change';

export interface AuditLog {
  id: string;
  userId: string;
  userRole: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  success: boolean;
}

/**
 * Store audit log (client-side)
 * หมายเหตุ: ใน production ควรส่งไปยัง backend API
 */
const auditLogs: AuditLog[] = [];

export function logAuditEvent(
  userId: string,
  userRole: string,
  action: AuditAction,
  options?: {
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    success?: boolean;
  }
): void {
  const log: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userRole,
    action,
    resourceType: options?.resourceType,
    resourceId: options?.resourceId,
    details: options?.details,
    ipAddress: 'client-side', // Should come from backend
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    success: options?.success ?? true,
  };

  auditLogs.push(log);
  
  // In production, send to backend API
  // await fetch('/api/audit', { method: 'POST', body: JSON.stringify(log) });
  
  // Also store in localStorage for demo purposes
  const storedLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
  storedLogs.push(log);
  // Keep only last 100 logs
  const recentLogs = storedLogs.slice(-100);
  localStorage.setItem('audit_logs', JSON.stringify(recentLogs));
  
  console.log('[Audit]', log);
}

/**
 * Get audit logs
 */
export function getAuditLogs(limit = 50): AuditLog[] {
  const storedLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');
  return storedLogs.slice(-limit).reverse();
}

/**
 * Get audit logs by user
 */
export function getAuditLogsByUser(userId: string, limit = 50): AuditLog[] {
  const allLogs = getAuditLogs(1000);
  return allLogs.filter((log) => log.userId === userId).slice(0, limit);
}

/**
 * Get audit logs by action
 */
export function getAuditLogsByAction(action: AuditAction, limit = 50): AuditLog[] {
  const allLogs = getAuditLogs(1000);
  return allLogs.filter((log) => log.action === action).slice(0, limit);
}

