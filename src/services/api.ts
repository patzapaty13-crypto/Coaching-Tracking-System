/**
 * API Service
 * จัดการ HTTP requests และ security headers
 */

import { AuthTokens, getAccessToken, getRefreshToken, clearTokens, isTokenExpired } from '../utils/auth';
import { logAuditEvent } from '../utils/audit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Create headers with authentication
 */
function createHeaders(includeAuth = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAccessToken();
    if (token && !isTokenExpired()) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add CSRF token if available
  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || errorData.error || 'An error occurred',
      response.status,
      errorData.code
    );
  }

  const data = await response.json();
  return {
    success: true,
    data: data.data || data,
    message: data.message,
  };
}

/**
 * API request wrapper
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for CSRF protection
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 0, 'NETWORK_ERROR');
  }
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login
   */
  async login(email: string, password: string): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await apiRequest<AuthTokens>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: createHeaders(false), // Don't include auth token for login
      });

      if (response.success && response.data) {
        logAuditEvent('', 'guest', 'login', { success: true });
      }

      return response;
    } catch (error) {
      logAuditEvent('', 'guest', 'login_failed', { 
        success: false,
        details: { email, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      throw error;
    }
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
    }

    return apiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      headers: createHeaders(false),
    });
  },

  /**
   * Logout
   */
  async logout(userId: string, userRole: string): Promise<void> {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
      logAuditEvent(userId, userRole, 'logout', { success: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
    }
  },

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    userRole: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    const response = await apiRequest<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.success) {
      logAuditEvent(userId, userRole, 'password_change', { success: true });
    }

    return response;
  },
};

/**
 * File upload API
 */
export const fileApi = {
  /**
   * Upload evidence file
   */
  async uploadEvidence(
    file: File,
    sessionId: string,
    description?: string
  ): Promise<ApiResponse<{ fileUrl: string; fileId: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);
    if (description) {
      formData.append('description', description);
    }

    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/files/evidence`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    return handleResponse(response);
  },
};

export default apiRequest;

