"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Store, Search, Filter, Eye, UserX, UserCheck, X, Shield,
  Mail, Calendar, TrendingUp, BanknoteIcon, Loader2, ChevronDown,
  CheckCircle, Clock, AlertCircle, Building2, Landmark, FileText, ExternalLink,
} from "lucide-react"
import {
  useAdminMerchants,
  useAdminMerchantDetails,
  useVerifyMerchant,
  useSuspendMerchant,
  useReactivateMerchant,
  useToggleTerminalStatus,
} from "@/lib/hooks/use-admin"
import type { AdminMerchant, AdminMerchantDetails } from "@/lib/api/types"

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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
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
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                          merchant.accountType === 'enterprise' ? 'text-blue-400' : 'text-gray-400'
                        }`}>
                          {merchant.accountType === 'enterprise' ? (
                            <><Building2 className="w-3.5 h-3.5" /> Enterprise</>
                          ) : (
                            <><Store className="w-3.5 h-3.5" /> Merchant</>
                          )}
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
      <AdminMerchantDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        merchantId={selectedMerchant?.id || ""}
      />

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

function AdminMerchantDetailsModal({ 
  isOpen, 
  onClose, 
  merchantId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  merchantId: string 
}) {
  const { data: merchant, isLoading } = useAdminMerchantDetails(merchantId);
  const toggleTerminalStatus = useToggleTerminalStatus();
  const [activeTab, setActiveTab] = useState<"info" | "branches" | "terminals" | "transactions">("info");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Store className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {isLoading ? "Loading..." : merchant?.businessName}
                  </h3>
                  {!isLoading && merchant && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        merchant.status === "verified" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        merchant.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                        "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {merchant.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        {merchant.accountType === 'enterprise' ? (
                          <><Building2 className="w-3 h-3 text-blue-500" /> Enterprise</>
                        ) : (
                          <><Store className="w-3 h-3 text-emerald-500" /> Standard</>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-800 bg-gray-900/30">
              {[
                { id: "info", label: "Business Info", icon: Landmark },
                { id: "branches", label: "Branches", icon: Building2, count: merchant?.branches?.length },
                { id: "terminals", label: "Terminals", icon: Landmark, count: merchant?.terminals?.length },
                { id: "transactions", label: "Recent Activity", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all border-b-2 relative ${
                    activeTab === tab.id 
                      ? "text-emerald-400 border-emerald-500 bg-emerald-500/5" 
                      : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p>Fetching full merchant details...</p>
                </div>
              ) : !merchant ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                  <p>Unable to load details</p>
                </div>
              ) : (
                <>
                  {activeTab === "info" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-4">
                        <SectionHeader title="Contact Information" />
                        <InfoItem label="Contact Name" value={merchant.contactName} icon={UserCheck} />
                        <InfoItem label="Email Address" value={merchant.email} icon={Mail} />
                        <InfoItem label="Phone Number" value={merchant.phone} icon={TrendingUp} />
                      </div>
                      <div className="space-y-4">
                        <SectionHeader title="Business Details" />
                        <InfoItem label="Merchant ID" value={merchant.merchantId} icon={Shield} />
                        <InfoItem label="RC Number" value={merchant.rcNumber} icon={CheckCircle} />
                        <InfoItem label="Address" value={merchant.businessAddress} icon={Building2} />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <SectionHeader title="KYC Documents" icon={Shield} />
                        {merchant.cacDocumentUrl ? (
                          <div className="flex items-center justify-between p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-white font-bold text-sm">CAC Registration Document</div>
                                <div className="text-gray-500 text-[10px] mt-0.5">Uploaded via Merchant Dashboard</div>
                              </div>
                            </div>
                            <a 
                              href={`${process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL}${merchant.cacDocumentUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg text-xs font-bold transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View Document
                            </a>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-800/20 border border-dashed border-gray-700 rounded-xl text-center text-gray-500 text-sm">
                            No CAC document uploaded yet
                          </div>
                        )}
                      </div>
                      {merchant.accountType !== 'enterprise' && (
                        <div className="md:col-span-2 space-y-4">
                          <SectionHeader title="Settlement Account" icon={Landmark} />
                          {merchant.bankAccount ? (
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                              <div>
                                <div className="text-white font-bold">{merchant.bankAccount.bankName}</div>
                                <div className="text-gray-400 text-sm mt-1">
                                  {merchant.bankAccount.accountNumber} • {merchant.bankAccount.accountName}
                                </div>
                              </div>
                              {merchant.bankAccount.isVerified ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                                  <CheckCircle className="w-4 h-4" /> Verified
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase">
                                  <AlertCircle className="w-4 h-4" /> Pending Verification
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-800/20 border border-dashed border-gray-700 rounded-xl text-center text-gray-500 text-sm">
                              No bank account linked yet
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "branches" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {merchant.branches?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {merchant.branches.map((branch) => (
                            <div key={branch.id} className="p-5 bg-gray-800/40 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <Building2 className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-white font-bold text-lg">{branch.name}</h4>
                                    <p className="text-gray-500 text-xs mt-0.5">{branch.address}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-600 text-[10px]">Added {new Date(branch.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              
                              {branch.moderators && branch.moderators.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Branch Moderators ({branch.moderators.length})</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {branch.moderators.map((mod: any) => (
                                      <div key={mod.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50 border border-gray-800">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                          <UserCheck className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs font-bold text-white truncate">{mod.name}</p>
                                          <p className="text-[10px] text-gray-500 truncate">{mod.email}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                          <Building2 className="w-12 h-12 mb-3 opacity-20" />
                          <p>No branches created yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "terminals" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {merchant.terminals?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {merchant.terminals.map((terminal) => (
                            <div key={terminal.id} className="p-4 bg-gray-800/40 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-400">
                                    <Landmark className="w-3 h-3" />
                                  </div>
                                  <h4 className="text-white text-sm font-bold">{terminal.name}</h4>
                                </div>
                                <button
                                  onClick={() => toggleTerminalStatus.mutate({ terminalId: terminal.id, isActive: !terminal.isActive })}
                                  disabled={toggleTerminalStatus.isPending}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all hover:scale-105 active:scale-95 ${
                                    terminal.isActive 
                                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  }`}
                                >
                                  {toggleTerminalStatus.isPending && toggleTerminalStatus.variables?.terminalId === terminal.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    terminal.isActive ? "Active" : "Inactive"
                                  )}
                                </button>
                              </div>
                              <div className="text-[10px] text-gray-500 mb-2 font-mono">ID: {terminal.merchantId}</div>
                              {terminal.bankAccount && (
                                <div className="mt-2 pt-2 border-t border-gray-800">
                                  <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1">Payout Account</p>
                                  <p className="text-xs text-gray-300 truncate">{terminal.bankAccount.accountNumber} • {terminal.bankAccount.bankName}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                          <Landmark className="w-12 h-12 mb-3 opacity-20" />
                          <p>No terminals created yet</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "transactions" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {merchant.recentTransactions?.length > 0 ? (
                        <div className="space-y-2">
                          {merchant.recentTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/20 border border-gray-800 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  tx.status === "Settled" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                }`}>
                                  <TrendingUp className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white">₦{tx.totalAmount.toLocaleString()}</div>
                                  <div className="text-[10px] text-gray-500">{tx.transactionId} • {new Date(tx.timestamp).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                                tx.status === "Settled" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {tx.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                          <TrendingUp className="w-12 h-12 mb-3 opacity-20" />
                          <p>No recent transactions</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!isLoading && merchant && (
              <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  Close
                </button>
                <div className="h-10 w-px bg-gray-800 mx-2" />
                {merchant.status === "pending" && (
                  <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Verify Merchant
                  </button>
                )}
                {merchant.status === "verified" && (
                  <button className="px-6 py-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20 transition-all text-sm font-bold flex items-center gap-2">
                    <UserX className="w-4 h-4" /> Suspend Merchant
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon?: any }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-emerald-500" />}
      <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{title}</h5>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }: { label: string; value?: string; icon: any }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800/50 rounded-xl group hover:border-emerald-500/30 transition-all">
      <div className="p-1.5 bg-gray-800 rounded group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-gray-500 font-medium mb-0.5">{label}</div>
        <div className="text-sm text-white font-medium truncate">{value || 'Not provided'}</div>
      </div>
    </div>
  );
}
