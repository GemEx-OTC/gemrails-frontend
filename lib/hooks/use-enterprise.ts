import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enterpriseApi } from '../api/enterprise';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: enterpriseApi.getBranches,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enterpriseApi.createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useTerminals = (branchId?: string) => {
  return useQuery({
    queryKey: ['terminals', branchId],
    queryFn: () => enterpriseApi.getTerminals(branchId),
  });
};

export const useCreateTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enterpriseApi.createTerminal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
  });
};

export const useToggleTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      enterpriseApi.toggleTerminal(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
  });
};

export const useUpdateTerminal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      enterpriseApi.updateTerminal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enterpriseApi.updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enterpriseApi.deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['terminals'] });
    },
  });
};

export const useModerators = () => {
  return useQuery({
    queryKey: ['moderators'],
    queryFn: enterpriseApi.getModerators,
  });
};

export const useDeleteModerator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enterpriseApi.deleteModerator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderators'] });
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
};

export const useBanks = () => {
  return useQuery({
    queryKey: ['banks'],
    queryFn: enterpriseApi.getBanks,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: enterpriseApi.verifyAccount,
  });
};
