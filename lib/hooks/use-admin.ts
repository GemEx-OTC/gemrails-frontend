'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/lib/api/admin';
import type { BroadcastInput, PlatformSettings } from '@/lib/api/types';

// Dashboard
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboard,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Merchants
export const useAdminMerchants = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['admin-merchants', params],
    queryFn: () => adminApi.getMerchants(params),
  });
};

export const useAdminMerchantDetails = (id: string) => {
  return useQuery({
    queryKey: ['admin-merchant', id],
    queryFn: () => adminApi.getMerchantById(id),
    enabled: !!id,
  });
};

export const useVerifyMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantId: string) => adminApi.verifyMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

export const useSuspendMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason: string }) =>
      adminApi.suspendMerchant(merchantId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

export const useReactivateMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (merchantId: string) => adminApi.reactivateMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

export const useUpdateReferralStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ merchantId, status }: { merchantId: string; status: 'active' | 'suspended' }) =>
      adminApi.updateReferralStatus(merchantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchant'] });
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

export const useVerifyMerchantCac = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ merchantId, data }: { merchantId: string; data: FormData }) =>
      adminApi.verifyMerchantCac(merchantId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchant', variables.merchantId] });
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

// Transactions
export const useAdminTransactions = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['admin-transactions', params],
    queryFn: () => adminApi.getTransactions(params),
  });
};

export const useRetryDisbursement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.retryTransactionDisbursement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });
};

// Audit Logs
export const useAuditLogs = (params?: {
  severity?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => adminApi.getAuditLogs(params),
  });
};

// Broadcasts
export const useBroadcasts = (limit?: number) => {
  return useQuery({
    queryKey: ['broadcasts', limit],
    queryFn: () => adminApi.getBroadcasts(limit),
  });
};

export const useSendBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BroadcastInput) => adminApi.sendBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
    },
  });
};

// Settings
export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: adminApi.getSettings,
  });
};

export const useUpdatePlatformSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PlatformSettings>) => adminApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
    },
  });
};

// Support Management
export const useToggleTerminalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ terminalId, isActive }: { terminalId: string; isActive: boolean }) =>
      adminApi.toggleTerminalStatus(terminalId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchant'] });
      queryClient.invalidateQueries({ queryKey: ['admin-merchants'] });
    },
  });
};

export const useUpdateBranchByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ branchId, name, address }: { branchId: string; name?: string; address?: string }) =>
      adminApi.updateBranch(branchId, { name, address }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merchant'] });
    },
  });
};
