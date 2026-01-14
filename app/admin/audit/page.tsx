"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Search, Filter, ChevronLeft, ChevronRight,
  Shield, UserCheck, UserX, LogIn, LogOut, RefreshCw,
  Settings, CreditCard, AlertCircle, CheckCircle, Clock,
  AlertTriangle, Loader2,
} from "lucide-react"
import { useAuditLogs } from "@/lib/hooks/use-admin"

type SeverityFilter = "all" | "info" | "warning" | "critical"

const formatAction = (action: string) => action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })

const getActionIcon = (action: string) => {
  if (action.includes("LOGIN")) return <LogIn className="w-4 h-4" />
  if (action.includes("LOGOUT")) return <LogOut className="w-4 h-4" />
  if (action.includes("SUSPEND") || action.includes("REJECT")) return <UserX className="w-4 h-4" />
  if (action.includes("VERIFY") || action.includes("REACTIVATE")) return <UserCheck className="w-4 h-4" />
  if (action.includes("CREATE") || action.includes("REGISTER")) return <CheckCircle className="w-4 h-4" />
  if (action.includes("UPDATE") || action.includes("CHANGE") || action.includes("RESET")) return <RefreshCw className="w-4 h-4" />
  if (action.includes("TRANSACTION") || action.includes("PAYMENT") || action.includes("SETTLEMENT")) return <CreditCard className="w-4 h-4" />
  if (action.includes("SETTINGS")) return <Settings className="w-4 h-4" />
  if (action.includes("FAIL") || action.includes("ERROR")) return <AlertCircle className="w-4 h-4" />
  return <Shield className="w-4 h-4" />
}

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical":
      return { bg: "from-red-500/20 to-red-500/10", border: "border-red-500/40", text: "text-red-400", badge: "bg-red-500/20 text-red-300 border-red-500/30", dot: "bg-red-500" }
    case "warning":
      return { bg: "from-amber-500/20 to-amber-500/10", border: "border-amber-500/40", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/30", dot: "bg-amber-500" }
    default:
      return { bg: "from-blue-500/20 to-blue-500/10", border: "border-blue-500/40", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-300 border-blue-500/30", dot: "bg-blue-500" }
  }
}

const getActionStyles = (action: string) => {
  if (action.includes("SUSPEND") || action.includes("REJECT") || action.includes("FAIL")) return { bg: "from-red-500/15 to-rose-500/10", border: "border-red-500/30", text: "text-red-300" }
  if (action.includes("VERIFY") || action.includes("SETTLE") || action.includes("REACTIVATE") || action.includes("REGISTER")) return { bg: "from-emerald-500/15 to-green-500/10", border: "border-emerald-500/30", text: "text-emerald-300" }
  if (action.includes("UPDATE") || action.includes("CHANGE") || action.includes("BANK")) return { bg: "from-amber-500/15 to-yellow-500/10", border: "border-amber-500/30", text: "text-amber-300" }
  if (action.includes("LOGIN") || action.includes("LOGOUT")) return { bg: "from-cyan-500/15 to-blue-500/10", border: "border-cyan-500/30", text: "text-cyan-300" }
  if (action.includes("TRANSACTION") || action.includes("PAYMENT")) return { bg: "from-purple-500/15 to-violet-500/10", border: "border-purple-500/30", text: "text-purple-300" }
  return { bg: "from-slate-500/15 to-gray-500/10", border: "border-slate-500/30", text: "text-slate-300" }
}

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all")
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data, isLoading } = useAuditLogs({
    severity: severityFilter !== "all" ? severityFilter : undefined,
    search: searchQuery || undefined,
    page,
    limit: perPage,
  })

  const logs = data?.logs || []
  const stats = data?.stats
  const pagination = data?.pagination
  const totalPages = pagination?.totalPages || 1

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-400 mt-1">Complete record of all system activities and administrative actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/40">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-indigo-400">Total Events</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-linear-to-br from-red-500/20 to-rose-500/10 border border-red-500/40">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Critical</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.critical || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-linear-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Warnings</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.warning || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/40">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Info</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.info || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by actor, action, or details..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              {(["all", "critical", "warning", "info"] as const).map((sev) => {
                const isActive = severityFilter === sev
                const config = sev !== "all" ? getSeverityConfig(sev) : null
                return (
                  <button
                    key={sev}
                    onClick={() => { setSeverityFilter(sev); setPage(1) }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                      isActive
                        ? sev === "all"
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : `bg-linear-to-r ${config?.bg} ${config?.text} ${config?.border}`
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-white"
                    }`}
                  >
                    {sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Audit Logs List */}
          <AnimatePresence mode="wait">
            {logs.length > 0 ? (
              <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {logs.map((log, idx) => {
                  const severityConfig = getSeverityConfig(log.severity)
                  const actionStyles = getActionStyles(log.action)
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-xl border-2 bg-linear-to-r ${severityConfig.bg} ${severityConfig.border}`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-linear-to-r ${actionStyles.bg} ${actionStyles.border} ${actionStyles.text}`}>
                            {getActionIcon(log.action)}
                            {formatAction(log.action)}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${severityConfig.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${severityConfig.dot}`} />
                            {log.severity}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimeAgo(log.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatDate(log.createdAt)}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</span>
                          <div className="mt-1">
                            <p className="text-white font-medium text-sm truncate">{log.actor}</p>
                            {log.actorRole && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {log.actorRole}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-6">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Details</span>
                          <p className="text-gray-300 text-sm mt-1 leading-relaxed">{log.details}</p>
                        </div>
                        <div className="md:col-span-3">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</span>
                          <p className="text-gray-400 font-mono text-xs mt-1 bg-gray-800/50 px-2 py-1 rounded inline-block">
                            {log.ipAddress || "N/A"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-gray-800 mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-white font-medium mb-1">No audit logs found</p>
                {(searchQuery || severityFilter !== "all") && (
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-white">{(page - 1) * perPage + 1}</span> to{" "}
                <span className="font-medium text-white">{Math.min(page * perPage, pagination?.total || 0)}</span> of{" "}
                <span className="font-medium text-white">{pagination?.total || 0}</span> events
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500/50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500/50 transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
