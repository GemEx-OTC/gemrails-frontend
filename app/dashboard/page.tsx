"use client"

import { useState, useEffect } from "react"
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
  Building2,
  MonitorDot
} from "lucide-react"
import { toast } from "sonner"
import { PAYMENT_STATUS, FEE_CONFIG } from "@/lib/constants"
import { SetupGuideWidget } from "@/components/setup-guide-widget"
import { PhoneVerificationModal } from "@/components/phone-verification-modal"
import { useAuth } from "@/context/auth-context"
import { useDashboard } from "@/lib/hooks/use-dashboard"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

const formatTime = (date: Date | string) => {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return d.toLocaleDateString()
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth()
  const { data, isLoading, error } = useDashboard()
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")
  const [showPhoneModal, setShowPhoneModal] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load dashboard data")
    }
  }, [error])

  const isEnterprise = user?.accountType === 'enterprise';
  const isBranchMod = user?.role === 'branch_mod';
  const dashboardData = data;
  const stats = dashboardData?.stats || {
    totalReceived: 0,
    totalIncentives: 0,
    totalTransactions: 0,
    pendingPayments: 0,
  };

  const statCards = [
    {
      title: "Total Received",
      value: data ? formatCurrency(stats.totalReceived || 0) : "-",
      change: "+0%",
      icon: DollarSign,
    },
    ...(isEnterprise && !isBranchMod ? [
      {
        title: "Total Branches",
        value: data ? (stats.branchCount || 0).toString() : "-",
        subtitle: "Active Branch locations",
        icon: Building2,
      },
      {
        title: "Total Terminals",
        value: data ? (stats.terminalCount || 0).toString() : "-",
        subtitle: "Active Terminals",
        icon: MonitorDot,
      }
    ] : []),
    ...(isBranchMod ? [
      {
        title: "Staff Terminals",
        value: data ? (stats.terminalCount || 0).toString() : "-",
        subtitle: "In this branch",
        icon: MonitorDot,
      }
    ] : []),
    ...(!isEnterprise && !isBranchMod ? [
      {
        title: "Incentives Earned",
        value: data ? formatCurrency(stats.totalIncentives || 0) : "-",
        subtitle: `₦${FEE_CONFIG.merchantIncentive} per transaction`,
        icon: TrendingUp,
      }
    ] : []),
    {
      title: "Total Transactions",
      value: data ? (stats.totalTransactions || 0).toString() : "-",
      change: "+0",
      icon: Users,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Setup Guide Widget */}
      {!isBranchMod && (
        <SetupGuideWidget
          userRole={user?.role}
          accountType={user?.accountType}
          phoneVerified={dashboardData?.user?.phoneVerified ?? user?.phoneVerified}
          bankAdded={dashboardData?.user?.isBankAdded ?? (isEnterprise ? true : !!user?.bankAccount?.accountNumber)}
          cacVerified={dashboardData?.user?.cacVerified ?? (user as any)?.cacVerified}
          tier={dashboardData?.user?.tier ?? (user as any)?.tier}
          settledVolume={dashboardData?.user?.settledVolume}
          tierLimit={dashboardData?.user?.tierLimit}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isBranchMod ? "Branch Manager" : "Dashboard"}
          </h1>
          <p className="text-gray-400 mt-1">
            Welcome back, <span className="text-white font-medium">{user?.businessName || (isBranchMod ? "Moderator" : "Merchant")}</span>
            {!isBranchMod && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                Tier {dashboardData?.user?.tier ?? (user as any)?.tier}
              </span>
            )}
          </p>
        </div>
        <Link href={isEnterprise ? "/dashboard/enterprise/branches" : "/dashboard/qr-code"}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button flex items-center gap-2">
            {isEnterprise ? (
              <>
                <Building2 className="w-5 h-5" /> Manage Branches
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5" /> View QR Code
              </>
            )}
          </motion.button>
        </Link>
      </div>

      <div className="flex gap-2">
        {(["today", "week", "month"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeRange === range
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon as any
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                {stat.change && (
                  <span className="flex items-center text-sm font-medium text-emerald-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.subtitle || stat.title}</p>
            </motion.div>
          )
        })}

        {/* Volume Limit Indicator for Tier 1 */}
        {dashboardData?.user?.tier === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-linear-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl lg:col-span-1 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Settlement Limit</span>
                <span className="text-xs font-mono text-gray-400">
                  {Math.round(((dashboardData.user.settledVolume || 0) / (dashboardData.user.tierLimit || 500000)) * 100)}%
                </span>
              </div>
              <p className="text-xl font-bold text-white mb-2">
                {formatCurrency(dashboardData.user.settledVolume || 0)}
                <span className="text-gray-500 text-sm font-normal"> / {formatCurrency(dashboardData.user.tierLimit || 500000)}</span>
              </p>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((dashboardData.user.settledVolume || 0) / (dashboardData.user.tierLimit || 500000)) * 100)}%` }}
                  className={`h-full ${((dashboardData.user.settledVolume || 0) / (dashboardData.user.tierLimit || 500000)) > 0.8 ? 'bg-red-500' : 'bg-amber-500'}`}
                />
              </div>
              <Link href="/dashboard/verification" className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 mt-3 font-semibold uppercase tracking-wider">
                Upgrade for unlimited <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 p-5 bg-gray-900/50 border border-gray-800 rounded-xl"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/qr-code">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center mb-2 justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Download QR Code</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.div>
            </Link>
            <Link href="/dashboard/transactions">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium">View All Transactions</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.div>
            </Link>
          </div>
          <div className="mt-6 p-4 bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-emerald-400 font-medium mb-1">💰 Merchant Incentive</p>
            <p className="text-sm text-gray-400">
              You earn <span className="text-white font-semibold">₦{FEE_CONFIG.merchantIncentive}</span> bonus on every
              successful payment!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 p-5 bg-gray-900/50 border border-gray-800 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
              dashboardData.recentTransactions.map((tx: any) => {
                const statusConfig = PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS] || PAYMENT_STATUS.Initiated
                return (
                  <motion.div
                    key={tx.id}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.status === "Settled"
                            ? "bg-emerald-500/20"
                            : tx.status === "Processing"
                              ? "bg-purple-500/20"
                              : "bg-amber-500/20"
                        }`}
                      >
                        {tx.status === "Settled" ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : tx.status === "Processing" ? (
                          <Clock className="w-5 h-5 text-purple-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{formatCurrency(tx.amount)}</p>
                        <p className="text-sm text-gray-500">
                          {tx.customerRef} • {formatTime(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                      {tx.status === "Settled" && <p className="text-xs text-emerald-400 mt-1">+₦{tx.incentive} bonus</p>}
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onVerified={() => {
          setShowPhoneModal(false);
          refreshUser();
        }}
        initialPhone={user?.phone}
        userHasPhone={!!user?.phone}
      />
    </motion.div>
  )
}
