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
  phoneVerified?: boolean;
  role?: 'merchant' | 'admin' | 'branch_mod';
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  businessLogo?: string;
  contactName?: string;
  phone?: string;
  rcNumber?: string;
  cacVerified?: boolean;
  cacDocumentUrl?: string;
  kycStatus?: string;
  merchantStatus?: 'pending' | 'active' | 'suspended';
  accountType?: 'merchant' | 'enterprise';
  merchantId?: string;
  branchId?: string;
  enterpriseId?: string;
  bankAccount?: BankAccount;
  settings?: UserSettings;
  tier?: number;
  isBankAdded?: boolean;
  settledVolume?: number;
  tierLimit?: number;
  referralCode?: string;
  referralBalance?: number;
  referralStatus?: 'active' | 'suspended';
  referralBankAccount?: BankAccount;
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
  accountType?: 'merchant' | 'enterprise';
  contactName?: string;
  phone?: string;
  businessCategory?: string;
  businessAddress?: string;
  rcNumber?: string;
  referralCode?: string;
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
  otp?: string;
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
export interface DashboardData {
  user: User;
  stats: {
    totalReceived: number;
    totalIncentives: number;
    totalTransactions: number;
    pendingPayments: number;
    branchCount?: number;
    terminalCount?: number;
  };
  recentTransactions: Transaction[];
  unreadNotifications: number;
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
  payoutAccount?: BankAccount;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
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
  bufferAmount: number;
  minimumPayment: number;
  lastUpdated: string;
}

export interface MerchantInfo {
  merchantId: string;
  businessName: string;
  businessLogo?: string;
  isActive: boolean;
  type?: 'merchant' | 'terminal';
  branchName?: string;
  terminalName?: string;
}

export interface InitiatePaymentInput {
  merchantId: string;
  amount: number;
  cryptoAsset: 'USDT' | 'USDC';
  network: 'TRC20' | 'BSC';
  customerRef?: string;
  customerName?: string;
  customerEmail?: string;
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
  status: 'Initiated' | 'AwaitingCrypto' | 'AwaitingRemainder' | 'CryptoReceived' | 'Processing' | 'Settled' | 'Failed' | 'expired';
  amount: number;
  currency: string;
  nairaAmount: number;
  txHash?: string;
  completedAt?: string;
  // Verification details
  cryptoReceived?: number;
  cryptoRemaining?: number;
  overpaymentAmount?: number;
  verifiedAt?: string;
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
  accountType?: 'merchant' | 'enterprise';
  totalTransactions: number;
  totalVolume: number;
  bankAccount?: BankAccount;
  referralCode?: string;
  referralBalance?: number;
  referralStatus?: 'active' | 'suspended';
  referralBankAccount?: BankAccount;
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
  cacDocumentUrl?: string;
  merchantId?: string;
  settings?: UserSettings;
  recentTransactions: AdminTransaction[];
  branches: {
    id: string;
    name: string;
    address: string;
    moderators?: {
      id: string;
      name: string;
      email: string;
      role: string;
    }[];
    moderatorCount: number;
    createdAt: string;
  }[];
  terminals: {
    id: string;
    name: string;
    merchantId: string;
    isActive: boolean;
    bankAccount?: BankAccount;
    type?: 'merchant' | 'terminal';
    branchName?: string;
    terminalName?: string;
    createdAt: string;
  }[];
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
  totalAmount: number;
  status: string;
  customerRef?: string;
  payoutAccount?: BankAccount;
  riskScore?: number;
  isBadFunds?: boolean;
  amlReportUrl?: string;
  amlStatus?: string;
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
  revenueWalletAddress?: string;
  revenueWalletAddressTron?: string;
  badFundsWalletAddressBsc?: string;
  badFundsWalletAddressTron?: string;
  overflowWalletAddressBsc?: string;
  overflowWalletAddressTron?: string;
  usdtNgnRate: number;
  usdcNgnRate: number;
  sweepThresholdUsd: number;
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

// Liquidity Types
export interface LiquidityBalance {
  availableBalance: number;
  ledgerBalance: number;
  currency: string;
}

export interface Disbursement {
  id: string;
  reference: string;
  sourceReference: string;
  source: "OTC" | "RAILS";
  amount: number;
  fee: number;
  destinationBankName: string;
  destinationAccountNumber: string;
  destinationAccountName: string;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
  createdAt: string;
  completedAt?: string;
}

export interface LiquidityStats {
  pendingPayouts: number;
  totalDisbursedOTC: number;
  totalDisbursedRails: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
}

export interface LiquidityDisbursementsResponse {
  disbursements: Disbursement[];
  total: number;
  page: number;
  limit: number;
}
