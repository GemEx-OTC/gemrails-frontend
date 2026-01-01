"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell, CheckCheck, Inbox, Store, Send, RefreshCw, X,
  AlertCircle, CheckCircle, Clock, Megaphone, Users,
} from "lucide-react"

type FilterType = "all" | "unread" | "merchants" | "system"
type NotificationPriority = "low" | "normal" | "high" | "urgent"

interface AdminNotification {
  id: string
  type: string
  title: string
  message: string
  priority: NotificationPriority
  isRead: boolean
  createdAt: string
  targetRole?: string
}

// Mock notifications
const mockNotifications: AdminNotification[] = [
  { id: "1", type: "MerchantRegistered", title: "New Merchant Registration", message: "Quick Mart has registered and is pending verification", priority: "high", isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: "2", type: "LargeTransaction", title: "Large Transaction Alert", message: "₦500,000 payment processed for Lagos Cafe", priority: "normal", isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "3", type: "MerchantVerified", title: "Merchant Verified", message: "Demo Restaurant has been verified successfully", priority: "low", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: "4", type: "SystemAlert", title: "System Maintenance", message: "Scheduled maintenance completed successfully", priority: "normal", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "5", type: "PaymentFailed", title: "Payment Failed", message: "Transaction TXN006 failed due to timeout", priority: "high", isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() },
  { id: "6", type: "MerchantSuspended", title: "Merchant Suspended", message: "Fashion Hub has been suspended for suspicious activity", priority: "urgent", isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
]

// Mock broadcast history
const mockBroadcasts = [
  { id: "b1", title: "Platform Update", message: "New features available for all merchants", targetRole: "merchant", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), recipientCount: 142 },
  { id: "b2", title: "Holiday Schedule", message: "Support hours during the holiday season", targetRole: "merchant", sentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), recipientCount: 156 },
]

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const getPriorityConfig = (priority: NotificationPriority) => {
  switch (priority) {
    case "urgent": return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", dot: "bg-red-500" }
    case "high": return { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-500" }
    case "normal": return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-500" }
    default: return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", dot: "bg-gray-500" }
  }
}

const getTypeIcon = (type: string) => {
  if (type.includes("Merchant")) return <Store className="w-4 h-4" />
  if (type.includes("Transaction") || type.includes("Payment")) return <CheckCircle className="w-4 h-4" />
  if (type.includes("System") || type.includes("Alert")) return <AlertCircle className="w-4 h-4" />
  return <Bell className="w-4 h-4" />
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length
  const pendingMerchants = notifications.filter(n => !n.isRead && n.type === "MerchantRegistered").length

  const filteredNotifications = notifications.filter(n => {
    switch (filter) {
      case "unread": return !n.isRead
      case "merchants": return n.type.includes("Merchant")
      case "system": return n.type.includes("System") || n.type.includes("Alert") || n.type.includes("Payment")
      default: return true
    }
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread (${unreadCount})` },
    { key: "merchants", label: "Merchants" },
    { key: "system", label: "System" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">System alerts and broadcast messages</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all text-sm">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Pending Merchants Alert */}
      {pendingMerchants > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-400">{pendingMerchants} Merchant{pendingMerchants > 1 ? "s" : ""} Pending Review</p>
              <p className="text-sm text-gray-400">New registrations awaiting verification</p>
            </div>
            <a href="/admin/merchants" className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
              Review Now
            </a>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{notifications.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Unread</span>
          </div>
          <p className="text-2xl font-bold text-white">{unreadCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-400">Pending Merchants</span>
          </div>
          <p className="text-2xl font-bold text-white">{pendingMerchants}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Broadcasts Sent</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockBroadcasts.length}</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-4 h-4" /> Broadcast
          </button>
          <button onClick={handleRefresh} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, idx) => {
              const priorityConfig = getPriorityConfig(notification.priority)
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    notification.isRead
                      ? "bg-gray-900/30 border-gray-800 hover:border-gray-700"
                      : `${priorityConfig.bg} ${priorityConfig.border} hover:border-emerald-500/50`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? "bg-gray-800" : priorityConfig.bg}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!notification.isRead && <span className={`w-2 h-2 rounded-full ${priorityConfig.dot}`} />}
                        <h3 className={`font-semibold ${notification.isRead ? "text-gray-400" : "text-white"}`}>{notification.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.isRead ? "text-gray-500" : "text-gray-300"}`}>{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{formatTimeAgo(notification.createdAt)}</span>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-500">{filter === "unread" ? "All caught up! No pending alerts." : "No notifications match your filter."}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Broadcasts */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-400" /> Recent Broadcasts
        </h2>
        <div className="space-y-3">
          {mockBroadcasts.map((broadcast) => (
            <div key={broadcast.id} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{broadcast.title}</h3>
                <span className="text-xs text-gray-500">{formatTimeAgo(broadcast.sentAt)}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{broadcast.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {broadcast.recipientCount} merchants</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">{broadcast.targetRole}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      <BroadcastModal isOpen={showBroadcastModal} onClose={() => setShowBroadcastModal(false)} />
    </motion.div>
  )
}

// Broadcast Modal Component
function BroadcastModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [priority, setPriority] = useState<NotificationPriority>("normal")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sendEmail, setSendEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return

    setLoading(true)
    setResult(null)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setResult("Successfully sent to 142 merchants")
      setTimeout(() => {
        onClose()
        setTitle("")
        setMessage("")
        setResult(null)
      }, 2000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Broadcast to Merchants</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as NotificationPriority)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-400">Also send via email</span>
          </label>

          {result && (
            <div className={`p-3 rounded-xl text-sm ${result.startsWith("Error") ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"}`}>
              {result}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title || !message}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
