import apiClient from './client';
import type {
  ApiResponse,
  NotificationsParams,
  NotificationsResponse,
} from './types';

// Get notifications
export const getNotifications = async (params?: NotificationsParams): Promise<NotificationsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.filter) searchParams.append('filter', params.filter);
  
  const queryString = searchParams.toString();
  const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
    `/notifications${queryString ? `?${queryString}` : ''}`
  );
  return response.data.data;
};

// Get unread count
export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
  return response.data.data;
};

// Mark notification as read
export const markAsRead = async (id: string): Promise<void> => {
  await apiClient.post(`/notifications/${id}/read`);
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<void> => {
  await apiClient.post('/notifications/read-all');
};
