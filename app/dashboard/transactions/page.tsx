"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, CheckCircle, Clock, AlertCircle, XCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { PAYMENT_STATUS } from "@/lib/constants"
import { useTransactions, useTransaction } from "@/lib/hooks/use-dashboard"

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
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useTransactions({
    page,
    limit: 20,
    status: statusFilter,
    search: debouncedSearch,
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
  const stats = (data as any)?.stats || { totalSettled: 0, totalIncentives: 0, totalTransactions: 0, successRate: 0 }
  const pagination = (data as any)?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">View and manage your payment history</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button-outline flex items-center gap-2">
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
          <p className="text-sm text-gray-400 mb-1">Success Rate</p>
          <p className="text-xl font-bold text-white">{Math.round(stats.successRate)}%</p>
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
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="gemrails-select w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="Settled">Settled</option>
          <option value="Processing">Processing</option>
          <option value="AwaitingCrypto">Awaiting Crypto</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-4 gap-4 p-4 bg-gray-800/50 border-b border-gray-800 text-sm font-medium text-gray-400">
          <div>TX Reference</div>
          <div>Amount</div>
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
                  <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                    <div className="text-white font-mono text-sm">{tx.transactionId || tx.id}</div>
                    <div>
                      <p className="text-white font-medium">
                        {formatCurrency(tx.status === "Settled" ? tx.amount + (tx.incentive || 100) : tx.amount)}
                      </p>
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
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {detailsLoading || !selectedTxDetails ? (
                <div className="p-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                    <button onClick={() => setSelectedTxId(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-center">
                      {(() => {
                        const txDetails = selectedTxDetails as any
                        const StatusIcon = statusIcons[txDetails.status as keyof typeof statusIcons] || statusIcons.Initiated
                        const statusColor = statusColors[txDetails.status as keyof typeof statusColors] || statusColors.Initiated
                        return (
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
                            <StatusIcon className="w-5 h-5" />
                            {PAYMENT_STATUS[txDetails.status as keyof typeof PAYMENT_STATUS]?.label || txDetails.status}
                          </span>
                        )
                      })()}
                    </div>
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-white">{formatCurrency((selectedTxDetails as any).amount)}</p>
                      {(selectedTxDetails as any).status === "Settled" && (
                        <p className="text-emerald-400 mt-1">+₦{(selectedTxDetails as any).incentive} incentive bonus</p>
                      )}
                    </div>
                    <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-gray-400">TX Reference</span>
                        <span className="text-white font-mono">{(selectedTxDetails as any).transactionId || (selectedTxDetails as any).id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Initiated</span>
                        <span className="text-white">
                          {formatDate((selectedTxDetails as any).createdAt || (selectedTxDetails as any).timestamp)}
                        </span>
                      </div>
                      {(selectedTxDetails as any).settledAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Settled</span>
                          <span className="text-white">{formatDate((selectedTxDetails as any).settledAt)}</span>
                        </div>
                      )}
                      {(selectedTxDetails as any).failReason && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Failure Reason</span>
                          <span className="text-red-400">{(selectedTxDetails as any).failReason}</span>
                        </div>
                      )}
                    </div>

                    {(selectedTxDetails as any).status === "Settled" && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-emerald-400 font-medium mb-2">Settlement Breakdown</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Original Amount</span>
                            <span className="text-white">{formatCurrency((selectedTxDetails as any).amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Merchant Incentive</span>
                            <span className="text-emerald-400">
                              +{formatCurrency((selectedTxDetails as any).merchantIncentive || (selectedTxDetails as any).incentive)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-emerald-500/20">
                            <span className="text-white font-medium">Total Received</span>
                            <span className="text-white font-bold">
                              {formatCurrency(
                                (selectedTxDetails as any).amount +
                                  ((selectedTxDetails as any).merchantIncentive || (selectedTxDetails as any).incentive)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
