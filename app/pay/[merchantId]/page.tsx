"use client"

import { useState, useEffect, use, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  Check,
  Copy,
  Clock,
  ArrowRight,
  Shield,
  Wallet,
  ChevronLeft,
  Sparkles,
  Zap,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import domtoimage from "dom-to-image-more"
import { SUPPORTED_ASSETS } from "@/lib/constants"
import { copyToClipboard } from "@/lib/clipboard"
import { useMerchantInfo, useExchangeRate, useInitiatePayment, usePaymentStatus, useConfirmPayment } from "@/lib/hooks/use-payments"
import { getImageUrl } from "@/lib/utils/image"

type PaymentStep = "amount" | "crypto" | "payment" | "processing" | "success"

interface Merchant {
  id: string
  businessName: string
  businessLogo?: string
  merchantId: string
  verified: boolean
}

interface Rates {
  USDT: number
  USDC: number
  lastUpdated: string
}

interface Transaction {
  transactionId: string
  walletAddress: string
  amount: number
  cryptoAmount: number
  cryptoAsset: string
  network: string
  expiresAt: string
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: PaymentStep }) => {
  const steps = ["amount", "crypto", "payment"]
  const currentIndex = steps.indexOf(currentStep)

  if (currentStep === "processing" || currentStep === "success") return null

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${index < currentIndex
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : index === currentIndex
                ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                : "bg-gray-800 border border-gray-700 text-gray-500"
              }`}
          >
            {index < currentIndex ? (
              <Check className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </motion.div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 transition-all ${index < currentIndex ? "bg-emerald-500" : "bg-gray-700"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ merchantId: string }>
}) {
  const { merchantId } = use(params)

  const { data: merchantData, isLoading: merchantLoading, error: merchantError } = useMerchantInfo(merchantId)
  const { data: ratesData, isLoading: ratesLoading } = useExchangeRate()
  const initiatePaymentMutation = useInitiatePayment()
  const confirmPaymentMutation = useConfirmPayment()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const isLoading = merchantLoading || ratesLoading

  const merchant = merchantData as unknown as Merchant | null
  const rates = ratesData as unknown as Rates | null

  const [step, setStep] = useState<PaymentStep>("amount")
  const [nairaAmount, setNairaAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<"USDT" | "USDC">("USDT")
  const [selectedNetwork, setSelectedNetwork] = useState<"TRC20" | "BSC">("TRC20")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(900)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  // Poll for Payment Status
  const { data: paymentStatusData } = usePaymentStatus(transaction?.transactionId || "", {
    enabled: !!transaction?.transactionId && step !== "success",
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (merchantError) {
      setError("Invalid merchant or service unavailable")
    }
  }, [merchantError])

  useEffect(() => {
    if (paymentStatusData) {
      const status = (paymentStatusData as any).status
      if (status === "Settled" || status === "CryptoReceived" || status === "Processing") {
        setStep("success")
      }
    }
  }, [paymentStatusData])


  const walletAddress = transaction?.walletAddress || ""

  // Parse amount from formatted string (remove commas)
  const amount = parseFloat(nairaAmount.replace(/,/g, '')) || 0
  const exchangeRate = rates ? (rates as any)[selectedAsset] : 0
  const cryptoAmount = exchangeRate > 0 ? amount / exchangeRate : 0
  
  // Get minimum payment from API - this is the platform's enforced minimum
  const minPayment = ratesData ? (ratesData as any).minimumPayment : null
  const isMinPaymentLoaded = minPayment !== null && minPayment !== undefined

  // Format number with commas as user types
  const formatInputAmount = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    // Format with commas
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputAmount(e.target.value)
    setNairaAmount(formatted)
  }

  useEffect(() => {
    if (step === "payment" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, timeLeft])

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`

  const handleAmountSubmit = () => {
    setError("")
    if (!isMinPaymentLoaded) {
      toast.error("Loading payment settings, please wait...")
      return
    }
    if (amount < minPayment) {
      setError(`Minimum payment is ${formatCurrency(minPayment)}`)
      toast.error(`Minimum payment is ${formatCurrency(minPayment)}`)
      return
    }
    setStep("crypto")
  }

  const handleInitiatePayment = async () => {
    setError("")
    initiatePaymentMutation.mutate(
      {
        merchantId: merchantId,
        amount,
        cryptoAsset: selectedAsset,
        network: selectedNetwork,
      },
      {
        onSuccess: (data: any) => {
          setTransaction(data)
          setStep("payment")
          if (data.expiresAt) {
            const expiryTime = new Date(data.expiresAt).getTime()
            const now = Date.now()
            const diff = Math.floor((expiryTime - now) / 1000)
            setTimeLeft(diff > 0 ? diff : 900)
          } else {
            setTimeLeft(900)
          }
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to initiate payment")
        },
      }
    )
  }

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(walletAddress)
    if (success) {
      setCopied(true)
      toast.success("Address copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirmPayment = async () => {
    if (!transaction) return
    setIsConfirming(true)
    confirmPaymentMutation.mutate(
      { transactionId: transaction.transactionId },
      {
        onSuccess: () => {
          setStep("processing")
          setTimeout(() => setStep("success"), 2000)
        },
        onError: () => {
          setStep("processing")
        },
      }
    )
    setIsConfirming(false)
  }

  const handleBack = () => {
    if (step === "crypto") setStep("amount")
    else if (step === "payment") setStep("crypto")
  }

  const handleShareTx = async () => {
    if (!pageRef.current) return
    
    setIsCapturing(true)
    try {
      // Use dom-to-image-more with adjusted settings to reduce border artifacts
      const dataUrl = await domtoimage.toPng(pageRef.current, {
        quality: 1,
        bgcolor: '#0a0d10',
        width: pageRef.current.scrollWidth,
        height: pageRef.current.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          overflow: 'hidden',
        },
      })

      // Download the image
      const link = document.createElement('a')
      link.download = `gemrails-receipt-${transaction?.transactionId || 'payment'}.png`
      link.href = dataUrl
      link.click()

      toast.success('Receipt saved!')
    } catch (err) {
      console.error('Failed to capture screenshot:', err)
      toast.error('Failed to save receipt')
    } finally {
      setIsCapturing(false)
    }
  }

  const quickAmounts = [5000, 10000, 20000, 50000]

  if (isLoading && !merchant) {
    return (
      <div className="min-h-screen bg-[#0a0d10] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-[#0a0d10] flex items-center justify-center text-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold">Merchant Not Found</h1>
          <p className="text-gray-400 mt-2">The link you followed is invalid or expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0d10] relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[200px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-2xl shadow-emerald-500/20">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/20 overflow-hidden"
            >
              {merchant.businessLogo ? (
                <img 
                  src={getImageUrl(merchant.businessLogo) || undefined} 
                  alt={merchant.businessName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide broken image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-3xl ${merchant.businessLogo ? 'hidden' : ''}`}>🏪</span>
            </motion.div>
            <div className="flex-1">
              <h1 className="text-white font-bold text-xl tracking-tight">
                {merchant.businessName}
              </h1>
              <div className="flex items-center gap-1.5 text-emerald-100 text-sm mt-0.5">
                {merchant.verified && (
                  <Shield className="w-4 h-4 text-white" />
                )}
                <span className="font-medium">Verified Merchant</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-semibold">GemRails</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {/* Amount Entry Step */}
          {step === "amount" && (
            <motion.div
              key="amount"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Amount Input Card */}
              <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 shadow-2xl shadow-black/30">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-5 font-medium">Enter amount to pay</p>
                  <div className="relative inline-flex items-center justify-center bg-gray-800/50 rounded-2xl px-6 py-4 border border-gray-700/50">
                    <span className="text-4xl text-emerald-400 mr-2 font-light">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={nairaAmount}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-48 bg-transparent text-5xl font-bold text-white text-center focus:outline-none placeholder:text-gray-600"
                      autoFocus
                    />
                  </div>
                  {isMinPaymentLoaded && (
                    <p className="text-gray-500 text-sm mt-4">
                      Minimum: {formatCurrency(minPayment)}
                    </p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-6">
                  {quickAmounts.map((amt) => (
                    <motion.button
                      key={amt}
                      onClick={() => setNairaAmount(formatInputAmount(amt.toString()))}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all ${amount === amt
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40"
                        : "bg-gray-800/60 border border-gray-700/80 text-gray-300 hover:border-emerald-500/50 hover:text-white hover:bg-gray-800"
                        }`}
                    >
                      ₦{amt / 1000}k
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl backdrop-blur-xl"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Crypto Estimate Card */}
              <AnimatePresence>
                {isMinPaymentLoaded && amount >= minPayment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-5 shadow-xl shadow-black/20"
                  >
                    <div className="flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl py-3">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">
                        ≈ {cryptoAmount.toFixed(2)} USDT/USDC
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue Button */}
              <motion.button
                onClick={handleAmountSubmit}
                disabled={!isMinPaymentLoaded || amount < minPayment}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {!isMinPaymentLoaded ? "Loading..." : "Continue"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500">
                Secured by{" "}
                <span className="text-emerald-400 font-semibold">GemRails</span>
              </p>
            </motion.div>
          )}

          {/* Crypto Selection Step */}
          {step === "crypto" && (
            <motion.div
              key="crypto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                whileHover={{ x: -4 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                <span className="font-medium">Back</span>
              </motion.button>

              {/* Amount Summary Card */}
              <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
                <div className="relative">
                  <p className="text-gray-300 text-sm mb-2 font-medium">You're paying</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {formatCurrency(amount)}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      ≈ {cryptoAmount.toFixed(2)} USDT/USDC
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptocurrency Selection Card */}
              <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-5 shadow-2xl shadow-black/30">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">1</span>
                  </div>
                  Select Cryptocurrency
                </h3>
                <div className="flex gap-2">
                  {SUPPORTED_ASSETS.map((asset) => (
                    <motion.button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${selectedAsset === asset
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-700/80 bg-gray-800/40"
                        }`}
                    >
                      <img
                        src={`/icons/${asset.toLowerCase()}.svg`}
                        alt={asset}
                        className="w-6 h-6"
                      />
                      <span className="text-white font-medium text-sm">{asset}</span>
                      {selectedAsset === asset && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Network Selection Card */}
              <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-5 shadow-2xl shadow-black/30">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">2</span>
                  </div>
                  Select Network
                </h3>
                <div className="flex gap-2">
                  {(["TRC20", "BSC"] as const).map((network) => (
                    <motion.button
                      key={network}
                      onClick={() => setSelectedNetwork(network)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-1 p-3 rounded-xl border transition-all ${selectedNetwork === network
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-gray-700/80 bg-gray-800/40"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <img
                          src={`/icons/chains/${network === "TRC20" ? "tron" : "bnb"}.svg`}
                          alt={network}
                          className="w-5 h-5"
                        />
                        <span className="text-white font-medium text-sm">{network}</span>
                        {selectedNetwork === network && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${network === "TRC20" ? "text-emerald-400" : "text-blue-400"
                        }`}>
                        {network === "TRC20" ? "Recommended" : "Low fees"}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <motion.button
                onClick={handleInitiatePayment}
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Get Payment Address
              </motion.button>
            </motion.div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBack}
                whileHover={{ x: -4 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                <span className="font-medium">Back</span>
              </motion.button>

              {/* Timer Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`backdrop-blur-xl border rounded-2xl p-4 shadow-xl transition-all ${timeLeft < 120
                  ? "bg-red-500/10 border-red-500/30 shadow-red-500/10"
                  : "bg-amber-500/10 border-amber-500/30 shadow-amber-500/10"
                  }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Clock className={`w-5 h-5 ${timeLeft < 120 ? "text-red-400" : "text-amber-400"}`} />
                  <span className="font-mono text-3xl font-bold text-white tracking-wider">
                    {formatTime(timeLeft)}
                  </span>
                  <span className={`text-sm font-medium ${timeLeft < 120 ? "text-red-400" : "text-amber-400"}`}>
                    remaining
                  </span>
                </div>
                {timeLeft === 0 ? (
                  <p className="text-center text-red-500 text-sm mt-2 font-bold">Rate Expired. Please restart.</p>
                ) : timeLeft < 120 && (
                  <p className="text-center text-red-400 text-xs mt-2">Rate expires soon!</p>
                )}
              </motion.div>

              {/* Amount to Send Card */}
              <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
                <div className="relative">
                  <p className="text-gray-300 text-sm mb-2 font-medium">Send exactly</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-5xl font-bold text-white">
                      {cryptoAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/20 rounded-full mt-4 border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold text-lg">
                      {selectedAsset}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-gray-500" />
                    <span className="text-emerald-400 font-semibold">
                      {selectedNetwork}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Address Card */}
              <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 shadow-2xl shadow-black/30">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm font-medium">
                    To this {selectedNetwork} address:
                  </p>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    {selectedNetwork}
                  </span>
                </div>
                <div className="flex items-stretch gap-3">
                  <code className="flex-1 text-sm text-white bg-gray-800/80 p-4 rounded-xl break-all font-mono border border-gray-700/80 leading-relaxed">
                    {walletAddress}
                  </code>
                  <motion.button
                    onClick={handleCopyAddress}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 rounded-xl flex items-center justify-center transition-all ${copied
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                      }`}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-emerald-400 text-sm mt-3 text-center font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Address copied to clipboard!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Warning Card */}
              <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 shadow-xl shadow-amber-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-400 font-semibold mb-2">Important</p>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>Only send <strong className="text-white">{selectedAsset}</strong> on <strong className="text-white">{selectedNetwork}</strong> network</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>Send the <strong className="text-white">exact amount</strong> shown above</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>Wrong network = <strong className="text-red-400">permanent loss</strong> of funds</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirmPayment}
                disabled={isConfirming || timeLeft === 0}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                I've Sent the Payment
              </motion.button>
            </motion.div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-10 shadow-2xl shadow-black/30 text-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />

                <div className="relative">
                  {/* Animated spinner */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-gray-700 border-t-emerald-500 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-4 border-gray-800 border-b-teal-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-3">
                    Confirming Payment
                  </h2>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                    Please wait while we verify your transaction on the blockchain.
                  </p>

                  {/* Status indicators */}
                  <div className="mt-8 space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center gap-3 text-emerald-400"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Transaction detected</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="flex items-center justify-center gap-3 text-emerald-400"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Verifying on blockchain...</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="py-6 space-y-5"
            >
              {/* Success content */}
              <div className="space-y-5">
                {/* Success Icon */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-6 relative"
                  >
                    <Check className="w-14 h-14 text-white relative z-10" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    Payment Confirmed! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-300 text-lg font-semibold"
                  >
                    Look at you shopping with crypto like a King that you are.
                  </motion.p>
                </div>

                {/* Transaction Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-900/70 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-6 shadow-2xl shadow-black/30"
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Transaction Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                      <span className="text-gray-400">Amount Paid</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                      <span className="text-gray-400">Crypto Sent</span>
                      <span className="text-white font-semibold">
                        {cryptoAmount.toFixed(2)} {selectedAsset}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white font-semibold">{selectedNetwork}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-800">
                      <span className="text-gray-400">Merchant</span>
                      <span className="text-white font-semibold">
                        {merchant.businessName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-400">Reference</span>
                      <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
                        {transaction?.transactionId || "TXN..."}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Success Message Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 text-center shadow-xl shadow-emerald-500/10"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">
                      Powered by GemRails
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The merchant has been notified. You can safely close this page.
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <motion.button
                  onClick={() => window.close()}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
                >
                  Done
                </motion.button>
                <motion.button
                  onClick={handleShareTx}
                  disabled={isCapturing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-2xl font-medium text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCapturing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Save Receipt
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
