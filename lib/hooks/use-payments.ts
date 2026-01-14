'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import * as paymentsApi from '@/lib/api/payments';
import type { InitiatePaymentInput, ConfirmPaymentInput } from '@/lib/api/types';

// Exchange rate query
export const useExchangeRate = () => {
  return useQuery({
    queryKey: ['exchange-rate'],
    queryFn: paymentsApi.getExchangeRate,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Merchant info query
export const useMerchantInfo = (merchantId: string) => {
  return useQuery({
    queryKey: ['merchant', merchantId],
    queryFn: () => paymentsApi.getMerchantInfo(merchantId),
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Initiate payment mutation
export const useInitiatePayment = () => {
  return useMutation({
    mutationFn: (data: InitiatePaymentInput) => paymentsApi.initiatePayment(data),
  });
};

// Payment status query
export const usePaymentStatus = (transactionId: string, options?: { enabled?: boolean; refetchInterval?: number }) => {
  return useQuery({
    queryKey: ['payment-status', transactionId],
    queryFn: () => paymentsApi.getPaymentStatus(transactionId),
    enabled: options?.enabled !== false && !!transactionId,
    refetchInterval: options?.refetchInterval ?? 5000, // Poll every 5 seconds by default
  });
};

// Confirm payment mutation
export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: (data: ConfirmPaymentInput) => paymentsApi.confirmPayment(data),
  });
};
