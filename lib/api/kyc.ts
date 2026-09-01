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

export const getSmileIdToken = async (product: string = 'document_verification'): Promise<{
  token: string;
  partner_id: string;
  job_id: string;
  user_id: string;
  callback_url: string;
  environment: 'sandbox' | 'production';
}> => {
  const response = await apiClient.post('/kyc/smile-token', { product });
  return response.data.data;
};

export const recordKycSubmitted = async (): Promise<{ success: boolean; message: string; kycSubmittedAt: string; kycStatus: string }> => {
  const response = await apiClient.post('/kyc/submitted');
  return response.data.data;
};
