/**
 * Authentication Utilities
 * จัดการ JWT tokens และ authentication state
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface DecodedToken {
  userId: string;
  role: string;
  email: string;
  exp: number;
  iat: number;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Store tokens in localStorage
 * หมายเหตุ: ใน production ควรใช้ httpOnly cookies แทน
 */
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, tokens.expiresAt.toString());
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear all tokens
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  
  const expiryTime = parseInt(expiry, 10);
  return Date.now() >= expiryTime;
}

/**
 * Decode JWT token (client-side only, for display purposes)
 * หมายเหตุ: การ verify token จริงต้องทำที่ backend
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Get current user from token
 */
export function getCurrentUser(): DecodedToken | null {
  const token = getAccessToken();
  if (!token) return null;
  
  if (isTokenExpired()) {
    clearTokens();
    return null;
  }
  
  return decodeToken(token);
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user can access resource
 * Student: only own data
 * Advisor: only students they supervise
 * Admin: all data
 * Committee: only assigned projects
 */
export function canAccessResource(
  userRole: string,
  userId: string,
  resourceUserId?: string,
  resourceAdvisorId?: string,
  assignedCommitteeIds?: string[]
): boolean {
  switch (userRole) {
    case 'admin':
      return true;
    case 'student':
      return resourceUserId === userId;
    case 'advisor':
      return resourceAdvisorId === userId;
    case 'committee':
      return assignedCommitteeIds?.includes(userId) ?? false;
    default:
      return false;
  }
}

