"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, CheckCircle, Clock, AlertCircle, XCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { PAYMENT_STATUS } from "@/lib/constants"
import { useTransactions, useTransaction } from "@/lib/hooks/use-dashboard"
import { DateFilter } from "@/components/date-filter"
import { downloadCSV, formatTransactionsForExport } from "@/lib/utils/export"
import { ChevronDown, Filter } from "lucide-react"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

const statusIcons = {
  Settled: CheckCircle,
  Processing: Clock,
  AwaitingCrypto: AlertCircle,
  CryptoReceived: Clock,
  Initiated: Clock,
  Failed: XCircle,
}
const statusColors = {
  Settled: "text-emerald-400 bg-emerald-500/20",
  Processing: "text-purple-400 bg-purple-500/20",
  AwaitingCrypto: "text-amber-400 bg-amber-500/20",
  CryptoReceived: "text-blue-400 bg-blue-500/20",
  Initiated: "text-gray-400 bg-gray-500/20",
  Failed: "text-red-400 bg-red-500/20",
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useTransactions({
    page,
    limit: 20,
    status: statusFilter,
    search: debouncedSearch,
    startDate,
    endDate,
  })

  const { data: selectedTxDetails, isLoading: detailsLoading } = useTransaction(selectedTxId || "")

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load transactions")
    }
  }, [error])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const transactions = (data as any)?.transactions || []
  const stats = (data as any)?.stats || { totalSettled: 0, totalIncentives: 0, totalTransactions: 0, settledCount: 0 }
  const pagination = (data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 }

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export")
      return
    }
    const exportData = formatTransactionsForExport(transactions)
    downloadCSV(exportData, `transactions_${new Date().toISOString().split('T')[0]}`)
    toast.success("CSV export started")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">View and manage your payment history</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={handleExportCSV}
          className="gemrails-button-outline flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> Export CSV
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Total Settled</p>
          <p className="text-xl font-bold text-white">{formatCurrency(stats.totalSettled)}</p>
        </div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Incentives Earned</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.totalIncentives)}</p>
        </div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Total Transactions</p>
          <p className="text-xl font-bold text-white">{stats.totalTransactions}</p>
        </div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Settlements</p>
          <p className="text-xl font-bold text-white">{stats.settledCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or reference..."
            className="gemrails-input-icon"
          />
        </div>
        
        <DateFilter 
          startDate={startDate}
          endDate={endDate}
          onStartChange={(d) => { setStartDate(d); setPage(1) }}
          onEndChange={(d) => { setEndDate(d); setPage(1) }}
          onClear={() => { setStartDate(""); setEndDate(""); setPage(1) }}
        />

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all w-full sm:w-auto ${
              statusFilter !== "all"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter === "all" ? "All Status" : statusFilter}
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                {["all", "Settled", "Processing", "AwaitingCrypto"].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setFilterOpen(false); setPage(1) }}
                    className={`w-full px-4 py-3 text-left text-sm transition-all ${
                      statusFilter === status ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {status === "all" ? "All Status" : status}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {filterOpen && <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />}

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-800/50 border-b border-gray-800 text-sm font-medium text-gray-400">
          <div>TX Reference</div>
          <div>Amount</div>
          <div>Settlement Bank</div>
          <div>Status</div>
          <div>Date</div>
        </div>
        <div className="divide-y divide-gray-800">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            </div>
          ) : (
            transactions.map((tx: any) => {
              const StatusIcon = statusIcons[tx.status as keyof typeof statusIcons] || Clock
              const statusColor = statusColors[tx.status as keyof typeof statusColors] || statusColors.Initiated
              return (
                <motion.div
                  key={tx.id}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  onClick={() => setSelectedTxId(tx.id)}
                  className="p-4 cursor-pointer"
                >
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">
                        {formatCurrency(tx.status === "Settled" ? tx.amount + (tx.incentive || 100) : tx.amount)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS]?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-mono">{tx.transactionId || tx.id}</span>
                      <span className="text-gray-500">{formatDate(tx.timestamp)}</span>
                    </div>
                  </div>
                  <div className="hidden md:grid grid-cols-5 gap-4 items-center">
                    <div className="text-white font-mono text-sm group-hover:text-emerald-400 transition-colors">
                      {tx.transactionId || tx.id}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {formatCurrency(tx.status === "Settled" ? tx.amount + (tx.incentive || 100) : tx.amount)}
                      </p>
                    </div>
                    <div>
                      {tx.payoutAccount ? (
                        <div className="text-sm">
                          <p className="text-white text-xs truncate">{tx.payoutAccount.bankName}</p>
                          <p className="text-gray-500 text-[10px] font-mono">{tx.payoutAccount.accountNumber}</p>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS]?.label}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm">{formatDate(tx.timestamp)}</div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
        {!isLoading && transactions.length === 0 && (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-gray-800/20">
            <p className="text-sm text-gray-400">
              Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTxId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTxId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {detailsLoading || !selectedTxDetails ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-800/20">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">Transaction Details</h3>
                      <p className="text-gray-500 text-xs mt-1">Confirmed settlement summary</p>
                    </div>
                    <button onClick={() => setSelectedTxId(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-6 bg-linear-to-b from-gray-800/50 to-transparent rounded-2xl border border-gray-800/50 mb-2">
                       {(() => {
                        const txDetails = selectedTxDetails as any
                        const StatusIcon = statusIcons[txDetails.status as keyof typeof statusIcons] || statusIcons.Initiated
                        const statusColor = statusColors[txDetails.status as keyof typeof statusColors] || statusColors.Initiated
                        return (
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-current/20 mb-4 ${statusColor}`}>
                            <StatusIcon className="w-4 h-4" />
                            {PAYMENT_STATUS[txDetails.status as keyof typeof PAYMENT_STATUS]?.label || txDetails.status}
                          </span>
                        )
                      })()}
                      <p className="text-4xl font-black text-white">{formatCurrency((selectedTxDetails as any).amount)}</p>
                      {(selectedTxDetails as any).status === "Settled" && (
                        <p className="text-emerald-400 text-sm font-bold mt-2 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> +₦{(selectedTxDetails as any).incentive} settlement bonus
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">TX Reference</p>
                      <p className="text-white font-mono font-bold text-sm tracking-tighter">{(selectedTxDetails as any).transactionId || (selectedTxDetails as any).id}</p>
                    </div>

                    <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Initiated Date</p>
                      <p className="text-white font-bold text-sm">
                        {formatDate((selectedTxDetails as any).createdAt || (selectedTxDetails as any).timestamp)}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">Transfer Amount</p>
                      <p className="text-white font-bold">{formatCurrency((selectedTxDetails as any).amount)}</p>
                    </div>

                    <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">Merchant Incentive</p>
                      <p className="text-emerald-400 font-bold">{formatCurrency((selectedTxDetails as any).merchantIncentive || (selectedTxDetails as any).incentive || 0)}</p>
                    </div>

                    {(selectedTxDetails as any).payoutAccount && (
                      <div className="md:col-span-2 p-5 bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl mt-2">
                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500/60 mb-4">Payout Account Details</p>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Bank</p>
                            <p className="text-white font-bold text-sm">{(selectedTxDetails as any).payoutAccount.bankName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Account Number</p>
                            <p className="text-white font-mono font-bold text-sm">{(selectedTxDetails as any).payoutAccount.accountNumber}</p>
                          </div>
                          <div className="col-span-2 border-t border-emerald-500/10 pt-3">
                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Recipient Name</p>
                            <p className="text-white font-bold text-sm truncate">{(selectedTxDetails as any).payoutAccount.accountName}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {(selectedTxDetails as any).failReason && (
                      <div className="md:col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 mt-2">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-500 font-bold text-xs uppercase tracking-wider">Decline Reason</p>
                          <p className="text-red-400/90 text-sm mt-1">{(selectedTxDetails as any).failReason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedTxId(null)}
                      className="w-full py-3 rounded-xl font-bold text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 border border-gray-800 transition-all uppercase tracking-widest text-xs"
                    >
                      Close Summary
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
