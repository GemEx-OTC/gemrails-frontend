import apiClient, { setTokens, clearTokens } from './client';
import type {
  ApiResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  VerifyEmailInput,
  VerifyEmailResponse,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
  UpdateBankAccountInput,
  UpdateSettingsInput,
  ChangePasswordInput,
  User,
} from './types';

// Register a new merchant
export const register = async (data: RegisterInput): Promise<RegisterResponse> => {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
  return response.data.data;
};

// Verify email with OTP
export const verifyEmail = async (data: VerifyEmailInput): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>('/auth/verify-email', data);
  const { tokens } = response.data.data;
  setTokens(tokens.accessToken, tokens.refreshToken);
  return response.data.data;
};

// Resend OTP
export const resendOtp = async (data: ResendOtpInput): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-otp', data);
  return response.data.data;
};

// Login merchant
export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
  const { tokens } = response.data.data;
  setTokens(tokens.accessToken, tokens.refreshToken);
  return response.data.data;
};

// Admin login
export const adminLogin = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/admin/login', data);
  const { tokens } = response.data.data;
  setTokens(tokens.accessToken, tokens.refreshToken);
  return response.data.data;
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    clearTokens();
  }
};

// Forgot password
export const forgotPassword = async (data: ForgotPasswordInput): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data);
  return response.data.data;
};

// Reset password
export const resetPassword = async (data: ResetPasswordInput): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data);
  return response.data.data;
};

// Get profile
export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
  return response.data.data;
};

// Update profile
export const updateProfile = async (data: UpdateProfileInput): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
  return response.data.data;
};

// Update bank account
export const updateBankAccount = async (data: UpdateBankAccountInput): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/auth/bank-account', data);
  return response.data.data;
};

// Update settings
export const updateSettings = async (data: UpdateSettingsInput): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/auth/settings', data);
  return response.data.data;
};

// Change password
export const changePassword = async (data: ChangePasswordInput): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', data);
  return response.data.data;
};

// Upload logo
export const uploadLogo = async (formData: FormData): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>('/auth/upload-logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

// Delete logo
export const deleteLogo = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>('/auth/logo');
  return response.data.data;
};
