import apiClient from './client';
import type {
  ApiResponse,
  DashboardData,
  Transaction,
  TransactionsParams,
  TransactionsResponse,
} from './types';

// Get dashboard stats
export const getDashboard = async (): Promise<DashboardData> => {
  const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
  return response.data.data;
};

// Get transactions
export const getTransactions = async (params?: TransactionsParams): Promise<TransactionsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  
  const queryString = searchParams.toString();
  const response = await apiClient.get<ApiResponse<TransactionsResponse>>(
    `/dashboard/transactions${queryString ? `?${queryString}` : ''}`
  );
  return response.data.data;
};

// Get single transaction
export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await apiClient.get<ApiResponse<Transaction>>(`/dashboard/transactions/${id}`);
  return response.data.data;
};
