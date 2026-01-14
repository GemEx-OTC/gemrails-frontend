import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('token');
    refreshToken = localStorage.getItem('refreshToken');
  }
  return { accessToken, refreshToken };
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken: token } = getTokens();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { message?: string; code?: string; name?: string }; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';
      // Don't retry for auth endpoints
      if (url.includes('/auth/login') || url.includes('/auth/admin/login') || url.includes('/auth/refresh-token')) {
        return Promise.reject(transformError(error));
      }
      
      originalRequest._retry = true;
      
      const { refreshToken: refresh } = getTokens();
      if (refresh) {
        try {
          const response = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh-token`, {
            refreshToken: refresh,
          });
          
          const { accessToken: newAccess, refreshToken: newRefresh } = response.data.data;
          setTokens(newAccess, newRefresh);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          }
          return apiClient(originalRequest);
        } catch {
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    
    return Promise.reject(transformError(error));
  }
);

// Transform error to ApiError
function transformError(error: AxiosError<{ error?: { message?: string; code?: string; name?: string }; message?: string }>): ApiError {
  const errorData = error.response?.data?.error;
  let message = errorData?.message || error.response?.data?.message || error.message || 'An error occurred';
  
  // Handle Zod validation errors
  if (errorData?.name === 'ZodError' && errorData?.message) {
    try {
      const zodErrors = JSON.parse(errorData.message);
      if (Array.isArray(zodErrors) && zodErrors.length > 0) {
        message = zodErrors[0].message;
      }
    } catch {
      message = errorData.message;
    }
  }
  
  return {
    message,
    code: errorData?.code,
    statusCode: error.response?.status,
  };
}

export default apiClient;
