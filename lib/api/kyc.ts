import { apiClient } from './client';

export const verifyCac = async (data: FormData): Promise<{ message: string; tier?: number; status: string; jobId: string }> => {
  const response = await apiClient.post('/kyc/verify/cac', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const getKycStatus = async (jobId: string): Promise<{ status: string; message: string; tier?: number }> => {
  const response = await apiClient.get(`/kyc/status/${jobId}`);
  return response.data.data;
};
