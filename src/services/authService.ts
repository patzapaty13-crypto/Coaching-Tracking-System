/**
 * Authentication Service
 * จัดการการ login และ authentication
 */

import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { storeTokens } from '../utils/auth';
import { logAuditEvent } from '../utils/audit';

// Demo passwords for each user (ใน production ต้องใช้ backend)
const DEMO_PASSWORDS: Record<string, string> = {
  'somchai@student.spu.ac.th': 'Student123!@#',
  'somying@student.spu.ac.th': 'Student123!@#',
  'prayuth@student.spu.ac.th': 'Student123!@#',
  'wichai@spu.ac.th': 'Advisor123!@#',
  'suda@spu.ac.th': 'Advisor123!@#',
  'admin@spu.ac.th': 'Admin123!@#',
  'external@company.com': 'Committee123!@#',
};

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find user by email
  const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    logAuditEvent('', 'guest', 'login_failed', {
      success: false,
      details: { email, error: 'User not found' },
    });
    return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  }

  // Check password (demo mode - ใน production ต้องใช้ backend)
  const correctPassword = DEMO_PASSWORDS[user.email.toLowerCase()];
  if (!correctPassword || password !== correctPassword) {
    logAuditEvent(user.id, user.role, 'login_failed', {
      success: false,
      details: { email, error: 'Invalid password' },
    });
    return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  }

  // Create mock tokens
  const tokens = {
    accessToken: `mock_token_${user.id}_${Date.now()}`,
    refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  };

  // Store tokens
  storeTokens(tokens);

  // Log successful login
  logAuditEvent(user.id, user.role, 'login', {
    success: true,
    details: { email },
  });

  return { success: true, user };
}

/**
 * Get user info from stored token
 */
export function getCurrentUserFromStorage(): User | null {
  const storedUser = localStorage.getItem('current_user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

/**
 * Store user in localStorage (for demo)
 */
export function storeUser(user: User): void {
  localStorage.setItem('current_user', JSON.stringify(user));
}

/**
 * Clear user data
 */
export function clearUser(): void {
  localStorage.removeItem('current_user');
}

