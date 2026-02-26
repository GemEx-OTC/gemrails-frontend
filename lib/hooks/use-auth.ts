'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import { clearTokens, getTokens } from '@/lib/api/client';
import type {
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  UpdateBankAccountInput,
  UpdateSettingsInput,
  ChangePasswordInput,
} from '@/lib/api/types';

// Login mutation
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      // Set user data directly in cache to avoid race condition
      queryClient.setQueryData(['profile'], data.user);
      
      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    },
  });
};

// Admin login mutation
export const useAdminLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.adminLogin(data),
    onSuccess: (data) => {
      // Set user data directly in cache to avoid race condition
      queryClient.setQueryData(['profile'], data.user);
      router.push('/admin/dashboard');
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
  });
};

// Verify email mutation
export const useVerifyEmail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyEmailInput) => authApi.verifyEmail(data),
    onSuccess: (data) => {
      // Set user data directly in cache to avoid race condition
      queryClient.setQueryData(['profile'], data.user);
      router.push('/dashboard');
    },
  });
};

// Resend OTP mutation
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: ResendOtpInput) => authApi.resendOtp(data),
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => authApi.forgotPassword(data),
  });
};

// Reset password mutation
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordInput) => authApi.resetPassword(data),
    onSuccess: () => {
      router.push('/auth/login');
    },
  });
};

// Profile query
export const useProfile = () => {
  const { accessToken } = getTokens();

  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Update bank account mutation
export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBankAccountInput) => authApi.updateBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Update settings mutation
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsInput) => authApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
  });
};

// Upload logo mutation
export const useUploadLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => authApi.uploadLogo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Delete logo mutation
export const useDeleteLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.deleteLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Get banks query
export const useBanks = () => {
  const { accessToken } = getTokens();

  return useQuery({
    queryKey: ['banks'],
    queryFn: authApi.getBanks,
    enabled: !!accessToken,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// Verify bank account mutation
export const useVerifyBankAccount = () => {
  return useMutation({
    mutationFn: (data: { bankCode: string; accountNumber: string }) => authApi.verifyBankAccount(data),
  });
};

// Send bank change OTP mutation
export const useSendBankOtp = () => {
  return useMutation({
    mutationFn: () => authApi.sendBankOtp(),
  });
};

// Logout mutation
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      router.push('/auth/login');
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearTokens();
      queryClient.clear();
      router.push('/auth/login');
    },
  });
};
