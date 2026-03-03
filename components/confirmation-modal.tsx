"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Trash2, AlertTriangle, Info, X, Loader2 } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
  isLoading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: Trash2,
          iconBg: "bg-red-500/10",
          iconColor: "text-red-400",
          buttonBg: "bg-red-500 hover:bg-red-600",
          borderColor: "border-red-500/20",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          iconBg: "bg-amber-500/10",
          iconColor: "text-amber-400",
          buttonBg: "bg-amber-500 hover:bg-amber-600",
          borderColor: "border-amber-500/20",
        }
      default:
        return {
          icon: Info,
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-400",
          buttonBg: "bg-emerald-500 hover:bg-emerald-600",
          borderColor: "border-blue-500/20",
        }
    }
  }

  const styles = getVariantStyles()
  const Icon = styles.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0d1117] border border-gray-800 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl"
            >
              <div className={`h-1.5 w-full ${variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${styles.iconBg} ${styles.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-2xl transition-all disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 ${styles.buttonBg} text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
