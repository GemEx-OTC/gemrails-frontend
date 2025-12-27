"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Check, Copy, Clock, ArrowRight, Shield, Wallet, ChevronLeft } from "lucide-react"
import { FEE_CONFIG, SUPPORTED_ASSETS, CRYPTO_NETWORKS } from "@/lib/constants"
import { copyToClipboard } from "@/lib/clipboard"

const mockMerchant = { id: "DEMO123", businessName: "Demo Restaurant", verified: true }
const MOCK_RATE = 1560

type PaymentStep = "amount" | "crypto" | "payment" | "processing" | "success"

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

export default function PaymentPage({ params }: { params: { merchantId: string } }) {
  const [step, setStep] = useState<PaymentStep>("amount")
  const [nairaAmount, setNairaAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<"USDT" | "USDC">("USDT")
  const [selectedNetwork, setSelectedNetwork] = useState<"TRC20" | "BSC" | "ERC20">("TRC20")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(900)

  const walletAddress = selectedNetwork === "TRC20" ? "TXYZa1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5" : selectedNetwork === "BSC" ? "0x742d35Cc6634C0532925a3b844Bc9e7595f64c31" : "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"

  const amount = parseFloat(nairaAmount) || 0
  const totalNaira = amount + FEE_CONFIG.bufferAmount
  const cryptoAmount = totalNaira / MOCK_RATE

  useEffect(() => {
    if (step === "payment" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, timeLeft])

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`

  const handleAmountSubmit = () => {
    setError("")
    if (amount < FEE_CONFIG.minimumPayment) { setError(`Minimum payment is ${formatCurrency(FEE_CONFIG.minimumPayment)}`); return }
    setStep("crypto")
  }

  const handleCryptoSelect = () => { setStep("payment"); setTimeLeft(900) }

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(walletAddress)
    if (success) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const handleConfirmPayment = () => { setStep("processing"); setTimeout(() => setStep("success"), 3000) }

  const handleBack = () => {
    if (step === "crypto") setStep("amount")
    else if (step === "payment") setStep("crypto")
  }

  return (
    <div className="min-h-screen bg-[#0a0d10]">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><span className="text-2xl">🏪</span></div>
          <div><h1 className="text-white font-bold text-lg">{mockMerchant.businessName}</h1><div className="flex items-center gap-1 text-emerald-100 text-sm">{mockMerchant.verified && <Shield className="w-4 h-4" />}<span>Verified Merchant</span></div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <AnimatePresence mode="wait">
          {step === "amount" && (
            <motion.div key="amount" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="text-center py-6">
                <p className="text-gray-400 mb-2">Enter amount to pay</p>
                <div className="relative inline-block"><span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl text-gray-500">₦</span><input type="number" value={nairaAmount} onChange={(e) => setNairaAmount(e.target.value)} placeholder="0" className="w-64 bg-transparent text-5xl font-bold text-white text-center focus:outline-none pl-8" autoFocus /></div>
                <p className="text-gray-500 text-sm mt-2">Minimum: {formatCurrency(FEE_CONFIG.minimumPayment)}</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5000, 10000, 20000, 50000].map((amt) => (<button key={amt} onClick={() => setNairaAmount(amt.toString())} className="py-2 px-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-emerald-500 hover:text-white transition-all text-sm">₦{(amt / 1000)}k</button>))}
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl"><AlertCircle className="w-4 h-4" />{error}</motion.div>}
              {amount >= FEE_CONFIG.minimumPayment && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Payment Amount</span><span className="text-white">{formatCurrency(amount)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Processing Fee</span><span className="text-white">{formatCurrency(FEE_CONFIG.bufferAmount)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-gray-800"><span className="text-white font-medium">Total</span><span className="text-emerald-400 font-bold">{formatCurrency(totalNaira)}</span></div>
                  <p className="text-xs text-gray-500 pt-2">≈ {cryptoAmount.toFixed(2)} USDT/USDC</p>
                </motion.div>
              )}
              <motion.button onClick={handleAmountSubmit} disabled={amount < FEE_CONFIG.minimumPayment} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button w-full flex items-center justify-center gap-2">Continue <ArrowRight className="w-5 h-5" /></motion.button>
              <p className="text-center text-xs text-gray-500">Powered by <span className="text-emerald-400">GemRails</span></p>
            </motion.div>
          )}

          {step === "crypto" && (
            <motion.div key="crypto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" />Back</button>
              <div className="text-center"><p className="text-gray-400 mb-1">You're paying</p><p className="text-3xl font-bold text-white">{formatCurrency(totalNaira)}</p><p className="text-emerald-400 text-sm mt-1">≈ {cryptoAmount.toFixed(2)} USDT/USDC</p></div>
              <div><p className="text-sm font-medium text-white mb-3">Select Cryptocurrency</p>
                <div className="grid grid-cols-2 gap-3">
                  {SUPPORTED_ASSETS.map((asset) => (<motion.button key={asset} onClick={() => setSelectedAsset(asset)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-4 rounded-xl border-2 transition-all ${selectedAsset === asset ? "border-emerald-500 bg-emerald-500/10" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}><div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-700 flex items-center justify-center"><span className="text-lg">{asset === "USDT" ? "₮" : "$"}</span></div><p className="text-white font-medium">{asset}</p><p className="text-xs text-gray-500">{asset === "USDT" ? "Tether" : "USD Coin"}</p></motion.button>))}
                </div>
              </div>
              <div><p className="text-sm font-medium text-white mb-3">Select Network</p>
                <div className="space-y-2">
                  {(["TRC20", "BSC", "ERC20"] as const).map((network) => (<motion.button key={network} onClick={() => setSelectedNetwork(network)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedNetwork === network ? "border-emerald-500 bg-emerald-500/10" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">{network === "TRC20" ? "T" : network === "BSC" ? "B" : "E"}</div><div className="text-left"><p className="text-white font-medium">{CRYPTO_NETWORKS[network].name}</p><p className="text-xs text-gray-500">{network === "TRC20" ? "Low fees, fast" : network === "BSC" ? "Low fees" : "Higher fees"}</p></div></div>{selectedNetwork === network && <Check className="w-5 h-5 text-emerald-400" />}</motion.button>))}
                </div>
              </div>
              <motion.button onClick={handleCryptoSelect} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button w-full flex items-center justify-center gap-2"><Wallet className="w-5 h-5" />Get Payment Address</motion.button>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" />Back</button>
              <div className="flex items-center justify-center gap-2 text-amber-400"><Clock className="w-5 h-5" /><span className="font-mono text-lg">{formatTime(timeLeft)}</span><span className="text-sm text-gray-500">remaining</span></div>
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl text-center"><p className="text-gray-400 mb-1">Send exactly</p><p className="text-4xl font-bold text-white">{cryptoAmount.toFixed(2)}</p><p className="text-emerald-400 font-medium">{selectedAsset}</p></div>
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl"><p className="text-sm text-gray-400 mb-2">To this {selectedNetwork} address:</p><div className="flex items-center gap-2"><code className="flex-1 text-sm text-white bg-gray-800 p-3 rounded-xl break-all font-mono">{walletAddress}</code><motion.button onClick={handleCopyAddress} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">{copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</motion.button></div></div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"><div className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /><div className="text-sm"><p className="text-amber-400 font-medium">Important</p><ul className="text-gray-400 mt-1 space-y-1"><li>• Only send {selectedAsset} on {selectedNetwork} network</li><li>• Send the exact amount shown above</li><li>• Wrong network = permanent loss</li></ul></div></div></div>
              <motion.button onClick={handleConfirmPayment} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button w-full">I've Sent the Payment</motion.button>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-12 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 mx-auto mb-6 border-4 border-gray-700 border-t-emerald-500 rounded-full" />
              <h2 className="text-xl font-bold text-white mb-2">Confirming Payment</h2>
              <p className="text-gray-400">Please wait while we verify your transaction...</p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-8 text-center space-y-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15, stiffness: 200 }} className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center"><Check className="w-10 h-10 text-white" /></motion.div>
              <div><h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2><p className="text-gray-400">Your payment of {formatCurrency(amount)} has been received.</p></div>
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl text-left space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Amount Paid</span><span className="text-white">{formatCurrency(amount)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Crypto Sent</span><span className="text-white">{cryptoAmount.toFixed(2)} {selectedAsset}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Merchant</span><span className="text-white">{mockMerchant.businessName}</span></div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-800"><span className="text-gray-400">Reference</span><span className="text-emerald-400 font-mono">TXN{Date.now().toString().slice(-8)}</span></div>
              </div>
              <p className="text-sm text-gray-500">A confirmation has been sent to the merchant.</p>
              <motion.button onClick={() => window.close()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button-outline w-full">Close</motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
