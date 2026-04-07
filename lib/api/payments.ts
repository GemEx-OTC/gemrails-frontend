import apiClient from './client';
import axios from 'axios';
import type {
  ApiResponse,
  ExchangeRate,
  MerchantInfo,
  InitiatePaymentInput,
  InitiatePaymentResponse,
  PaymentStatus,
  ConfirmPaymentInput,
} from './types';

const OTC_API_BASE_URL = process.env.NEXT_PUBLIC_GEMEX_OTC_API_BASE_URL || 'http://localhost:4000';

// Get exchange rate from gemrails-api (includes bufferAmount and minimumPayment)
export const getExchangeRate = async (): Promise<ExchangeRate> => {
  const response = await apiClient.get<ApiResponse<ExchangeRate>>('/payments/rate');
  return response.data.data;
};

// Get merchant info
export const getMerchantInfo = async (merchantId: string): Promise<MerchantInfo> => {
  const response = await apiClient.get<ApiResponse<MerchantInfo>>(`/payments/merchant/${merchantId}`);
  return response.data.data;
};

// Initiate payment
export const initiatePayment = async (data: InitiatePaymentInput): Promise<InitiatePaymentResponse> => {
  const response = await apiClient.post<ApiResponse<InitiatePaymentResponse>>('/payments/initiate', data);
  return response.data.data;
};

// Get payment status
export const getPaymentStatus = async (transactionId: string): Promise<PaymentStatus> => {
  const response = await apiClient.get<ApiResponse<PaymentStatus>>(`/payments/status/${transactionId}`);
  return response.data.data;
};

// Confirm payment
export const confirmPayment = async (data: ConfirmPaymentInput): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/payments/confirm', data);
  return response.data.data;
};
