'use client';

import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '@/lib/api/dashboard';
import type { TransactionsParams } from '@/lib/api/types';

// Dashboard stats query
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Transactions query
export const useTransactions = (params?: TransactionsParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => dashboardApi.getTransactions(params),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Single transaction query
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => dashboardApi.getTransaction(id),
    enabled: !!id,
  });
};
