'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as kycApi from '@/lib/api/kyc';

export const useVerifyCac = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => kycApi.verifyCac(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
