"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Lock, AlertCircle, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useResetPassword } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const resetPasswordMutation = useResetPassword()

  useEffect(() => {
    const rawToken = searchParams.get("token")
    if (rawToken) {
      setToken(rawToken)
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", window.location.pathname)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    resetPasswordMutation.mutate(
      { token, newPassword: password },
      {
        onSuccess: () => {
          setSuccess(true)
          toast.success("Password reset successful!")
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Failed to reset password. The link may have expired.")
        },
      }
    )
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-white">Invalid Request</h3>
        <p className="text-gray-400">
          We couldn&apos;t find a valid reset token in your request. Please check the link from your email and try
          again.
        </p>
        <Link href="/auth/login" className="gemrails-button inline-flex items-center gap-2 mt-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Create a new secure password</p>
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
            <h3 className="text-lg font-medium text-white">Password Reset Successful!</h3>
            <p className="text-gray-400 text-sm">Your password has been updated. You can now login with your new password.</p>
          </div>
          <Link href="/auth/login" className="gemrails-button w-full flex justify-center mt-4">
            Login Now
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={resetPasswordMutation.isPending}
                className="gemrails-input-icon pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={resetPasswordMutation.isPending}
                className="gemrails-input-icon pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="gemrails-button w-full flex items-center justify-center gap-2"
          >
            {resetPasswordMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
