"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Loader2
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LiquidityBalance {
  availableBalance: number
  ledgerBalance: number
  currency: string
}

interface Disbursement {
  id: string
  reference: string
  sourceReference: string
  source: "OTC" | "RAILS"
  amount: number
  fee: number
  destinationBankName: string
  destinationAccountNumber: string
  destinationAccountName: string
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED"
  createdAt: string
  completedAt?: string
}

interface LiquidityStats {
  pendingPayouts: number
  totalDisbursedOTC: number
  totalDisbursedRails: number
  successCount: number
  failedCount: number
  pendingCount: number
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `₦${(amount / 1000000000).toFixed(2)}B`
  if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `₦${(amount / 1000).toFixed(1)}K`
  return `₦${amount.toLocaleString()}`
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Success" }
    case "FAILED":
      return { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", label: "Failed" }
    case "PROCESSING":
      return { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10", label: "Processing" }
    default:
      return { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pending" }
  }
}

const getSourceBadge = (source: string) => {
  return source === "OTC" 
    ? { color: "text-purple-400", bg: "bg-purple-500/10", label: "OTC" }
    : { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Rails" }
}

export default function LiquidityPage() {
  const [balance, setBalance] = useState<LiquidityBalance | null>(null)
  const [disbursements, setDisbursements] = useState<Disbursement[]>([])
  const [stats, setStats] = useState<LiquidityStats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }

      const balanceRes = await fetch(`${process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL}/api/v1/admin/liquidity/balance`, { headers })
      if (balanceRes.ok) {
        const balanceData = await balanceRes.json()
        setBalance(balanceData.data)
      }

      const disbursementsRes = await fetch(`${process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL}/api/v1/admin/liquidity/disbursements?page=${page}&limit=10`, { headers })
      if (disbursementsRes.ok) {
        const disbursementsData = await disbursementsRes.json()
        setDisbursements(disbursementsData.data.disbursements || [])
        setTotal(disbursementsData.data.total || 0)
      }

      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL}/api/v1/admin/liquidity/disbursements?limit=1000`, { headers })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        const allDisbursements: Disbursement[] = statsData.data.disbursements || []
        
        setStats({
          pendingPayouts: allDisbursements.filter(d => d.status === "PENDING" || d.status === "PROCESSING").reduce((sum, d) => sum + d.amount, 0),
          totalDisbursedOTC: allDisbursements.filter(d => d.status === "SUCCESS" && d.source === "OTC").reduce((sum, d) => sum + d.amount, 0),
          totalDisbursedRails: allDisbursements.filter(d => d.status === "SUCCESS" && d.source === "RAILS").reduce((sum, d) => sum + d.amount, 0),
          successCount: allDisbursements.filter(d => d.status === "SUCCESS").length,
          failedCount: allDisbursements.filter(d => d.status === "FAILED").length,
          pendingCount: allDisbursements.filter(d => d.status === "PENDING" || d.status === "PROCESSING").length,
        })
      }
    } catch (error) {
      console.error("Failed to fetch liquidity data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Liquidity Center</h1>
          <p className="text-gray-400">Monitor platform liquidity and payout history</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Available Balance</span>
              </div>
              <p className="text-3xl font-bold text-white">{balance ? formatCurrency(balance.availableBalance) : "—"}</p>
              <p className="text-sm text-emerald-400/70 mt-1">Ready for payouts</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Pending Payouts</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats ? formatCurrency(stats.pendingPayouts) : "—"}</p>
              <p className="text-sm text-amber-400/70 mt-1">{stats?.pendingCount || 0} awaiting payout</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpRight className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">OTC Payouts</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats ? formatCurrency(stats.totalDisbursedOTC) : "—"}</p>
              <p className="text-sm text-purple-400/70 mt-1">From GemEx OTC</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <ArrowDownRight className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Rails Payouts</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats ? formatCurrency(stats.totalDisbursedRails) : "—"}</p>
              <p className="text-sm text-blue-400/70 mt-1">From GemEx Rails</p>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.successCount || 0}</p>
                <p className="text-sm text-gray-400">Successful</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.pendingCount || 0}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.failedCount || 0}</p>
                <p className="text-sm text-gray-400">Failed</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">Payout History</h2>
            </div>

            {disbursements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Droplets className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-400">No payouts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {disbursements.map((d, idx) => {
                  const statusBadge = getStatusBadge(d.status)
                  const sourceBadge = getSourceBadge(d.source)
                  const StatusIcon = statusBadge.icon
                  return (
                    <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className="px-6 py-4 hover:bg-gray-800/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-white truncate">{d.destinationAccountName}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sourceBadge.bg} ${sourceBadge.color}`}>{sourceBadge.label}</span>
                            </div>
                            <p className="text-sm text-gray-400">{d.destinationBankName} • ****{d.destinationAccountNumber.slice(-4)}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-white">{formatCurrency(d.amount)}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.color} mt-1`}>
                            <StatusIcon className="w-3 h-3" />{statusBadge.label}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {total > 10 && (
              <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-400">Showing {((page - 1) * 10) + 1} - {Math.min(page * 10, total)} of {total}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                  <button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
