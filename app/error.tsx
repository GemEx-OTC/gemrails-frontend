"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Home, Zap } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0d10] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 500 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                borderColor: ["rgba(239, 68, 68, 0.4)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.4)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 text-red-400" />
            </motion.div>
            <motion.span
              className="text-[100px] md:text-[140px] font-bold bg-gradient-to-br from-red-500 to-emerald-500 bg-clip-text text-transparent leading-none"
            >
              500
            </motion.span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Something Went Wrong
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            We hit a snag processing your request. Our team has been notified. 
            Please try again or return home.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={reset}
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white border border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </motion.div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg text-left"
          >
            <p className="text-xs text-gray-500 mb-2">Error Details:</p>
            <code className="text-xs text-red-400 break-all">{error.message}</code>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  )
}
