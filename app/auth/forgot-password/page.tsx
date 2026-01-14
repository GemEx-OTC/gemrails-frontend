"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useForgotPassword } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess(true)
          toast.success("Password reset link sent!")
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Failed to send reset link. Please try again.")
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>

      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">
          {success ? "Check your email for instructions" : "Enter your email to receive reset instructions"}
        </p>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4"
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Email Sent!</h3>
            <p className="text-gray-400 text-sm">
              We've sent password reset instructions to{" "}
              <span className="text-white font-medium">{email}</span>. Please check your inbox and spam folder.
            </p>
          </div>
          <button
            onClick={() => {
              setSuccess(false)
              setEmail("")
            }}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            Try another email
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="business@example.com"
                disabled={forgotPasswordMutation.isPending}
                className="gemrails-input-icon"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="gemrails-button w-full flex items-center justify-center gap-2"
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Link...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}
