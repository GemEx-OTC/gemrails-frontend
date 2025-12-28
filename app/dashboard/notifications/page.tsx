"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NotificationItem } from "@/components/notification-item"
import { Notification } from "@/lib/notifications"
import { Bell, CheckCheck, Filter, Inbox, DollarSign, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { FEE_CONFIG } from "@/lib/constants"

// Mock notifications for merchant
const mockNotifications: Notification[] = [
  {
    id: "1",
    merchantId: "merchant1",
    type: "PaymentReceived",
    title: "Payment Received",
    message: `Customer paid ₦85,000 via crypto. You earned ₦${FEE_CONFIG.merchantIncentive} bonus!`,
    channels: { inApp: { sent: true }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: false } },
    referenceType: "Payment",
    referenceId: "pay123",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    merchantId: "merchant1",
    type: "PayoutSuccess",
    title: "Payout Successful",
    message: "₦150,000 has been sent to your GTBank account ending in 4521.",
    channels: { inApp: { sent: true }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: true, sentAt: new Date().toISOString() } },
    referenceType: "Payout",
    referenceId: "payout456",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    merchantId: "merchant1",
    type: "PaymentConfirmed",
    title: "Crypto Confirmed",
    message: "Customer's USDT deposit confirmed on blockchain. Processing settlement now.",
    channels: { inApp: { sent: true }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: false } },
    referenceType: "Payment",
    referenceId: "pay789",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "4",
    merchantId: "merchant1",
    type: "SettlementComplete",
    title: "Daily Settlement Complete",
    message: "Your daily settlement of ₦450,000 (9 transactions) has been processed.",
    channels: { inApp: { sent: true, readAt: new Date().toISOString() }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: false } },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "5",
    merchantId: "merchant1",
    type: "AccountVerified",
    title: "Account Verified",
    message: "Your merchant account has been verified. You can now accept unlimited payments.",
    channels: { inApp: { sent: true, readAt: new Date().toISOString() }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: true, sentAt: new Date().toISOString() } },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "6",
    merchantId: "merchant1",
    type: "BankAccountAdded",
    title: "Bank Account Added",
    message: "Your GTBank account has been verified and linked for payouts.",
    channels: { inApp: { sent: true, readAt: new Date().toISOString() }, email: { sent: true, sentAt: new Date().toISOString() }, sms: { sent: false } },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "7",
    merchantId: "merchant1",
    type: "SystemAlert",
    title: "New Feature Available",
    message: "You can now generate multiple QR codes for different payment amounts. Check it out!",
    channels: { inApp: { sent: true, readAt: new Date().toISOString() }, email: { sent: false }, sms: { sent: false } },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

type FilterType = "all" | "unread" | "payments" | "payouts" | "account"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<FilterType>("all")

  const unreadCount = notifications.filter(n => !n.channels.inApp.readAt).length
  const todayEarnings = notifications
    .filter(n => n.type === "PaymentReceived" && new Date(n.createdAt).toDateString() === new Date().toDateString())
    .length * FEE_CONFIG.merchantIncentive

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.channels.inApp.readAt
    if (filter === "payments") return ["PaymentReceived", "PaymentConfirmed"].includes(n.type)
    if (filter === "payouts") return ["PayoutSuccess", "PayoutFailed", "SettlementComplete"].includes(n.type)
    if (filter === "account") return ["AccountVerified", "AccountSuspended", "BankAccountAdded", "SystemAlert"].includes(n.type)
    return true
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, channels: { ...n.channels, inApp: { ...n.channels.inApp, readAt: new Date().toISOString() } } }
          : n
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        channels: { ...n.channels, inApp: { ...n.channels.inApp, readAt: n.channels.inApp.readAt || new Date().toISOString() } }
      }))
    )
  }

  const handleNavigate = (notification: Notification) => {
    handleMarkAsRead(notification.id)
    if (notification.referenceType === "Payment" || notification.referenceType === "Payout") {
      router.push("/dashboard/transactions")
    } else if (notification.type === "BankAccountAdded" || notification.type === "AccountVerified") {
      router.push("/dashboard/settings")
    }
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread (${unreadCount})` },
    { key: "payments", label: "Payments" },
    { key: "payouts", label: "Payouts" },
    { key: "account", label: "Account" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">Stay updated on payments and account activity</p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleMarkAllAsRead}
            className="gemrails-button-secondary flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{notifications.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-400">Unread</span>
          </div>
          <p className="text-2xl font-bold text-white">{unreadCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-gray-400">Today's Bonus</span>
          </div>
          <p className="text-2xl font-bold text-white">₦{todayEarnings.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Payments Today</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {notifications.filter(n => n.type === "PaymentReceived" && new Date(n.createdAt).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onNavigate={handleNavigate}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                {filter === "unread" ? "You're all caught up!" : "No notifications match your filter."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
