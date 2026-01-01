"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Receipt, Search, Filter, Eye, X, ChevronDown,
  CheckCircle, Clock, AlertCircle, XCircle, ArrowUpRight,
} from "lucide-react"

type TxStatus = "all" | "Settled" | "Processing" | "AwaitingCrypto" | "Failed"

interface Transaction {
  id: string
  merchantName: string
  amount: number
  cryptoAmount: number
  cryptoAsset: string
  network: string
  incentive: number
  status: string
  customerRef: string
  timestamp: string
}

// Mock data
const mockTransactions: Transaction[] = [
  { id: "TXN001", merchantName: "Demo Restaurant", amount: 150000, cryptoAmount: 96.15, cryptoAsset: "USDT", network: "TRC20", incentive: 50, status: "Settled", customerRef: "Table 5", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "TXN002", merchantName: "Lagos Cafe", amount: 85000, cryptoAmount: 54.49, cryptoAsset: "USDC", network: "BSC", incentive: 50, status: "Processing", customerRef: "Walk-in", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "TXN003", merchantName: "Tech Store NG", amount: 220000, cryptoAmount: 141.03, cryptoAsset: "USDT", network: "TRC20", incentive: 50, status: "Settled", customerRef: "Online Order", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: "TXN004", merchantName: "Demo Restaurant", amount: 45000, cryptoAmount: 28.85, cryptoAsset: "USDT", network: "BSC", incentive: 50, status: "AwaitingCrypto", customerRef: "Delivery", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "TXN005", merchantName: "Fashion Hub", amount: 320000, cryptoAmount: 205.13, cryptoAsset: "USDC", network: "TRC20", incentive: 50, status: "Settled", customerRef: "Event Booking", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "TXN006", merchantName: "Quick Mart", amount: 15000, cryptoAmount: 9.62, cryptoAsset: "USDT", network: "TRC20", incentive: 0, status: "Failed", customerRef: "Table 3", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

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
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customerRef.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  // Stats
  const totalVolume = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  const settledCount = mockTransactions.filter(tx => tx.status === "Settled").length
  const pendingCount = mockTransactions.filter(tx => ["Processing", "AwaitingCrypto"].includes(tx.status)).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Transaction Monitor</h1>
        <p className="text-gray-400 mt-1">View and manage all platform transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30">
          <p className="text-sm text-purple-400 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalVolume)}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30">
          <p className="text-sm text-emerald-400 mb-1">Settled</p>
          <p className="text-2xl font-bold text-white">{settledCount} transactions</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-white">{pendingCount} transactions</p>
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={() => { setStatusFilter(status); setFilterOpen(false) }}
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

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transaction</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Merchant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Crypto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-white font-mono font-medium">{tx.id}</div>
                    <div className="text-gray-500 text-sm">{tx.customerRef}</div>
                  </td>
                  <td className="px-6 py-4 text-white">{tx.merchantName}</td>
                  <td className="px-6 py-4">
                    <div className="text-emerald-400 font-medium">{formatCurrency(tx.amount)}</div>
                    {tx.incentive > 0 && <div className="text-emerald-500 text-xs">+{formatCurrency(tx.incentive)} bonus</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{tx.cryptoAmount} {tx.cryptoAsset}</div>
                    <div className="text-gray-500 text-sm">{tx.network}</div>
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

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No transactions found</p>
        </div>
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
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Transaction Details</h3>
                <button onClick={() => setSelectedTx(null)} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono font-bold">{selectedTx.id}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedTx.status)}`}>
                    {getStatusIcon(selectedTx.status)}
                    {selectedTx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Merchant</span>
                  <span className="text-white font-medium">{selectedTx.merchantName}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(selectedTx.amount)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Crypto</span>
                  <span className="text-white">{selectedTx.cryptoAmount} {selectedTx.cryptoAsset} ({selectedTx.network})</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Reference</span>
                  <span className="text-white">{selectedTx.customerRef}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white">{formatDate(selectedTx.timestamp)}</span>
                </div>
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
