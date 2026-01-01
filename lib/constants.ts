// GemExRails Platform Constants

export const CRYPTO_ASSETS = {
  USDT: { name: "Tether", symbol: "USDT", icon: "₮" },
  USDC: { name: "USD Coin", symbol: "USDC", icon: "$" },
} as const

export const CRYPTO_NETWORKS = {
  TRC20: { name: "Tron (TRC20)", chain: "TRON" },
  BSC: { name: "BNB Smart Chain", chain: "BSC" },
  ERC20: { name: "Ethereum (ERC20)", chain: "ETH" },
} as const

export const MERCHANT_STATUS = {
  Pending: {
    label: "Pending Verification",
    color: "text-amber-100 dark:text-amber-200",
    bg: "bg-amber-600/90 dark:bg-amber-700/90",
  },
  Verified: {
    label: "Verified",
    color: "text-green-100 dark:text-green-200",
    bg: "bg-green-600/90 dark:bg-green-700/90",
  },
  Suspended: {
    label: "Suspended",
    color: "text-red-100 dark:text-red-200",
    bg: "bg-red-600/90 dark:bg-red-700/90",
  },
  Rejected: {
    label: "Rejected",
    color: "text-red-100 dark:text-red-200",
    bg: "bg-red-600/90 dark:bg-red-700/90",
  },
} as const

export const PAYMENT_STATUS = {
  Initiated: {
    label: "Payment Initiated",
    color: "text-blue-100 dark:text-blue-200",
    bg: "bg-blue-600/90 dark:bg-blue-700/90",
    description: "Customer initiated payment",
  },
  AwaitingCrypto: {
    label: "Awaiting Crypto",
    color: "text-amber-100 dark:text-amber-200",
    bg: "bg-amber-600/90 dark:bg-amber-700/90",
    description: "Waiting for crypto deposit",
  },
  CryptoReceived: {
    label: "Crypto Received",
    color: "text-purple-100 dark:text-purple-200",
    bg: "bg-purple-600/90 dark:bg-purple-700/90",
    description: "Crypto confirmed on blockchain",
  },
  Processing: {
    label: "Processing Payout",
    color: "text-indigo-100 dark:text-indigo-200",
    bg: "bg-indigo-600/90 dark:bg-indigo-700/90",
    description: "Processing Naira settlement",
  },
  Settled: {
    label: "Settled",
    color: "text-emerald-100 dark:text-emerald-200",
    bg: "bg-emerald-600/90 dark:bg-emerald-700/90",
    description: "Payment completed successfully",
  },
  Failed: {
    label: "Failed",
    color: "text-red-100 dark:text-red-200",
    bg: "bg-red-600/90 dark:bg-red-700/90",
    description: "Payment failed",
  },
} as const

export const FEE_CONFIG = {
  bufferAmount: 1500, // ₦1,500 buffer added to customer payment
  platformFee: 1000, // ₦1,000 GemExRails revenue from buffer
  merchantIncentive: 100, // ₦100 merchant bonus from buffer
  minimumPayment: 5000, // ₦5,000 minimum payment amount
} as const

export const SUPPORTED_ASSETS = ["USDT", "USDC"] as const

export const BUSINESS_CATEGORIES = [
  { value: "restaurant", label: "Restaurant & Food Service" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "hospitality", label: "Hotels & Hospitality" },
  { value: "entertainment", label: "Entertainment & Events" },
  { value: "healthcare", label: "Healthcare & Pharmacy" },
  { value: "education", label: "Education & Training" },
  { value: "professional", label: "Professional Services" },
  { value: "other", label: "Other" },
] as const

// Nigerian Banks
export const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank For Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
] as const
