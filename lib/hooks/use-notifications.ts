'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as notificationsApi from '@/lib/api/notifications';
import type { NotificationsParams } from '@/lib/api/types';

// Notifications query
export const useNotifications = (params?: NotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Unread count query
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Mark as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mark all as read mutation
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
