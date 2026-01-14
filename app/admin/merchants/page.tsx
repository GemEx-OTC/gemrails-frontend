"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Store, Search, Filter, Eye, UserX, UserCheck, X, Shield,
  Mail, Calendar, TrendingUp, BanknoteIcon, Loader2, ChevronDown,
  CheckCircle, Clock, AlertCircle,
} from "lucide-react"
import {
  useAdminMerchants,
  useVerifyMerchant,
  useSuspendMerchant,
  useReactivateMerchant,
} from "@/lib/hooks/use-admin"
import type { AdminMerchant } from "@/lib/api/types"

type MerchantStatus = "all" | "verified" | "pending" | "suspended"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<MerchantStatus>("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedMerchant, setSelectedMerchant] = useState<AdminMerchant | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState("")

  const { data, isLoading, refetch } = useAdminMerchants({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
    page,
    limit: 20,
  })

  const verifyMutation = useVerifyMerchant()
  const suspendMutation = useSuspendMerchant()
  const reactivateMutation = useReactivateMerchant()

  const handleViewDetails = (merchant: AdminMerchant) => {
    setSelectedMerchant(merchant)
    setShowDetailsModal(true)
  }

  const handleSuspend = (merchant: AdminMerchant) => {
    setSelectedMerchant(merchant)
    setSuspendReason("")
    setShowSuspendModal(true)
  }

  const handleVerify = (merchant: AdminMerchant) => {
    setSelectedMerchant(merchant)
    setShowVerifyModal(true)
  }

  const confirmVerify = () => {
    if (!selectedMerchant) return
    verifyMutation.mutate(selectedMerchant.id, {
      onSuccess: () => {
        toast.success("Merchant verified successfully")
        setShowVerifyModal(false)
        refetch()
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to verify merchant")
      },
    })
  }

  const confirmSuspend = () => {
    if (!selectedMerchant || !suspendReason) return
    suspendMutation.mutate(
      { merchantId: selectedMerchant.id, reason: suspendReason },
      {
        onSuccess: () => {
          toast.success("Merchant suspended")
          setShowSuspendModal(false)
          refetch()
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to suspend merchant")
        },
      }
    )
  }

  const handleReactivate = (merchant: AdminMerchant) => {
    reactivateMutation.mutate(merchant.id, {
      onSuccess: () => {
        toast.success("Merchant reactivated")
        refetch()
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to reactivate merchant")
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "pending": return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "suspended": return "bg-red-500/20 text-red-300 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-3 h-3" />
      case "pending": return <Clock className="w-3 h-3" />
      case "suspended": return <AlertCircle className="w-3 h-3" />
      default: return null
    }
  }

  const merchants = data?.merchants || []
  const pagination = data?.pagination

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Merchant Management</h1>
        <p className="text-gray-400 mt-1">Onboard and manage platform merchants</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by business name or email..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              statusFilter !== "all"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              {(["all", "verified", "pending", "suspended"] as MerchantStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setFilterOpen(false); setPage(1) }}
                  className={`w-full px-4 py-3 text-left text-sm transition-all ${
                    statusFilter === status ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      {filterOpen && <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Merchants Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Merchant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transactions</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Volume</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((merchant) => (
                    <motion.tr
                      key={merchant.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Store className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{merchant.businessName}</div>
                            <div className="text-gray-500 text-sm">{merchant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(merchant.status)}`}>
                          {getStatusIcon(merchant.status)}
                          {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white">{merchant.totalTransactions}</td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">{formatCurrency(merchant.totalVolume)}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(merchant.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleViewDetails(merchant)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium flex items-center gap-1">
                            <Eye className="w-3 h-3" /> View
                          </button>
                          {merchant.status === "pending" && (
                            <button onClick={() => handleVerify(merchant)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all font-medium flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Verify
                            </button>
                          )}
                          {merchant.status === "verified" && (
                            <button onClick={() => handleSuspend(merchant)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all font-medium flex items-center gap-1">
                              <UserX className="w-3 h-3" /> Suspend
                            </button>
                          )}
                          {merchant.status === "suspended" && (
                            <button 
                              onClick={() => handleReactivate(merchant)}
                              disabled={reactivateMutation.isPending}
                              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <UserCheck className="w-3 h-3" /> Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {merchants.length === 0 && (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No merchants found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} merchants)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Merchant Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl mb-6">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Store className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-lg">{selectedMerchant.businessName}</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(selectedMerchant.status)}`}>
                    {getStatusIcon(selectedMerchant.status)}
                    {selectedMerchant.status.charAt(0).toUpperCase() + selectedMerchant.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Mail className="w-4 h-4" />Email</div>
                  <div className="text-white font-medium truncate">{selectedMerchant.email}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><Calendar className="w-4 h-4" />Joined</div>
                  <div className="text-white font-medium">{formatDate(selectedMerchant.createdAt)}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><TrendingUp className="w-4 h-4" />Transactions</div>
                  <div className="text-white font-medium">{selectedMerchant.totalTransactions}</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1"><BanknoteIcon className="w-4 h-4" />Volume</div>
                  <div className="text-emerald-400 font-medium">{formatCurrency(selectedMerchant.totalVolume)}</div>
                </div>
              </div>

              {selectedMerchant.bankAccount && (
                <div className="p-4 bg-gray-800/30 rounded-xl mb-6">
                  <div className="text-gray-500 text-sm mb-2">Bank Account</div>
                  <div className="text-white font-medium">{selectedMerchant.bankAccount.bankName}</div>
                  <div className="text-gray-400 text-sm">{selectedMerchant.bankAccount.accountNumber} - {selectedMerchant.bankAccount.accountName}</div>
                </div>
              )}

              <button onClick={() => setShowDetailsModal(false)} className="w-full py-3 rounded-xl font-semibold text-white border border-gray-700 hover:border-emerald-500 transition-all">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {showSuspendModal && selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuspendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-red-500 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                  <UserX className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Suspend Merchant</h3>
                <p className="text-gray-400">This will prevent {selectedMerchant.businessName} from receiving payments.</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Reason for suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full bg-gray-800 border border-gray-700 focus:border-red-500 text-white placeholder-gray-500 px-4 py-3 rounded-xl transition-all focus:outline-none resize-none h-24"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSuspendModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-white border border-gray-700 hover:border-gray-600 transition-all">
                  Cancel
                </button>
                <button 
                  onClick={confirmSuspend}
                  disabled={!suspendReason || suspendMutation.isPending}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {suspendMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Suspend
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify Modal */}
      <AnimatePresence>
        {showVerifyModal && selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVerifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-emerald-500 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Verify Merchant</h3>
                <p className="text-gray-400">Approve {selectedMerchant.businessName} to start accepting payments.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowVerifyModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-white border border-gray-700 hover:border-gray-600 transition-all">
                  Cancel
                </button>
                <button 
                  onClick={confirmVerify}
                  disabled={verifyMutation.isPending}
                  className="flex-1 py-3 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Approve Merchant
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
