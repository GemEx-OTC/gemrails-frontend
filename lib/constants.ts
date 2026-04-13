// GemRails Platform Constants

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
  bufferAmount: 1500, // ₦1,500 buffer added to customer payment (deprecated - use API)
  platformFee: 1000, // ₦1,000 GemRails revenue from buffer (deprecated - use API)
  merchantIncentive: 100, // ₦100 merchant bonus from buffer (deprecated - use API)
  minimumPayment: 5000, // ₦5,000 minimum payment amount (deprecated - use API)
} as const

export const TIER_LIMITS = {
  0: 200000,
  1: 500000,
  2: Infinity,
} as const

export const TIER_DESCRIPTIONS = {
  0: "₦200k Limit (Email Verified)",
  1: "₦500k Limit (Phone Verified)",
  2: "Unlimited (CAC Verified)",
} as const

export const SUPPORTED_ASSETS = ["USDT", "USDC"] as const

export const BUSINESS_CATEGORIES = [
  {
    group: "Professional & Technical Services",
    items: [
      { value: "it_technology", label: "IT & Technology" },
      { value: "engineering", label: "Engineering" },
      { value: "consultancy", label: "Consultancy" },
      { value: "legal_accounting", label: "Legal & Accounting" },
    ],
  },
  {
    group: "General Commerce & Trade",
    items: [
      { value: "general_merchandise", label: "General Merchandise" },
      { value: "general_contracts", label: "General Contracts" },
      { value: "retail_wholesale", label: "Retail/Wholesale Trade" },
      { value: "marketing_advertising", label: "Marketing & Advertising" },
    ],
  },
  {
    group: "Agriculture, Forestry & Fishing",
    items: [
      { value: "crop_production", label: "Crop Production" },
      { value: "animal_husbandry", label: "Animal Husbandry" },
      { value: "agro_allied", label: "Agro-Allied Services" },
    ],
  },
  {
    group: "Hospitality & Lifestyle",
    items: [
      { value: "food_beverages", label: "Food & Beverages" },
      { value: "tourism", label: "Tourism" },
      { value: "personal_services", label: "Personal Services" },
    ],
  },
  {
    group: "Construction & Real Estate",
    items: [
      { value: "building_civil", label: "Building & Civil Works" },
      { value: "specialized_construction", label: "Specialized Construction" },
      { value: "real_estate", label: "Real Estate" },
    ],
  },
  {
    group: "Manufacturing & Production",
    items: [
      { value: "food_production", label: "Food Production" },
      { value: "industrial_goods", label: "Industrial Goods" },
    ],
  },
  {
    group: "Other",
    items: [{ value: "other", label: "Other" }],
  },
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
