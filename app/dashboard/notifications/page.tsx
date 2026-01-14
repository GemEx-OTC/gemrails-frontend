"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, CheckCheck, Clock, AlertCircle, Info, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/lib/hooks/use-notifications"
import { useNotification } from "@/context/notification-context"
import type { Notification } from "@/lib/api/types"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)
  const { unreadCount, setUnreadCount, decrementUnreadCount } = useNotification()

  const { data, isLoading, error, refetch } = useNotifications({
    page,
    limit: 20,
    filter: filter === "unread" ? "unread" : undefined,
  })

  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()

  useEffect(() => {
    if (error) {
      toast.error("Failed to load notifications")
    }
  }, [error])

  useEffect(() => {
    if (data && typeof data.unreadCount === "number") {
      setUnreadCount(data.unreadCount)
    }
  }, [data, setUnreadCount])

  const notifications = data?.notifications || []
  const totalPages = data?.pagination?.totalPages || 1

  const handleMarkAsRead = async (id: string) => {
    decrementUnreadCount(1)
    markAsReadMutation.mutate(id, {
      onError: () => {
        toast.error("Failed to mark as read")
        refetch()
      },
    })
  }

  const handleMarkAllAsRead = async () => {
    setUnreadCount(0)
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read")
        refetch()
      },
      onError: () => {
        toast.error("Failed to mark all as read")
        refetch()
      },
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "PaymentReceived":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
      case "PayoutProcessed":
        return <ArrowUpRight className="w-5 h-5 text-blue-400" />
      case "AccountAlert":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Notifications</h1>
        <p className="text-gray-400">Manage your alerts and updates</p>
      </div>

      <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-gray-900/50 rounded-xl w-fit border border-gray-800">
          <button
            onClick={() => {
              setFilter("all")
              setPage(1)
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "all" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("unread")
              setPage(1)
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "unread" ? "bg-gray-800 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-emerald-500 text-white text-[10px] rounded-full">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            unreadCount > 0 ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-1/4" />
                  <div className="h-3 bg-gray-800 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {notifications.map((notification: Notification) => {
              const isUnread = !notification.channels.inApp?.readAt
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className={`group relative p-4 rounded-2xl border transition-all hover:bg-gray-800/30 ${
                    isUnread ? "bg-gray-800/20 border-gray-700" : "bg-[#0d1116] border-gray-800/50"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUnread ? "bg-gray-800" : "bg-gray-900"}`}>
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={`font-medium mb-0.5 ${isUnread ? "text-white" : "text-gray-400"}`}>{notification.title}</h3>
                          <p className={`text-sm leading-relaxed ${isUnread ? "text-gray-300" : "text-gray-500"}`}>{notification.message}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                          </span>
                          {isUnread && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-700 rounded-lg text-emerald-400"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isUnread && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />}
                </motion.div>
              )
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
