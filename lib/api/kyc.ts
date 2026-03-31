import { apiClient } from './client';

export const verifyCac = async (rcNumber: string): Promise<{ message: string; tier: number }> => {
  const response = await apiClient.post('/kyc/verify/cac', { rcNumber });
  return response.data.data;
};
