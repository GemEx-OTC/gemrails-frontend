import { apiClient } from './client';

export interface Branch {
  _id: string;
  name: string;
  address: string;
  enterpriseId: string;
  createdAt: string;
}

export interface Terminal {
  _id: string;
  name: string;
  branchId: any; // populated branch info
  enterpriseId: string;
  merchantId: string;
  bankAccount: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Moderator {
  _id: string;
  email: string;
  branchId?: {
    _id: string;
    name: string;
  };
  status?: string;
}

export const enterpriseApi = {
  getBranches: async () => {
    const response = await apiClient.get('/enterprise/branches');
    return response.data.data as Branch[];
  },
  
  createBranch: async (data: { name: string; address: string; moderatorEmail: string; moderatorFullName: string }) => {
    const response = await apiClient.post('/enterprise/branches', data);
    return response.data.data as Branch;
  },

  inviteModerator: async (data: { branchId: string; email: string; fullName?: string }) => {
    const response = await apiClient.post('/enterprise/invite-moderator', data);
    return response.data;
  },

  setupModerator: async (data: { token: string; password: any }) => {
    const response = await apiClient.post('/enterprise/setup-moderator', data);
    return response.data;
  },
  
  getTerminals: async (branchId?: string) => {
    const response = await apiClient.get('/enterprise/terminals', {
      params: { branchId }
    });
    return response.data.data as Terminal[];
  },
  
  createTerminal: async (data: { 
    branchId: string; 
    name: string; 
    merchantId: string; 
    bankAccount: any;
  }) => {
    const response = await apiClient.post('/enterprise/terminals', data);
    return response.data.data as Terminal;
  },

  updateTerminal: async (id: string, data: any) => {
    const response = await apiClient.put(`/enterprise/terminals/${id}`, data);
    return response.data.data as Terminal;
  },
  
  toggleTerminal: async (id: string, isActive: boolean) => {
    const response = await apiClient.patch(`/enterprise/terminals/${id}/status`, { isActive });
    return response.data.data as Terminal;
  },

  updateBranch: async ({ id, data }: { id: string; data: any }) => {
    const response = await apiClient.patch(`/enterprise/branches/${id}`, data);
    return response.data.data as Branch;
  },

  deleteBranch: async (id: string) => {
    const response = await apiClient.delete(`/enterprise/branches/${id}`);
    return response.data;
  },

  getModerators: async () => {
    const response = await apiClient.get('/enterprise/moderators');
    return response.data.data as Moderator[];
  },

  deleteModerator: async (id: string) => {
    const response = await apiClient.delete(`/enterprise/moderators/${id}`);
    return response.data;
  },

  getBanks: async () => {
    const response = await apiClient.get('/enterprise/banks');
    return response.data.data as Array<{ code: string; name: string }>;
  },

  verifyAccount: async (data: { accountNumber: string; bankCode: string }) => {
    const response = await apiClient.post('/enterprise/verify-account', data);
    return response.data.data as { accountName: string; accountNumber: string; bankCode: string };
  }
};
