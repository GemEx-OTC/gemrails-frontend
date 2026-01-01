"use client"

import { useState } from "react"
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
} from "lucide-react"

// Mock data - replace with API calls
const mockDashboard = {
  merchants: {
    total: 156,
    verified: 142,
    pending: 8,
    suspended: 6,
    newThisWeek: 12,
  },
  transactions: {
    total: 2847,
    totalVolume: 45680000,
    settled: 2756,
    settledVolume: 44200000,
    pending: 91,
    pendingVolume: 1480000,
  },
  recentActivity: [
    { id: "1", action: "Merchant Verified", details: "Demo Restaurant completed verification", severity: "info", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: "2", action: "Large Transaction", details: "₦500,000 payment processed for Lagos Cafe", severity: "info", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "3", action: "New Merchant", details: "Quick Mart registered and pending verification", severity: "warning", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    { id: "4", action: "Settlement Complete", details: "Batch settlement of 45 transactions completed", severity: "info", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  ],
}

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
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor platform health and merchant activity</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
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
            className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <p className="text-sm font-medium text-emerald-400">Total Merchants</p>
            </div>
            <p className="text-3xl font-bold text-white">{mockDashboard.merchants.total}</p>
            <p className="text-sm text-emerald-400 mt-1">+{mockDashboard.merchants.newThisWeek} this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-medium text-blue-400">Verified</p>
            </div>
            <p className="text-3xl font-bold text-white">{mockDashboard.merchants.verified}</p>
            <p className="text-sm text-blue-400 mt-1">Active & compliant</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-sm font-medium text-amber-400">Pending Review</p>
            </div>
            <p className="text-3xl font-bold text-white">{mockDashboard.merchants.pending}</p>
            <p className="text-sm text-amber-400 mt-1">Awaiting verification</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm font-medium text-red-400">Suspended</p>
            </div>
            <p className="text-3xl font-bold text-white">{mockDashboard.merchants.suspended}</p>
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
            className="p-5 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium text-purple-400">Total Volume</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(mockDashboard.transactions.totalVolume)}</p>
            <p className="text-sm text-purple-400 mt-1">{mockDashboard.transactions.total.toLocaleString()} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">Settled</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(mockDashboard.transactions.settledVolume)}</p>
            <p className="text-sm text-emerald-400 mt-1">{mockDashboard.transactions.settled.toLocaleString()} transactions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <p className="text-sm font-medium text-amber-400">Pending</p>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(mockDashboard.transactions.pendingVolume)}</p>
            <p className="text-sm text-amber-400 mt-1">{mockDashboard.transactions.pending} transactions</p>
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
        <div className="space-y-3">
          {mockDashboard.recentActivity.map((activity, idx) => (
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/merchants">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 hover:border-emerald-500/50 transition-all cursor-pointer"
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
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
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
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer"
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
            className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-500/50 transition-all cursor-pointer"
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
