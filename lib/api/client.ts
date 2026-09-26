import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL || 'http://localhost:4000';
const API_PREFIX = '/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for edge middleware authentication cookie
const setSessionCookie = () => {
  if (typeof document !== 'undefined') {
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    document.cookie = `gemrails_session=1; path=/; max-age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`;
  }
};

const clearSessionCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'gemrails_session=; path=/; max-age=0; SameSite=Lax';
  }
};

export const hasSession = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('gemrails_session=1'));
};

// Token management (in-memory only; tokens stored in httpOnly cookies)
let accessToken: string | null = null;

export const setTokens = (access?: string | null, _refresh?: string | null) => {
  accessToken = access || null;
  if (typeof window !== 'undefined') {
    // Proactively purge any legacy localStorage tokens
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setSessionCookie();
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return { accessToken, refreshToken: null };
};

export const clearTokens = () => {
  accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearSessionCookie();
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

// Token refresh mutex & queued requests handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle token refresh with mutex
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { message?: string; code?: string; name?: string }; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 and attempt token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || '';
      // Don't retry for auth endpoints
      if (url.includes('/auth/login') || url.includes('/auth/admin/login') || url.includes('/auth/refresh-token')) {
        return Promise.reject(transformError(error));
      }
      
      if (isRefreshing) {
        // Another request is already refreshing the token, queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(transformError(err));
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      if (!hasSession() && !accessToken) {
        isRefreshing = false;
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(transformError(error));
      }

      try {
        const response = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh-token`, {}, {
          withCredentials: true,
        });
        
        const { accessToken: newAccess, refreshToken: newRefresh } = response.data.data;
        setTokens(newAccess, newRefresh);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        processQueue(null, newAccess);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(transformError(refreshErr as AxiosError<any>));
      } finally {
        isRefreshing = false;
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
