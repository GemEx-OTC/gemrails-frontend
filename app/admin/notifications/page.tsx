"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Bell, CheckCheck, Inbox, Store, Send, RefreshCw, X,
  AlertCircle, CheckCircle, Clock, Megaphone, Users, Loader2,
} from "lucide-react"
import { useBroadcasts, useSendBroadcast } from "@/lib/hooks/use-admin"
import type { BroadcastInput } from "@/lib/api/types"

type NotificationPriority = "low" | "normal" | "high" | "urgent"

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationsPage() {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)

  const { data: broadcasts, isLoading, refetch } = useBroadcasts(20)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">Broadcast messages to merchants</p>
        </div>
        <button
          onClick={() => setShowBroadcastModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          <Send className="w-4 h-4" /> Send Broadcast
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Total Broadcasts</span>
          </div>
          <p className="text-2xl font-bold text-white">{broadcasts?.length || 0}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Total Recipients</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {broadcasts?.reduce((sum, b) => sum + b.recipientCount, 0) || 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {broadcasts?.filter(b => {
              const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
              return new Date(b.sentAt).getTime() > weekAgo
            }).length || 0}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Broadcasts List */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" /> Broadcast History
            </h2>
            {broadcasts && broadcasts.length > 0 ? (
              <div className="space-y-3">
                {broadcasts.map((broadcast) => (
                  <motion.div
                    key={broadcast.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{broadcast.title}</h3>
                      <span className="text-xs text-gray-500">{formatTimeAgo(broadcast.sentAt)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{broadcast.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {broadcast.recipientCount} merchants
                      </span>
                      <span className={`px-2 py-0.5 rounded border ${
                        broadcast.priority === "urgent" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        broadcast.priority === "high" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                        "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {broadcast.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {broadcast.targetRole}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No broadcasts yet</h3>
                <p className="text-gray-500">Send your first broadcast to merchants</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Broadcast Modal */}
      <BroadcastModal 
        isOpen={showBroadcastModal} 
        onClose={() => setShowBroadcastModal(false)}
        onSuccess={() => {
          refetch()
          setShowBroadcastModal(false)
        }}
      />
    </motion.div>
  )
}

// Broadcast Modal Component
function BroadcastModal({ 
  isOpen, 
  onClose,
  onSuccess,
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [priority, setPriority] = useState<NotificationPriority>("normal")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sendEmail, setSendEmail] = useState(false)

  const sendBroadcastMutation = useSendBroadcast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message) return

    sendBroadcastMutation.mutate(
      { title, message, priority, sendEmail },
      {
        onSuccess: (data) => {
          toast.success(data.message)
          setTitle("")
          setMessage("")
          setPriority("normal")
          setSendEmail(false)
          onSuccess()
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to send broadcast")
        },
      }
    )
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

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendBroadcastMutation.isPending || !title || !message}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {sendBroadcastMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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
