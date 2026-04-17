"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowUpRight, 
  AlertCircle,
  Banknote,
  History as HistoryIcon,
  Loader2,
  Lock,
  Building2,
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  Search,
  X
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { apiClient as api } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

export default function ReferralsPage() {
  const { user, refreshUser } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"bonuses" | "withdrawals">("bonuses")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [copied, setCopied] = useState(false)
  
  // Payout Account Flow state
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [payoutStep, setPayoutStep] = useState<1 | 2 | 3>(1)
  const [banks, setBanks] = useState<any[]>([])
  const [selectedBank, setSelectedBank] = useState<any>(null)
  const [payoutAccountNumber, setPayoutAccountNumber] = useState("")
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false)
  const [verifiedAccountName, setVerifiedAccountName] = useState("")
  const [isSavingAccount, setIsSavingAccount] = useState(false)
  const [bankSearchQuery, setBankSearchQuery] = useState("")

  const fetchData = async () => {
    try {
      const [statsRes, historyRes, withdrawalsRes, banksRes] = await Promise.all([
        api.get("/referrals/stats"),
        api.get("/referrals/history"),
        api.get("/referrals/withdrawals"),
        api.get("/referrals/banks")
      ])
      setStats(statsRes.data.data)
      setHistory(historyRes.data.data.bonuses || [])
      setWithdrawals(withdrawalsRes.data.data.withdrawals || [])
      setBanks(banksRes.data.data || [])
    } catch (error) {
      console.error("Failed to fetch referral data:", error)
      toast.error("Failed to load referral data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const copyReferralCode = () => {
    if (!stats?.referralCode) return
    navigator.clipboard.writeText(stats.referralCode)
    setCopied(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(withdrawAmount)

    if (amount < 10000) {
      toast.error("Minimum withdrawal is ₦10,000")
      return
    }

    if (amount > (stats?.balance || 0)) {
      toast.error("Insufficient balance")
      return
    }

    setIsWithdrawing(true)
    try {
      await api.post("/referrals/withdraw", { amount })
      toast.success("Withdrawal initiated successfully!")
      setWithdrawAmount("")
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate withdrawal")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleVerifyAccount = async () => {
    if (!selectedBank || payoutAccountNumber.length < 10) return
    
    setIsVerifyingAccount(true)
    try {
      const res = await api.post("/referrals/verify-payout-account", {
        accountNumber: payoutAccountNumber,
        bankCode: selectedBank.code
      })
      setVerifiedAccountName(res.data.data.accountName)
      setPayoutStep(3)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not verify bank account")
    } finally {
      setIsVerifyingAccount(false)
    }
  }

  const handleSavePayoutAccount = async () => {
    setIsSavingAccount(true)
    try {
      await api.post("/referrals/payout-account", {
        accountNumber: payoutAccountNumber,
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        accountName: verifiedAccountName
      })
      toast.success("Payout account updated successfully!")
      setShowPayoutModal(false)
      // Refresh AuthContext to reflect the dedicated referral account immediately
      refreshUser()
      fetchData()
      // Note: Ideally refresh user context here
    } catch (error: any) {
      toast.error("Failed to save payout account")
    } finally {
      setIsSavingAccount(false)
    }
  }

  const resetPayoutFlow = () => {
    setShowPayoutModal(false)
    setPayoutStep(1)
    setSelectedBank(null)
    setPayoutAccountNumber("")
    setVerifiedAccountName("")
    setBankSearchQuery("")
  }

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
    bank.code.includes(bankSearchQuery)
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-gray-500 mt-4">Loading referral program...</p>
      </div>
    )
  }

  const isVerified = (user?.tier ?? 0) >= 2
  const isEnterprise = user?.accountType === "enterprise"
  const hasDedicatedAccount = !!user?.referralBankAccount?.accountNumber
  const canSetPayoutAccount = isVerified && isEnterprise && !hasDedicatedAccount

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            Referral Program
          </h1>
          <p className="text-gray-400 mt-1">Earn ₦2,000 for every 1,000 USDT your referrals process.</p>
        </div>
        
        {!isVerified && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm italic">
            <Lock className="w-4 h-4" />
            Complete Tier 2 verification to join the program
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#0a0d10] border border-gray-800 relative overflow-hidden group"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Available Balance</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(stats?.balance || 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-[#0a0d10] border border-gray-800 relative overflow-hidden group"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl font-semibold" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Earned</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(stats?.totalEarned || 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-[#0a0d10] border border-gray-800 relative overflow-hidden group lg:col-span-1 sm:col-span-2"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl font-semibold" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Total Referrals</p>
              <p className="text-2xl font-bold text-white mt-1">
                {stats?.referralCount || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Link Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-gray-900 to-[#0a0d10] border border-gray-800 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Share your code</h2>
            <p className="text-gray-400">Invite other business owners and earn commissions on every successful transaction they process through GemRails.</p>
            
            <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Your Unique Code</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {isVerified ? (stats?.referralCode || "GEM-XXXXXX") : "GEM-XXXXXX"}
                </span>
              </div>
              <button 
                onClick={copyReferralCode}
                disabled={!isVerified}
                className="p-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {!isVerified && (
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-500/90 leading-relaxed">
                  Referral code generation requires <strong>Tier 2 verification</strong>. Please complete the verification process to start earning.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <p className="text-xs text-emerald-400/70 text-center font-medium uppercase tracking-wider">
              Earn lifetime rewards from your referrals
            </p>
          </div>
        </motion.div>

        {/* Withdrawal Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0a0d10] border border-gray-800"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-500" />
            Withdraw Earnings
          </h2>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount to Withdraw (NGN)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-500 group-focus-within:text-emerald-500 transition-colors">₦</span>
                <input 
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min ₦10,000"
                  className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500/50 text-white pl-10 pr-4 py-4 rounded-2xl outline-none transition-all text-xl font-bold"
                />
              </div>
              <div className="flex justify-between mt-2 px-1">
                <p className="text-xs text-gray-500">Minimum: ₦10,000</p>
                <button 
                  type="button"
                  onClick={() => setWithdrawAmount(String(stats?.balance || 0))}
                  className="text-xs text-emerald-500 hover:text-emerald-400 font-bold"
                >
                  Use Max
                </button>
              </div>
            </div>

            <div 
              onClick={() => canSetPayoutAccount && setShowPayoutModal(true)}
              className={`p-4 bg-gray-900/50 rounded-2xl border border-gray-800 flex items-center gap-4 transition-all ${
                canSetPayoutAccount ? "cursor-pointer hover:border-emerald-500/30 group/payout" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="p-2 rounded-lg bg-gray-800 text-gray-400 group-hover/payout:bg-emerald-500/10 group-hover/payout:text-emerald-500 transition-colors">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">
                  {!isEnterprise ? "Main Payout Account" : hasDedicatedAccount ? "Dedicated Referral Account" : "Payout Account"}
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {user?.referralBankAccount?.accountNumber || user?.bankAccount?.accountNumber || "No bank account set"}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {!isEnterprise 
                    ? "Commissions are sent to your primary business account." 
                    : hasDedicatedAccount 
                      ? "Account is locked once set for security." 
                      : isVerified 
                        ? "Set a dedicated bank account for referral withdrawals." 
                        : "Requires Tier 2 verification."}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {canSetPayoutAccount ? (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover/payout:text-emerald-500" />
                    <span className="text-[9px] text-emerald-500 font-bold uppercase opacity-0 group-hover/payout:opacity-100 transition-opacity whitespace-nowrap">Set</span>
                  </>
                ) : hasDedicatedAccount && isEnterprise ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isWithdrawing || !isVerified || Number(withdrawAmount) < 10000 || Number(withdrawAmount) > (stats?.balance || 0)}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-[#0a0d10] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Withdraw Now</span>
                  <ArrowUpRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* History Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-[#0a0d10] border border-gray-800"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6 border-b border-gray-800 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("bonuses")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === "bonuses" ? "text-emerald-500" : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Bonus History
              </div>
              {activeTab === "bonuses" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("withdrawals")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === "withdrawals" ? "text-emerald-500" : "text-gray-500 hover:text-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" />
                Withdrawal History
              </div>
              {activeTab === "withdrawals" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          </div>
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-[10px] text-gray-500 font-bold uppercase tracking-widest w-fit">
            Lifetime View
          </div>
        </div>

        {activeTab === "bonuses" ? (
          history.length > 0 ? (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Merchant</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Transaction</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Bonus</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {history.map((bonus) => (
                    <tr key={bonus.id} className="group hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs uppercase">
                            {bonus.refereeName.charAt(0)}
                          </div>
                          <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">{bonus.refereeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-gray-400">
                        ${bonus.amountUSDT.toLocaleString()} USDT
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold">
                          {formatCurrency(bonus.bonusNGN)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-sm text-gray-500">
                        {new Date(bonus.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 mb-4">
                <HistoryIcon className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-white font-bold text-lg">No bonuses yet</h3>
              <p className="text-gray-500 max-w-[280px] mt-1 italic">
                When your referrals start processing payments, your bonuses will appear here.
              </p>
            </div>
          )
        ) : (
          withdrawals.length > 0 ? (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Reference</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="group hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-5 font-mono text-xs text-gray-400">
                        {withdrawal.fiatTxRef || withdrawal.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-white">
                        {formatCurrency(withdrawal.amount)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          withdrawal.status === 'completed' 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : withdrawal.status === 'failed'
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-sm text-gray-500">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 mb-4">
                <Banknote className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-white font-bold text-lg">No withdrawals yet</h3>
              <p className="text-gray-500 max-w-[280px] mt-1 italic">
                Initiate your first withdrawal to see your history here.
              </p>
            </div>
          )
        )}
      </motion.div>

      {/* Payout Account Setup Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetPayoutFlow}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-[#0a0d10] border border-gray-800 rounded-3xl overflow-hidden relative z-10"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Setup Payout Account</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Step {payoutStep} of 3</p>
              </div>
              <button 
                onClick={resetPayoutFlow}
                className="p-2 hover:bg-gray-800 rounded-xl text-gray-500 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stepper Progress */}
            <div className="flex h-1 bg-gray-900">
              <motion.div 
                animate={{ width: `${(payoutStep / 3) * 100}%` }}
                className="bg-emerald-500"
              />
            </div>

            <div className="p-8">
              {payoutStep === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center space-y-3 mb-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Select Payout Bank</h4>
                    <p className="text-sm text-gray-400">Where should we send your referral commissions?</p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                      <Search className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      placeholder="Search for your bank..."
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500/50 text-white pl-14 pr-6 py-4 rounded-2xl outline-none transition-all"
                    />
                    {bankSearchQuery && (
                      <button 
                        onClick={() => setBankSearchQuery("")}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <motion.button
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={bank.code}
                          onClick={() => {
                            setSelectedBank(bank)
                            setPayoutStep(2)
                          }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            selectedBank?.code === bank.code 
                              ? "bg-emerald-500/10 border-emerald-500 text-white" 
                              : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-800/50"
                          }`}
                        >
                          <span className="font-semibold">{bank.name}</span>
                          {selectedBank?.code === bank.code ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-gray-900 text-gray-600 border border-gray-800">
                          <Search className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-bold">No banks found</p>
                          <p className="text-sm text-gray-500">Try a different search term</p>
                        </div>
                        <button 
                          onClick={() => setBankSearchQuery("")}
                          className="text-emerald-500 text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {payoutStep === 2 && (
                <div className="space-y-6">
                  <button 
                    onClick={() => setPayoutStep(1)}
                    className="text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    Change Bank
                  </button>
                  
                  <div className="flex flex-col items-center text-center space-y-3 mb-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                      <Fingerprint className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{selectedBank?.name}</h4>
                    <p className="text-sm text-gray-400">Enter your 10-digit account number</p>
                  </div>

                  <div className="space-y-4">
                    <input 
                      type="text"
                      maxLength={10}
                      value={payoutAccountNumber}
                      onChange={(e) => setPayoutAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 0123456789"
                      className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500/50 text-white px-6 py-5 rounded-3xl outline-none transition-all text-2xl font-mono font-bold text-center tracking-widest"
                      autoFocus
                    />

                    <button
                      onClick={handleVerifyAccount}
                      disabled={payoutAccountNumber.length < 10 || isVerifyingAccount}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-500 text-[#0a0d10] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {isVerifyingAccount ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Details</span>
                          <ShieldCheck className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {payoutStep === 3 && (
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="w-10 h-10 text-black" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-white">Identity Confirmed</h4>
                      <p className="text-sm text-gray-400 italic">Please verify this matches your official records</p>
                    </div>
                  </div>

                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-xs uppercase tracking-widest font-black text-gray-500">
                      <span>Account Name</span>
                      <span className="text-emerald-500">Verified</span>
                    </div>
                    <p className="text-2xl font-bold text-white leading-tight">
                      {verifiedAccountName}
                    </p>
                    <div className="h-px bg-emerald-500/10" />
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-400">
                        {selectedBank?.name}
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {payoutAccountNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setPayoutStep(2)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleSavePayoutAccount}
                      disabled={isSavingAccount}
                      className="flex-2 bg-emerald-500 hover:bg-emerald-400 text-[#0a0d10] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSavingAccount ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <span>Save Payout Account</span>
                          <ArrowUpRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer Info */}
            <div className="p-6 bg-gray-900/50 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
                Secure Bank Verification by Nomba
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
