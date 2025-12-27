"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  TrendingUp,
  DollarSign,
  Users,
  QrCode,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { PAYMENT_STATUS, FEE_CONFIG } from "@/lib/constants"

const mockStats = {
  totalReceived: 2450000,
  totalIncentives: 12500,
  totalTransactions: 25,
  pendingPayments: 2,
}

const mockRecentTransactions = [
  { id: "TXN001", amount: 150000, incentive: 500, status: "Settled", customerRef: "Table 5", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "TXN002", amount: 85000, incentive: 500, status: "Processing", customerRef: "Walk-in", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "TXN003", amount: 220000, incentive: 500, status: "Settled", customerRef: "Table 12", timestamp: new Date(Date.now() - 1000 * 60 * 120) },
  { id: "TXN004", amount: 45000, incentive: 500, status: "AwaitingCrypto", customerRef: "Delivery", timestamp: new Date(Date.now() - 1000 * 60 * 180) },
]

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)
const formatTime = (date: Date) => {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return date.toLocaleDateString()
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")

  const statCards = [
    { title: "Total Received", value: formatCurrency(mockStats.totalReceived), change: "+12.5%", icon: DollarSign },
    { title: "Incentives Earned", value: formatCurrency(mockStats.totalIncentives), subtitle: `₦${FEE_CONFIG.merchantIncentive} per transaction`, icon: TrendingUp },
    { title: "Total Transactions", value: mockStats.totalTransactions.toString(), change: "+8", icon: Users },
    { title: "Pending Payments", value: mockStats.pendingPayments.toString(), subtitle: "Awaiting confirmation", icon: Clock },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, Demo Restaurant</p>
        </div>
        <Link href="/dashboard/qr-code">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button flex items-center gap-2">
            <QrCode className="w-5 h-5" /> View QR Code
          </motion.button>
        </Link>
      </div>

      <div className="flex gap-2">
        {(["today", "week", "month"] as const).map((range) => (
          <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${timeRange === range ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10"><Icon className="w-5 h-5 text-emerald-400" /></div>
                {stat.change && <span className="flex items-center text-sm font-medium text-emerald-400"><TrendingUp className="w-4 h-4 mr-1" />{stat.change}</span>}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.subtitle || stat.title}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/qr-code">
              <motion.div whileHover={{ scale: 1.02, x: 4 }} className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer group">
                <div className="flex items-center gap-3"><QrCode className="w-5 h-5 text-emerald-400" /><span className="text-white font-medium">Download QR Code</span></div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.div>
            </Link>
            <Link href="/dashboard/transactions">
              <motion.div whileHover={{ scale: 1.02, x: 4 }} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer group">
                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-gray-400" /><span className="text-white font-medium">View All Transactions</span></div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.div>
            </Link>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 font-medium mb-1">💰 Merchant Incentive</p>
            <p className="text-sm text-gray-400">You earn <span className="text-white font-semibold">₦{FEE_CONFIG.merchantIncentive}</span> bonus on every successful payment!</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-sm text-emerald-400 hover:text-emerald-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockRecentTransactions.map((tx) => {
              const statusConfig = PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS]
              return (
                <motion.div key={tx.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === "Settled" ? "bg-emerald-500/20" : tx.status === "Processing" ? "bg-purple-500/20" : "bg-amber-500/20"}`}>
                      {tx.status === "Settled" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : tx.status === "Processing" ? <Clock className="w-5 h-5 text-purple-400" /> : <AlertCircle className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <p className="text-white font-medium">{formatCurrency(tx.amount)}</p>
                      <p className="text-sm text-gray-500">{tx.customerRef} • {formatTime(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>{statusConfig.label}</span>
                    {tx.status === "Settled" && <p className="text-xs text-emerald-400 mt-1">+₦{tx.incentive} bonus</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
