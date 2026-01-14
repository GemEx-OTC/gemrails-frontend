// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  data?: Record<string, any>;
}

// User Types
export interface BankAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isVerified: boolean;
}

export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface User {
  id: string;
  email: string;
  emailVerified?: boolean;
  role?: 'merchant' | 'admin';
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  businessLogo?: string;
  contactName?: string;
  phone?: string;
  rcNumber?: string;
  merchantStatus?: 'pending' | 'active' | 'suspended';
  merchantId?: string;
  bankAccount?: BankAccount;
  settings?: UserSettings;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterInput {
  email: string;
  password: string;
  businessName: string;
  contactName: string;
  phone?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ResendOtpInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  contactName?: string;
  phone?: string;
  rcNumber?: string;
}

export interface UpdateBankAccountInput {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface UpdateSettingsInput {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// Dashboard Types
export interface DashboardStats {
  totalTransactions: number;
  totalVolume: number;
  pendingTransactions: number;
  completedTransactions: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  merchantId: string;
  amount: number;
  currency: string;
  nairaAmount: number;
  rate: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  payerEmail?: string;
  payerName?: string;
  reference?: string;
  walletAddress?: string;
  txHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  channels: {
    inApp?: {
      sent: boolean;
      readAt?: string;
    };
  };
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  filter?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Payment Types
export interface ExchangeRate {
  USDT: number;
  USDC: number;
  lastUpdated: string;
}

export interface MerchantInfo {
  merchantId: string;
  businessName: string;
  businessLogo?: string;
  isActive: boolean;
}

export interface InitiatePaymentInput {
  merchantId: string;
  amount: number;
  cryptoAsset: 'USDT' | 'USDC';
  network: 'TRC20' | 'BSC';
  customerRef?: string;
}

export interface InitiatePaymentResponse {
  transactionId: string;
  walletAddress: string;
  amount: number;
  currency: string;
  nairaAmount: number;
  rate: number;
  expiresAt: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  amount: number;
  currency: string;
  nairaAmount: number;
  txHash?: string;
  completedAt?: string;
}

export interface ConfirmPaymentInput {
  transactionId: string;
}


// Admin Types
export interface AdminMerchant {
  id: string;
  businessName: string;
  email: string;
  phone?: string;
  status: 'pending' | 'verified' | 'suspended';
  totalTransactions: number;
  totalVolume: number;
  bankAccount?: BankAccount;
  createdAt: string;
}

export interface AdminMerchantsResponse {
  merchants: AdminMerchant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminMerchantDetails extends AdminMerchant {
  businessCategory?: string;
  businessAddress?: string;
  contactName?: string;
  rcNumber?: string;
  merchantId?: string;
  settings?: UserSettings;
  recentTransactions: AdminTransaction[];
  updatedAt: string;
}

export interface AdminTransaction {
  id: string;
  transactionId: string;
  merchantName: string;
  amount: number;
  cryptoAmount: number;
  cryptoAsset: string;
  network: string;
  incentive: number;
  status: string;
  customerRef?: string;
  timestamp: string;
}

export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  stats: {
    totalVolume: number;
    settledCount: number;
    pendingCount: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorRole?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
  ipAddress?: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  stats: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  priority: string;
  targetRole: string;
  recipientCount: number;
  sentAt: string;
}

export interface BroadcastInput {
  title: string;
  message: string;
  priority: string;
  sendEmail: boolean;
}

export interface BroadcastResponse {
  message: string;
  broadcastId: string;
  recipientCount: number;
}

export interface PlatformSettings {
  autoVerification: boolean;
  emailNotifications: boolean;
  bufferAmount: number;
  platformFee: number;
  merchantIncentive: number;
  minimumPayment: number;
}

// Admin Dashboard Types
export interface AdminDashboard {
  merchants: {
    total: number;
    verified: number;
    pending: number;
    suspended: number;
    newThisWeek: number;
  };
  transactions: {
    total: number;
    totalVolume: number;
    settled: number;
    settledVolume: number;
    pending: number;
    pendingVolume: number;
  };
  recentActivity: {
    id: string;
    action: string;
    details: string;
    severity: string;
    createdAt: string;
  }[];
}
