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
  Lock
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { apiClient as api } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

export default function ReferralsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"bonuses" | "withdrawals">("bonuses")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [copied, setCopied] = useState(false)

  const fetchData = async () => {
    try {
      const [statsRes, historyRes, withdrawalsRes] = await Promise.all([
        api.get("/referrals/stats"),
        api.get("/referrals/history"),
        api.get("/referrals/withdrawals")
      ])
      setStats(statsRes.data.data)
      setHistory(historyRes.data.data.bonuses || [])
      setWithdrawals(withdrawalsRes.data.data.withdrawals || [])
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-gray-500 mt-4">Loading referral program...</p>
      </div>
    )
  }

  const isVerified = (user?.tier ?? 0) >= 2

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

            <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gray-800 text-gray-400">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Payout Account</p>
                <p className="text-sm font-medium text-white truncate">
                  {user?.bankAccount?.accountNumber || "No bank account set"}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600" />
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
    </div>
  )
}
