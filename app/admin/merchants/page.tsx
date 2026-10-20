"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { toast } from "sonner"
import { BusinessVerificationModal } from "@/components/business-verification-modal"
import { MerchantQRCodeModal } from "@/components/merchant-qr-modal"
import {
  Store, Search, Filter, Eye, UserX, UserCheck, X, Shield, Users,
  Mail, Calendar, TrendingUp, BanknoteIcon, Loader2, ChevronDown,
  CheckCircle, Clock, AlertCircle, Building2, Landmark, FileText, ExternalLink, QrCode, ArrowUpCircle, MoreHorizontal,
} from "lucide-react"
import {
  useAdminMerchants,
  useAdminMerchantDetails,
  useVerifyMerchant,
  useSuspendMerchant,
  useReactivateMerchant,
  useToggleTerminalStatus,
  useUpdateReferralStatus,
  useUpdateMerchantTier,
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
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [targetTier, setTargetTier] = useState<number>(2)
  const [showCacModal, setShowCacModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrMerchant, setQrMerchant] = useState<AdminMerchant | null>(null)
  const [qrTerminalId, setQrTerminalId] = useState<string | undefined>(undefined)
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
  const promoteTierMutation = useUpdateMerchantTier()

  const handleViewDetails = (merchant: AdminMerchant) => {
    setSelectedMerchant(merchant)
    setShowDetailsModal(true)
  }

  const handleViewQrCode = (merchant: AdminMerchant, terminalId?: string) => {
    setQrMerchant(merchant)
    setQrTerminalId(terminalId)
    setShowQrModal(true)
  }

  const handleOpenPromote = (merchant: AdminMerchant) => {
    const currentTier = merchant.tier ?? 0
    setSelectedMerchant(merchant)
    setTargetTier(currentTier === 0 ? 1 : 2)
    setShowPromoteModal(true)
  }

  const confirmPromoteTier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMerchant) return
    promoteTierMutation.mutate(
      { merchantId: selectedMerchant.id, tier: targetTier },
      {
        onSuccess: (res) => {
          toast.success(res.message || `Merchant promoted to Tier ${targetTier}`)
          setShowPromoteModal(false)
          refetch()
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to promote merchant tier")
        },
      }
    )
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
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 print:hidden"
      inert={showQrModal || undefined}
    >
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
            type="button"
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
                  type="button"
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
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Merchant</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transactions</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Volume</th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
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
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => handleViewDetails(merchant)}
                              className="text-white font-medium hover:text-emerald-400 transition-colors text-left truncate block"
                            >
                              {merchant.businessName}
                            </button>
                            <div className="text-gray-500 text-sm truncate">{merchant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                            merchant.accountType === 'enterprise' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {merchant.accountType === 'enterprise' ? (
                              <><Building2 className="w-3.5 h-3.5" aria-hidden="true" /> Enterprise</>
                            ) : (
                              <><Store className="w-3.5 h-3.5" aria-hidden="true" /> Merchant</>
                            )}
                          </div>
                          {(merchant.tier ?? 0) < 2 ? (
                            <button
                              type="button"
                              onClick={() => handleOpenPromote(merchant)}
                              className={`group inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                                merchant.tier === 1
                                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40"
                                  : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40"
                              }`}
                            >
                              <span>Tier {merchant.tier ?? 0}</span>
                              <ArrowUpCircle className="w-3 h-3 text-amber-400/80 group-hover:text-amber-300 transition-colors" aria-hidden="true" />
                              <span className="sr-only"> — Promote {merchant.businessName} to higher tier</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                              Tier 2 • Max
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(merchant.status)}`}>
                          {getStatusIcon(merchant.status)}
                          {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white whitespace-nowrap">{merchant.totalTransactions}</td>
                      <td className="px-6 py-4 text-emerald-400 font-medium whitespace-nowrap">{formatCurrency(merchant.totalVolume)}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">{formatDate(merchant.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(merchant)}
                            className="text-xs px-3 py-1.5 min-h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all font-medium inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>View</span>
                            <span className="sr-only"> details for {merchant.businessName}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleViewQrCode(merchant)}
                            className="p-2 min-w-8 min-h-8 rounded-lg bg-gray-800/80 text-teal-400 border border-gray-700/80 hover:bg-teal-500/15 hover:text-teal-300 hover:border-teal-500/30 transition-all inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
                          >
                            <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                            <span className="sr-only">View and print QR code for {merchant.businessName}</span>
                          </button>

                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button
                                type="button"
                                className="p-2 min-w-8 min-h-8 rounded-lg bg-gray-800/80 text-gray-400 border border-gray-700/80 hover:bg-gray-700 hover:text-white data-[state=open]:bg-gray-700 data-[state=open]:text-white data-[state=open]:border-gray-600 transition-all inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                              >
                                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                                <span className="sr-only">More actions for {merchant.businessName}</span>
                              </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                              <DropdownMenu.Content
                                align="end"
                                sideOffset={6}
                                collisionPadding={12}
                                className="z-50 w-56 rounded-xl bg-gray-900/95 backdrop-blur-md border border-gray-700/80 p-1.5 shadow-2xl text-gray-200 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
                              >
                                <div className="px-2.5 py-2 border-b border-gray-800/80 mb-1">
                                  <p className="text-xs font-bold text-white truncate">{merchant.businessName}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center justify-between">
                                    <span>Current Level</span>
                                    <span className="font-bold text-emerald-400 uppercase">
                                      Tier {merchant.tier ?? 0}{merchant.tier === 2 ? " • Max" : ""}
                                    </span>
                                  </p>
                                </div>

                                <DropdownMenu.Item
                                  onSelect={() => handleViewDetails(merchant)}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white outline-none cursor-pointer transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                                  <span>View Merchant Details</span>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                  onSelect={() => handleViewQrCode(merchant)}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white outline-none cursor-pointer transition-colors"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-teal-400 shrink-0" aria-hidden="true" />
                                  <span>View / Print QR Code</span>
                                </DropdownMenu.Item>

                                {((merchant.tier ?? 0) < 2 || !merchant.cacVerified) && (
                                  <>
                                    <DropdownMenu.Separator className="my-1 h-px bg-gray-800" />
                                    {(merchant.tier ?? 0) < 2 && (
                                      <DropdownMenu.Item
                                        onSelect={() => handleOpenPromote(merchant)}
                                        className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-amber-500/15 focus:bg-amber-500/15 outline-none cursor-pointer transition-colors"
                                      >
                                        <span className="flex items-center gap-2.5">
                                          <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                                          <span>Promote Business Tier</span>
                                        </span>
                                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                          Tier {(merchant.tier ?? 0) + 1}+
                                        </span>
                                      </DropdownMenu.Item>
                                    )}
                                    {!merchant.cacVerified && (
                                      <DropdownMenu.Item
                                        onSelect={() => {
                                          setSelectedMerchant(merchant)
                                          setShowCacModal(true)
                                        }}
                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-purple-300 hover:bg-purple-500/15 focus:bg-purple-500/15 outline-none cursor-pointer transition-colors"
                                      >
                                        <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" />
                                        <span>Verify CAC Document</span>
                                      </DropdownMenu.Item>
                                    )}
                                  </>
                                )}

                                <DropdownMenu.Separator className="my-1 h-px bg-gray-800" />

                                {merchant.status === "pending" && (
                                  <DropdownMenu.Item
                                    onSelect={() => handleVerify(merchant)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-blue-300 hover:bg-blue-500/15 focus:bg-blue-500/15 outline-none cursor-pointer transition-colors"
                                  >
                                    <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                                    <span>Approve &amp; Verify</span>
                                  </DropdownMenu.Item>
                                )}

                                {merchant.status === "verified" && (
                                  <DropdownMenu.Item
                                    onSelect={() => handleSuspend(merchant)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/15 focus:bg-red-500/15 outline-none cursor-pointer transition-colors"
                                  >
                                    <UserX className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
                                    <span>Suspend Merchant</span>
                                  </DropdownMenu.Item>
                                )}

                                {merchant.status === "suspended" && (
                                  <DropdownMenu.Item
                                    disabled={reactivateMutation.isPending}
                                    onSelect={() => handleReactivate(merchant)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/15 focus:bg-emerald-500/15 outline-none cursor-pointer transition-colors data-[disabled]:opacity-50"
                                  >
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                                    <span>Reactivate Merchant</span>
                                  </DropdownMenu.Item>
                                )}
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
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
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
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
        onVerifyCacClick={() => {
          setShowDetailsModal(false)
          setShowCacModal(true)
        }}
        onViewQrCode={(merchant, terminalId) => {
          handleViewQrCode(merchant, terminalId)
        }}
        onPromoteTierClick={(merchant) => {
          handleOpenPromote(merchant)
        }}
        onVerifyClick={(merchant) => {
          setShowDetailsModal(false)
          handleVerify(merchant)
        }}
        onSuspendClick={(merchant) => {
          setShowDetailsModal(false)
          handleSuspend(merchant)
        }}
      />

      {/* Promote Tier Modal */}
      <AnimatePresence>
        {showPromoteModal && selectedMerchant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPromoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-amber-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
                  <ArrowUpCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Promote Business Tier</h3>
                <p className="text-gray-400 text-sm">
                  Upgrade <span className="text-white font-semibold">{selectedMerchant.businessName}</span> from{" "}
                  <span className="text-amber-400 font-semibold">Tier {selectedMerchant.tier ?? 0}</span> to unlock higher settlement limits and features.
                </p>
              </div>

              <form onSubmit={confirmPromoteTier} className="space-y-6">
                <fieldset className="space-y-3">
                  <legend className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Select Target Tier
                  </legend>

                  {(selectedMerchant.tier ?? 0) < 1 && (
                    <label
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        targetTier === 1
                          ? "bg-blue-500/15 border-blue-500/50 text-white"
                          : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="targetTier"
                        value={1}
                        checked={targetTier === 1}
                        onChange={() => setTargetTier(1)}
                        className="mt-1 accent-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">Tier 1</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            ₦500k Limit
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Increases daily settlement limit to ₦500,000, marks phone as verified, and unlocks Enterprise Terminals.
                        </p>
                      </div>
                    </label>
                  )}

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      targetTier === 2
                        ? "bg-emerald-500/15 border-emerald-500/50 text-white"
                        : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetTier"
                      value={2}
                      checked={targetTier === 2}
                      onChange={() => setTargetTier(2)}
                      className="mt-1 accent-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Tier 2 • Max Tier</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Unlimited
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Unlocks unlimited settlements, marks KYC &amp; CAC as verified, and enables referral code generation.
                      </p>
                    </div>
                  </label>
                </fieldset>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPromoteModal(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-white border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={promoteTierMutation.isPending}
                    className="flex-1 py-3 rounded-xl font-semibold bg-amber-500 text-gray-950 hover:bg-amber-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {promoteTierMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Promote to Tier {targetTier}
                  </button>
                </div>
              </form>
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

      {/* CAC Verification Modal */}
      <BusinessVerificationModal
        isOpen={showCacModal}
        onClose={() => setShowCacModal(false)}
        onVerified={() => {
          refetch()
        }}
        merchantId={selectedMerchant?.id}
        isAdmin={true}
      />
    </motion.div>

    {/* Merchant QR Code Modal (rendered outside print:hidden and Framer Motion transform wrapper so print layout fills full A4 page) */}
    <MerchantQRCodeModal
      isOpen={showQrModal}
      onClose={() => {
        setShowQrModal(false)
        setQrTerminalId(undefined)
      }}
      merchant={qrMerchant}
      initialTerminalId={qrTerminalId}
    />
    </>
  )
}

function AdminMerchantDetailsModal({ 
  isOpen, 
  onClose, 
  merchantId,
  onVerifyCacClick,
  onViewQrCode,
  onPromoteTierClick,
  onVerifyClick,
  onSuspendClick,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  merchantId: string;
  onVerifyCacClick: () => void;
  onViewQrCode: (merchant: AdminMerchant, terminalId?: string) => void;
  onPromoteTierClick: (merchant: AdminMerchant) => void;
  onVerifyClick: (merchant: AdminMerchant) => void;
  onSuspendClick: (merchant: AdminMerchant) => void;
}) {
  const { data: merchant, isLoading } = useAdminMerchantDetails(merchantId);
  const toggleTerminalStatus = useToggleTerminalStatus();
  const updateReferralStatus = useUpdateReferralStatus();
  const [activeTab, setActiveTab] = useState<"info" | "branches" | "terminals" | "transactions" | "referrals">("info");

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
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        merchant.tier === 2
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : merchant.tier === 1
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}>
                        Tier {merchant.tier ?? 0}{merchant.tier === 2 ? " • Max" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-800 bg-gray-900/30">
              {[
                { id: "info", label: "Business Info", icon: Landmark },
                { id: "branches", label: "Branches", icon: Building2, count: merchant?.branches?.length },
                { id: "terminals", label: "Terminals", icon: Landmark, count: merchant?.terminals?.length },
                { id: "referrals", label: "Referrals", icon: Users },
                { id: "transactions", label: "Recent Activity", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
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
                        <SectionHeader title="Account Tier & Settlement Limit" icon={ArrowUpCircle} />
                        <div className="p-4 bg-gray-800/20 border border-gray-700 rounded-xl flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                              merchant.tier === 2
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                : merchant.tier === 1
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                                : "bg-gray-800 text-gray-400 border border-gray-700"
                            }`}>
                              Tier {merchant.tier ?? 0}{merchant.tier === 2 ? " • Max" : ""}
                            </span>
                            <div>
                              <div className="text-white font-bold text-sm">
                                {merchant.tier === 2
                                  ? "Unlimited Daily Settlement Limit"
                                  : merchant.tier === 1
                                  ? "₦500,000 Daily Settlement Limit"
                                  : "₦200,000 Daily Settlement Limit"}
                              </div>
                              <div className="text-gray-500 text-xs mt-0.5">
                                {merchant.tier === 2
                                  ? "Full KYC & CAC verified • Maximum tier unlocked"
                                  : merchant.tier === 1
                                  ? "Business setup & phone verified • Promote to Tier 2 for unlimited settlements"
                                  : "Email verified • Promote to Tier 1 or Tier 2 to raise limits"}
                              </div>
                            </div>
                          </div>
                          {(merchant.tier ?? 0) < 2 && (
                            <button
                              type="button"
                              onClick={() => onPromoteTierClick(merchant)}
                              className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" /> Promote Tier
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                          <SectionHeader title="KYC Documents" icon={Shield} />
                          {merchant.cacVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3 text-emerald-400" /> Verified
                            </span>
                          ) : (
                            <div className="flex gap-2 items-center">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <Clock className="w-3 h-3 text-amber-400" /> Unverified
                              </span>
                              <button 
                                type="button"
                                onClick={onVerifyCacClick}
                                className="text-xs px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-bold"
                              >
                                Submit CAC
                              </button>
                            </div>
                          )}
                        </div>
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
                      
                      <div className="md:col-span-2 space-y-4">
                        <SectionHeader title="Referrals Status" icon={Users} />
                        <div className="p-4 bg-gray-800/20 border border-gray-700 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-white font-bold">Referral Status</div>
                            <div className="text-gray-500 text-sm mt-1">
                              {merchant.referralStatus === 'suspended' ? 'Suspended by Admin' : 'Active and earning'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateReferralStatus.mutate({ 
                              merchantId: merchant.id, 
                              status: merchant.referralStatus === 'suspended' ? 'active' : 'suspended' 
                            })}
                            disabled={updateReferralStatus.isPending}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                              merchant.referralStatus === 'suspended'
                                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            }`}
                          >
                            {updateReferralStatus.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                             merchant.referralStatus === 'suspended' ? "Activate Referrals" : "Suspend Referrals"}
                          </button>
                        </div>
                      </div>
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
                                  <div>
                                    <h4 className="text-white text-sm font-bold">{terminal.name}</h4>
                                    {terminal.branchName && (
                                      <p className="text-[10px] text-gray-400">{terminal.branchName}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onViewQrCode(merchant, terminal.id)}
                                    className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-all flex items-center gap-1"
                                    title="View and print terminal QR code"
                                  >
                                    <QrCode className="w-3 h-3" /> QR Code
                                  </button>
                                  <button
                                    type="button"
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

                  {activeTab === "referrals" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-800/40 border border-gray-800 rounded-xl">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Referral Code</p>
                          <p className="text-xl font-mono font-bold text-white">{merchant.referralCode || "N/A"}</p>
                        </div>
                        <div className="p-4 bg-gray-800/40 border border-gray-800 rounded-xl">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Referral Balance</p>
                          <p className="text-xl font-bold text-emerald-400">{formatCurrency(merchant.referralBalance || 0)}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <SectionHeader title="Referred Merchants" icon={Users} />
                        <div className="p-4 bg-gray-800/20 border border-dashed border-gray-700 rounded-xl text-center text-gray-500 text-sm italic">
                          Referral tracking list coming soon in v2 update (individual referee data)
                        </div>
                      </div>
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
              <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  {merchant.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => onVerifyClick(merchant)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all text-xs font-bold flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" aria-hidden="true" /> Approve &amp; Verify
                    </button>
                  )}
                  {merchant.status === "verified" && (
                    <button
                      type="button"
                      onClick={() => onSuspendClick(merchant)}
                      className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-bold flex items-center gap-2"
                    >
                      <UserX className="w-4 h-4" aria-hidden="true" /> Suspend Merchant
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onViewQrCode(merchant)}
                    className="px-4 py-2.5 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-all text-xs font-bold flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" aria-hidden="true" /> QR Code
                  </button>
                  {(merchant.tier ?? 0) < 2 && (
                    <button
                      type="button"
                      onClick={() => onPromoteTierClick(merchant)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all text-xs font-bold flex items-center gap-2"
                    >
                      <ArrowUpCircle className="w-4 h-4" aria-hidden="true" /> Promote Tier
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
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
