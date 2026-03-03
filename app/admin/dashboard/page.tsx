"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Store,
  Receipt,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  FileText,
  Loader2,
} from "lucide-react"
import { useAdminDashboard } from "@/lib/hooks/use-admin"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AdminDashboardPage() {
  const { data, isLoading, refetch, isRefetching } = useAdminDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  const merchants = data?.merchants || { total: 0, verified: 0, pending: 0, suspended: 0, newThisWeek: 0 }
  const transactions = data?.transactions || { total: 0, totalVolume: 0, settled: 0, settledVolume: 0, pending: 0, pendingVolume: 0 }
  const recentActivity = data?.recentActivity || []

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor platform health and merchant activity</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Merchant Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-400" />
          Merchant Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <p className="text-sm font-medium text-emerald-400">Total Merchants</p>
            </div>
            <p className="text-3xl font-bold text-white">{merchants.total}</p>
            <p className="text-sm text-emerald-400 mt-1">+{merchants.newThisWeek} this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-medium text-blue-400">Verified</p>
            </div>
            <p className="text-3xl font-bold text-white">{merchants.verified}</p>
            <p className="text-sm text-blue-400 mt-1">Active & compliant</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-sm font-medium text-amber-400">Pending Review</p>
            </div>
            <p className="text-3xl font-bold text-white">{merchants.pending}</p>
            <p className="text-sm text-amber-400 mt-1">Awaiting verification</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-linear-to-br from-red-500/20 to-pink-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm font-medium text-red-400">Suspended</p>
            </div>
            <p className="text-3xl font-bold text-white">{merchants.suspended}</p>
            <p className="text-sm text-red-400 mt-1">Requires attention</p>
          </motion.div>
        </div>
      </div>

      {/* Transaction Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400" />
          Transaction Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-linear-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium text-purple-400">Total Volume (Inc. Bonuses)</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(transactions.totalVolume)}</p>
            <p className="text-sm text-purple-400 mt-1">{transactions.total.toLocaleString()} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">Settled (Inc. Bonuses)</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(transactions.settledVolume)}</p>
            <p className="text-sm text-emerald-400 mt-1">{transactions.settled.toLocaleString()} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-linear-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-sm font-medium text-amber-400">Pending</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(transactions.pendingVolume)}</p>
            <p className="text-sm text-amber-400 mt-1">{transactions.pending} transactions</p>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <Link href="/admin/audit" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.severity === "critical" ? "bg-red-500" :
                      activity.severity === "warning" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.details}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">{formatTimeAgo(activity.createdAt)}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/merchants">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <Store className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Merchant Management</h3>
            <p className="text-sm text-gray-400">Onboard, verify, and manage merchants</p>
          </motion.div>
        </Link>

        <Link href="/admin/transactions">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-linear-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <Receipt className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Transaction Monitor</h3>
            <p className="text-sm text-gray-400">View and manage all platform transactions</p>
          </motion.div>
        </Link>

        <Link href="/admin/audit">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-linear-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer"
          >
            <FileText className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Audit Logs</h3>
            <p className="text-sm text-gray-400">Review system activities and compliance logs</p>
          </motion.div>
        </Link>

        <Link href="/admin/settings">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            <Users className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Platform Settings</h3>
            <p className="text-sm text-gray-400">Configure system preferences</p>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}
