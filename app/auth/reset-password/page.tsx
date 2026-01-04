"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock, AlertCircle, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api-client"

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (!token) {
            setError("Invalid or missing reset token")
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            await apiClient.resetPassword({
                token,
                newPassword: password,
            })
            setSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        } catch (err: any) {
            setError(err.message || "Failed to reset password. The link may have expired.")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-white">Invalid Request</h3>
                <p className="text-gray-400">
                    We couldn&apos;t find a valid reset token in your request. Please check these link from your email and try again.
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
                        <p className="text-gray-400 text-sm">
                            Your password has been updated. Redirecting you to login...
                        </p>
                    </div>
                    <Link href="/auth/login" className="gemrails-button w-full flex justify-center mt-4">
                        Login Now
                    </Link>
                </motion.div>
            ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Password */}
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
                                placeholder="Message new password"
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

                    {/* Confirm Password */}
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

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="gemrails-button w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
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
