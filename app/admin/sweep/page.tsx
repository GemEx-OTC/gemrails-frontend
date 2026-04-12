"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  Zap, 
  History, 
  RefreshCw, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Database,
  ArrowRight,
  ShieldCheck,
  LayoutGrid
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getSweepStats, getSweepHistory, triggerSweep } from "@/lib/api/admin"
import { toast } from "sonner"

export default function SweepPage() {
  const [stats, setStats] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sweeping, setSweeping] = useState<string | null>(null)

  const fetchData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const [statsData, historyData] = await Promise.all([
        getSweepStats(),
        getSweepHistory({ page, limit: 20 })
      ])
      
      setStats(statsData)
      setHistory(historyData.history || [])
      setTotal(historyData.pagination?.total || 0)
    } catch (error) {
      console.error("Failed to fetch sweep data:", error)
      toast.error("Failed to load sweep data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTriggerSweep = async (network: string) => {
    setSweeping(network)
    try {
      await triggerSweep(network)
      toast.success(`${network} sweep process initiated`)
      fetchData(true)
    } catch (error: any) {
      toast.error(error.message || `Failed to trigger ${network} sweep`)
    } finally {
      setSweeping(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Crypto Sweep</h1>
          <p className="text-gray-400">Manage and consolidate crypto funds from guest wallets</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="p-3 rounded-2xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="text-gray-500 font-medium animate-pulse">Syncing sweep data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 rounded-4xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-gray-900 border border-emerald-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database className="w-24 h-24" />
              </div>
              <div className="relative">
                <p className="text-xs font-black uppercase text-emerald-500/60 tracking-[0.2em] mb-4">Total Awaiting</p>
                <h3 className="text-5xl font-black text-white mb-2">
                  {stats?.unsweptCount || 0}
                </h3>
                <p className="text-sm text-emerald-400/80 font-medium">Pending blockchain consolidations</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2rem] bg-gray-900 border border-gray-800 shadow-2xl md:col-span-1 lg:col-span-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <LayoutGrid className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-lg text-white">Pending Assets</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTriggerSweep('BSC')}
                    disabled={!!sweeping || !stats}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs shadow-xl shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none flex items-center gap-2"
                  >
                    {sweeping === 'BSC' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3 fill-current" />
                    )}
                    Sweep BSC
                  </button>

                  <button
                    onClick={() => handleTriggerSweep('TRC20')}
                    disabled={!!sweeping || !stats}
                    className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-black text-xs shadow-xl shadow-red-500/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none flex items-center gap-2"
                  >
                    {sweeping === 'TRC20' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3 fill-current" />
                    )}
                    Sweep Tron
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats?.stats && Object.keys(stats.stats).length > 0 ? (
                  Object.entries(stats.stats).map(([key, stat]: [string, any], i) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-800/30 border border-gray-800 hover:border-emerald-500/30 transition-colors group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{key.split('-')[0]}</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-white leading-none mb-1">{stat.amount.toFixed(4)}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{key.split('-')[1]} • {stat.count} TX</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-6 flex items-center justify-center text-gray-600 gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-bold text-sm">All vaults are empty!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {stats?.wallets && stats.wallets.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8">
              <div className="px-10 py-8 border-b border-gray-800 flex items-center justify-between bg-gray-950/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <Database className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Wallets Awaiting Sweep</h2>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700">
                  <span className="text-xs font-bold text-gray-400">
                    <span className="text-emerald-500">{stats.wallets.length}</span> WALLETS
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-950/40">
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Merchant / Type</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset Network</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Hot Wallet</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {stats.wallets.map((wallet: any, idx: number) => (
                      <motion.tr
                        key={wallet.transactionId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-gray-800/20 transition-all group"
                      >
                        <td className="px-10 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-white text-base">{wallet.merchantName}</span>
                            <span className={`text-[10px] font-black uppercase ${wallet.accountType === 'enterprise' ? 'text-amber-500' : 'text-blue-500'}`}>
                              {wallet.accountType || 'Merchant'} • {wallet.transactionCount} TX
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-xs text-white group-hover:border-emerald-500/30 transition-colors">
                              {wallet.asset.substring(0, 3)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-white text-xs whitespace-nowrap">{wallet.asset}</span>
                              <span className={`text-[10px] font-black uppercase ${wallet.network === 'BSC' ? 'text-yellow-500' : 'text-red-500'}`}>{wallet.network}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
                              <Database className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-xs font-mono text-emerald-400/80 truncate max-w-[200px]">
                              {wallet.hotWallet}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-white mb-1">
                              {wallet.amount.toFixed(6)}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                              {formatDistanceToNow(new Date(wallet.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="px-10 py-8 border-b border-gray-800 flex items-center justify-between bg-gray-950/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <History className="w-6 h-6 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Audit Trail</h2>
              </div>
              <div className="px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700">
                <span className="text-xs font-bold text-gray-400">
                  <span className="text-amber-500">{total}</span> COMPLETED SWEEPS
                </span>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                <Zap className="w-16 h-16 text-gray-700 mb-6" />
                <p className="text-lg font-bold text-gray-500">No history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-950/40">
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset Network</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Transaction Details</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Blockchain ID</th>
                      <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {history.map((item, idx) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-gray-800/20 transition-all group"
                      >
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-xs text-white group-hover:border-emerald-500/30 transition-colors">
                              {item.asset.substring(0, 3)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-white text-base">{item.asset}</span>
                              <span className={`text-[10px] font-black uppercase ${item.network === 'BSC' ? 'text-yellow-500' : 'text-red-500'}`}>{item.network}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-200 text-lg mb-1">{item.amount.toFixed(6)}</span>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                              <span className="truncate max-w-[150px]">{item.address}</span>
                              <ArrowRight className="w-3 h-3 text-emerald-500" />
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/10">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer truncate max-w-[200px]">
                              {item.txId}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-white mb-1">
                              {formatDistanceToNow(new Date(item.sweptAt), { addSuffix: true })}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                              {new Date(item.sweptAt).toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {total > 20 && (
              <div className="px-10 py-8 border-t border-gray-800 flex items-center justify-between bg-gray-950/20">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Page <span className="text-white font-black">{page}</span> of {Math.ceil(total / 20)}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * 20 >= total}
                    className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-500 text-black shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
