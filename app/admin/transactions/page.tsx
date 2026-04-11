"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Receipt, Search, Filter, Eye, X, ChevronDown,
  CheckCircle, Clock, AlertCircle, XCircle, Loader2,
  FileText,
} from "lucide-react"
import { useAdminTransactions } from "@/lib/hooks/use-admin"
import { DateFilter } from "@/components/date-filter"
import { downloadCSV, formatTransactionsForExport } from "@/lib/utils/export"
import { toast } from "sonner"
import { Download } from "lucide-react"
import type { AdminTransaction } from "@/lib/api/types"

type TxStatus = "all" | "Settled" | "Processing" | "AwaitingCrypto" | "Failed"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TxStatus>("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [page, setPage] = useState(1)
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null)

  const { data, isLoading } = useAdminTransactions({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery || undefined,
    startDate,
    endDate,
    page,
    limit: 20,
  })

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export")
      return
    }
    const exportData = formatTransactionsForExport(transactions)
    downloadCSV(exportData, `admin_transactions_${new Date().toISOString().split('T')[0]}`)
    toast.success("Admin CSV export started")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Settled": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "Processing": return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "AwaitingCrypto": return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "Failed": return "bg-red-500/20 text-red-300 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Settled": return <CheckCircle className="w-3 h-3" />
      case "Processing": return <Clock className="w-3 h-3 animate-spin" />
      case "AwaitingCrypto": return <AlertCircle className="w-3 h-3" />
      case "Failed": return <XCircle className="w-3 h-3" />
      default: return null
    }
  }

  const transactions = data?.transactions || []
  const stats = data?.stats
  const pagination = data?.pagination

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction Monitor</h1>
          <p className="text-gray-400 mt-1">View and manage all platform transactions</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={handleExportCSV}
          className="bg-gray-900 border border-gray-800 text-gray-400 hover:text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" /> Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-linear-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30">
          <p className="text-sm text-purple-400 mb-1">Total Volume (Inc. Bonuses)</p>
          <p className="text-2xl font-bold text-white">{stats ? formatCurrency(stats.totalVolume) : "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30">
          <p className="text-sm text-emerald-400 mb-1">Settled</p>
          <p className="text-2xl font-bold text-white">{stats?.settledCount || 0} transactions</p>
        </div>
        <div className="p-4 rounded-xl bg-linear-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-white">{stats?.pendingCount || 0} transactions</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by ID, merchant, or reference..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            className="w-full bg-gray-900 border border-gray-800 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none"
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
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              statusFilter !== "all"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            {statusFilter === "all" ? "All Status" : statusFilter}
            <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden"
            >
              {(["all", "Settled", "Processing", "AwaitingCrypto", "Failed"] as TxStatus[]).map((status) => (
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
          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">TX Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Merchant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Crypto</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Risk Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Bank Account</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-mono font-medium">{tx.transactionId}</div>
                      </td>
                      <td className="px-6 py-4 text-white">{tx.merchantName}</td>
                      <td className="px-6 py-4">
                        <div className="text-emerald-400 font-medium">
                          {formatCurrency(tx.status === "Settled" && tx.incentive > 0 ? tx.amount + tx.incentive : tx.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{tx.cryptoAmount} {tx.cryptoAsset}</div>
                        <div className="text-gray-500 text-sm">{tx.network}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {tx.riskScore !== undefined ? (
                          <div className={`font-medium ${(tx.riskScore || 0) > 0.6 ? "text-red-400" : (tx.riskScore || 0) > 0.3 ? "text-amber-400" : "text-emerald-400"}`}>
                            {(tx.riskScore * 100).toFixed(1)}%
                            {tx.isBadFunds && <span className="ml-2 text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30 uppercase tracking-tighter">Flagged</span>}
                          </div>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {tx.payoutAccount ? (
                          <div className="text-sm">
                            <div className="text-white font-medium">{tx.payoutAccount.bankName}</div>
                            <div className="text-gray-500 font-mono text-[10px]">{tx.payoutAccount.accountNumber}</div>
                          </div>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(tx.timestamp)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} transactions)
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

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTx(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Transaction Details</h3>
                  <p className="text-gray-500 text-sm font-medium mt-1">Platform monitor overview</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-2 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center justify-between p-5 bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-500/70">Reference ID</p>
                    <span className="text-white font-mono font-bold text-lg">{selectedTx.transactionId}</span>
                  </div>
                  <div className="text-right space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-500/70">Payment Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedTx.status)}`}>
                      {getStatusIcon(selectedTx.status)}
                      {selectedTx.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Merchant Name</p>
                  <p className="text-white font-semibold">{selectedTx.merchantName}</p>
                </div>

                <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Timestamp</p>
                  <p className="text-white font-medium">{formatDate(selectedTx.timestamp)}</p>
                </div>

                <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">Final Amount (NGN)</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {formatCurrency(selectedTx.status === "Settled" && selectedTx.incentive > 0 ? selectedTx.amount + selectedTx.incentive : selectedTx.amount)}
                  </p>
                </div>

                <div className="p-4 bg-gray-800/40 border border-gray-800/50 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500/60 mb-2">Crypto Amount</p>
                  <div className="flex items-center gap-2">
                    <img src={`/icons/${selectedTx.cryptoAsset.toLowerCase()}.svg`} className="w-5 h-5" alt="" />
                    <p className="text-white font-bold">{selectedTx.cryptoAmount} <span className="text-gray-400 font-medium text-xs">({selectedTx.network})</span></p>
                  </div>
                </div>

                {selectedTx.riskScore !== undefined && (
                  <div className={`md:col-span-2 flex items-center justify-between p-5 rounded-2xl border ${selectedTx.isBadFunds ? "bg-red-500/10 border-red-500/30" : "bg-gray-800/40 border-gray-800/50"}`}>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Blockchain Compliance</p>
                      <p className="text-sm font-medium text-white">AMLBot Risk Assessment</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${(selectedTx.riskScore || 0) > 0.6 ? "text-red-400" : (selectedTx.riskScore || 0) > 0.3 ? "text-amber-400" : "text-emerald-400"}`}>
                        {(selectedTx.riskScore * 100).toFixed(1)}%
                      </p>
                      {selectedTx.isBadFunds && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter mt-1">⚠️ High Risk Activity</p>}
                    </div>
                  </div>
                )}

                {selectedTx.amlReportUrl && (
                  <a
                    href={selectedTx.amlReportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:col-span-2 flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-800/80 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-white font-bold">AML Verification Report</p>
                        <p className="text-emerald-500/60 font-medium text-xs uppercase tracking-wide">Download Official PDF</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-800 text-emerald-400 group-hover:translate-x-1 transition-transform">
                      <ChevronDown className="w-5 h-5 -rotate-90" />
                    </div>
                  </a>
                )}

                {selectedTx.payoutAccount && (
                  <div className="md:col-span-2 p-5 bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500/60 mb-4">Settlement Destination</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Bank Name</p>
                        <p className="text-white font-bold text-sm tracking-tight">{selectedTx.payoutAccount.bankName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Account Number</p>
                        <p className="text-white font-mono font-bold text-sm">{selectedTx.payoutAccount.accountNumber}</p>
                      </div>
                      <div className="space-y-1 col-span-2 lg:col-span-1">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Account Holder</p>
                        <p className="text-white font-bold text-sm truncate">{selectedTx.payoutAccount.accountName}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTx(null)}
                className="w-full mt-6 py-3 rounded-xl font-semibold text-white border border-gray-700 hover:border-emerald-500 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
