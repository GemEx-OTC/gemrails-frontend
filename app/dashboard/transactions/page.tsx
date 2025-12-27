"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, CheckCircle, Clock, AlertCircle, XCircle, X } from "lucide-react"
import { PAYMENT_STATUS, FEE_CONFIG } from "@/lib/constants"

const mockTransactions = [
  { id: "TXN001", amount: 150000, cryptoAmount: 96.15, cryptoAsset: "USDT", incentive: 500, status: "Settled", customerRef: "Table 5", timestamp: new Date(Date.now() - 1000 * 60 * 30), settledAt: new Date(Date.now() - 1000 * 60 * 28) },
  { id: "TXN002", amount: 85000, cryptoAmount: 54.49, cryptoAsset: "USDC", incentive: 500, status: "Processing", customerRef: "Walk-in", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "TXN003", amount: 220000, cryptoAmount: 141.03, cryptoAsset: "USDT", incentive: 500, status: "Settled", customerRef: "Table 12", timestamp: new Date(Date.now() - 1000 * 60 * 120), settledAt: new Date(Date.now() - 1000 * 60 * 118) },
  { id: "TXN004", amount: 45000, cryptoAmount: 28.85, cryptoAsset: "USDT", incentive: 500, status: "AwaitingCrypto", customerRef: "Delivery", timestamp: new Date(Date.now() - 1000 * 60 * 180) },
  { id: "TXN005", amount: 320000, cryptoAmount: 205.13, cryptoAsset: "USDC", incentive: 500, status: "Settled", customerRef: "Event Booking", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), settledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 2) },
  { id: "TXN006", amount: 15000, cryptoAmount: 9.62, cryptoAsset: "USDT", incentive: 0, status: "Failed", customerRef: "Table 3", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), failReason: "Payment timeout" },
]

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount)
const formatDate = (date: Date) => date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

const statusIcons = { Settled: CheckCircle, Processing: Clock, AwaitingCrypto: AlertCircle, CryptoReceived: Clock, Initiated: Clock, Failed: XCircle }
const statusColors = { Settled: "text-emerald-400 bg-emerald-500/20", Processing: "text-purple-400 bg-purple-500/20", AwaitingCrypto: "text-amber-400 bg-amber-500/20", CryptoReceived: "text-blue-400 bg-blue-500/20", Initiated: "text-gray-400 bg-gray-500/20", Failed: "text-red-400 bg-red-500/20" }

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTx, setSelectedTx] = useState<typeof mockTransactions[0] | null>(null)

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || tx.customerRef.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSettled = mockTransactions.filter(tx => tx.status === "Settled").reduce((sum, tx) => sum + tx.amount, 0)
  const totalIncentives = mockTransactions.filter(tx => tx.status === "Settled").reduce((sum, tx) => sum + tx.incentive, 0)

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
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl"><p className="text-sm text-gray-400 mb-1">Total Settled</p><p className="text-xl font-bold text-white">{formatCurrency(totalSettled)}</p></div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl"><p className="text-sm text-gray-400 mb-1">Incentives Earned</p><p className="text-xl font-bold text-emerald-400">{formatCurrency(totalIncentives)}</p></div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl"><p className="text-sm text-gray-400 mb-1">Total Transactions</p><p className="text-xl font-bold text-white">{mockTransactions.length}</p></div>
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl"><p className="text-sm text-gray-400 mb-1">Success Rate</p><p className="text-xl font-bold text-white">{Math.round((mockTransactions.filter(tx => tx.status === "Settled").length / mockTransactions.length) * 100)}%</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by ID or reference..." className="gemrails-input-icon" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="gemrails-select w-full sm:w-auto">
          <option value="all">All Status</option>
          <option value="Settled">Settled</option>
          <option value="Processing">Processing</option>
          <option value="AwaitingCrypto">Awaiting Crypto</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-800/50 border-b border-gray-800 text-sm font-medium text-gray-400">
          <div>Transaction ID</div><div>Amount</div><div>Crypto</div><div>Reference</div><div>Status</div><div>Date</div>
        </div>
        <div className="divide-y divide-gray-800">
          {filteredTransactions.map((tx) => {
            const StatusIcon = statusIcons[tx.status as keyof typeof statusIcons]
            const statusColor = statusColors[tx.status as keyof typeof statusColors]
            return (
              <motion.div key={tx.id} whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }} onClick={() => setSelectedTx(tx)} className="p-4 cursor-pointer">
                <div className="md:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{formatCurrency(tx.amount)}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}><StatusIcon className="w-3.5 h-3.5" />{PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS]?.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm"><span className="text-gray-400">{tx.customerRef}</span><span className="text-gray-500">{formatDate(tx.timestamp)}</span></div>
                </div>
                <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                  <div className="text-white font-mono text-sm">{tx.id}</div>
                  <div><p className="text-white font-medium">{formatCurrency(tx.amount)}</p>{tx.status === "Settled" && <p className="text-xs text-emerald-400">+₦{tx.incentive} bonus</p>}</div>
                  <div className="text-gray-300">{tx.cryptoAmount} {tx.cryptoAsset}</div>
                  <div className="text-gray-400">{tx.customerRef}</div>
                  <div><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}><StatusIcon className="w-3.5 h-3.5" />{PAYMENT_STATUS[tx.status as keyof typeof PAYMENT_STATUS]?.label}</span></div>
                  <div className="text-gray-500 text-sm">{formatDate(tx.timestamp)}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
        {filteredTransactions.length === 0 && <div className="p-8 text-center"><Search className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No transactions found</p></div>}
      </div>

      <AnimatePresence>
        {selectedTx && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTx(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">Transaction Details</h3>
                <button onClick={() => setSelectedTx(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-center">
                  {(() => { const StatusIcon = statusIcons[selectedTx.status as keyof typeof statusIcons]; const statusColor = statusColors[selectedTx.status as keyof typeof statusColors]; return <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}><StatusIcon className="w-5 h-5" />{PAYMENT_STATUS[selectedTx.status as keyof typeof PAYMENT_STATUS]?.label}</span> })()}
                </div>
                <div className="text-center py-4"><p className="text-3xl font-bold text-white">{formatCurrency(selectedTx.amount)}</p>{selectedTx.status === "Settled" && <p className="text-emerald-400 mt-1">+₦{selectedTx.incentive} incentive bonus</p>}</div>
                <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl">
                  <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="text-white font-mono">{selectedTx.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Crypto Amount</span><span className="text-white">{selectedTx.cryptoAmount} {selectedTx.cryptoAsset}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Reference</span><span className="text-white">{selectedTx.customerRef}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Initiated</span><span className="text-white">{formatDate(selectedTx.timestamp)}</span></div>
                  {selectedTx.settledAt && <div className="flex justify-between"><span className="text-gray-400">Settled</span><span className="text-white">{formatDate(selectedTx.settledAt)}</span></div>}
                  {selectedTx.failReason && <div className="flex justify-between"><span className="text-gray-400">Failure Reason</span><span className="text-red-400">{selectedTx.failReason}</span></div>}
                </div>
                {selectedTx.status === "Settled" && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-emerald-400 font-medium mb-2">Settlement Breakdown</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Original Amount</span><span className="text-white">{formatCurrency(selectedTx.amount)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Merchant Incentive</span><span className="text-emerald-400">+{formatCurrency(selectedTx.incentive)}</span></div>
                      <div className="flex justify-between pt-2 border-t border-emerald-500/20"><span className="text-white font-medium">Total Received</span><span className="text-white font-bold">{formatCurrency(selectedTx.amount + selectedTx.incentive)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
