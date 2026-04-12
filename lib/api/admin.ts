import apiClient from './client';
import type {
  ApiResponse,
  AdminMerchant,
  AdminMerchantsResponse,
  AdminMerchantDetails,
  AdminTransaction,
  AdminTransactionsResponse,
  AuditLog,
  AuditLogsResponse,
  Broadcast,
  PlatformSettings,
  BroadcastInput,
  BroadcastResponse,
  AdminDashboard,
  LiquidityBalance,
  LiquidityDisbursementsResponse,
} from './types';

// Dashboard
export const getDashboard = async (): Promise<AdminDashboard> => {
  const response = await apiClient.get<ApiResponse<AdminDashboard>>('/admin/dashboard');
  return response.data.data;
};

// Merchants
export const getMerchants = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminMerchantsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  const response = await apiClient.get<ApiResponse<AdminMerchantsResponse>>(
    `/admin/merchants${query ? `?${query}` : ''}`
  );
  return response.data.data;
};

export const getMerchantById = async (id: string): Promise<AdminMerchantDetails> => {
  const response = await apiClient.get<ApiResponse<AdminMerchantDetails>>(`/admin/merchants/${id}`);
  return response.data.data;
};

export const verifyMerchant = async (merchantId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/admin/merchants/verify', { merchantId });
  return response.data.data;
};

export const suspendMerchant = async (merchantId: string, reason: string): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/admin/merchants/suspend', { merchantId, reason });
  return response.data.data;
};

export const reactivateMerchant = async (merchantId: string): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/admin/merchants/reactivate', { merchantId });
  return response.data.data;
};

// Transactions
export const getTransactions = async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminTransactionsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  const response = await apiClient.get<ApiResponse<AdminTransactionsResponse>>(
    `/admin/transactions${query ? `?${query}` : ''}`
  );
  return response.data.data;
};

// Audit Logs
export const getAuditLogs = async (params?: {
  severity?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AuditLogsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.severity) searchParams.append('severity', params.severity);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  const response = await apiClient.get<ApiResponse<AuditLogsResponse>>(
    `/admin/audit${query ? `?${query}` : ''}`
  );
  return response.data.data;
};

// Broadcasts
export const sendBroadcast = async (data: BroadcastInput): Promise<BroadcastResponse> => {
  const response = await apiClient.post<ApiResponse<BroadcastResponse>>('/admin/broadcast', data);
  return response.data.data;
};

export const getBroadcasts = async (limit?: number): Promise<Broadcast[]> => {
  const response = await apiClient.get<ApiResponse<Broadcast[]>>(
    `/admin/broadcasts${limit ? `?limit=${limit}` : ''}`
  );
  return response.data.data;
};

// Settings
export const getSettings = async (): Promise<PlatformSettings> => {
  const response = await apiClient.get<ApiResponse<PlatformSettings>>('/admin/settings');
  return response.data.data;
};

export const updateSettings = async (data: Partial<PlatformSettings>): Promise<PlatformSettings> => {
  const response = await apiClient.put<ApiResponse<PlatformSettings>>('/admin/settings', data);
  return response.data.data;
};

// Liquidity
export const getLiquidityBalance = async (): Promise<LiquidityBalance> => {
  const response = await apiClient.get<ApiResponse<LiquidityBalance>>('/admin/liquidity/balance');
  return response.data.data;
};

export const getLiquidityDisbursements = async (params?: {
  page?: number;
  limit?: number;
}): Promise<LiquidityDisbursementsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  const query = searchParams.toString();
  const response = await apiClient.get<ApiResponse<LiquidityDisbursementsResponse>>(
    `/admin/liquidity/disbursements${query ? `?${query}` : ''}`
  );
  return response.data.data;
};

// Support Management
export const toggleTerminalStatus = async (terminalId: string, isActive: boolean): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>('/admin/terminals/toggle-status', { terminalId, isActive });
  return response.data.data;
};

export const updateBranch = async (branchId: string, data: { name?: string; address?: string }): Promise<any> => {
  const response = await apiClient.patch<ApiResponse<any>>('/admin/branches/update', { branchId, ...data });
  return response.data.data;
};

// Sweep
export const getSweepStats = async (): Promise<any> => {
  const response = await apiClient.get<ApiResponse<any>>('/admin/sweep/stats');
  return response.data.data;
};

export const triggerSweep = async (network?: string): Promise<any> => {
  const response = await apiClient.post<ApiResponse<any>>('/admin/sweep/trigger', { network });
  return response.data.data;
};

export const getSweepHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<any> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  const query = searchParams.toString();
  const response = await apiClient.get<ApiResponse<any>>(
    `/admin/sweep/history${query ? `?${query}` : ''}`
  );
  return response.data.data;
};
