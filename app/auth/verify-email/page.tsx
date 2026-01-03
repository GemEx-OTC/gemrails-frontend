"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Mail, ArrowRight, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [resending, setResending] = useState(false)
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])
    const autoResendTriggered = useRef(false)

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [resendTimer])

    // Auto-resend if requested via URL param
    useEffect(() => {
        const shouldResend = searchParams.get("resend") === "true"
        if (shouldResend && email && !autoResendTriggered.current) {
            autoResendTriggered.current = true
            handleResendOtp(true)
        }
    }, [searchParams])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1)
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        if (value && index < 5) otpRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        const otpValue = otp.join("")
        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit code")
            return
        }

        setLoading(true)
        try {
            await apiClient.verifyEmail({ email, otp: otpValue })
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Verification failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async (force = false) => {
        if ((!canResend && !force) || resending) return
        setResending(true)
        try {
            await apiClient.resendOtp(email)
            setResendTimer(60)
            setCanResend(false)
            setOtp(["", "", "", "", "", ""])
            setError("")
        } catch (err: any) {
            setError(err.message || "Failed to resend OTP.")
        } finally {
            setResending(false)
        }
    }

    if (!email) {
        return (
            <div className="text-center text-gray-400">
                Invalid access. Email missing.
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Check your email</h1>
                <p className="text-gray-400 mt-2">
                    We sent a 6-digit code to <span className="text-white">{email}</span>
                </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                otpRefs.current[index] = el
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                    ))}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </motion.div>
                )}

                <motion.button
                    type="submit"
                    disabled={loading || otp.join("").length !== 6}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="gemrails-button w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verifying...</span>
                        </>
                    ) : (
                        <>
                            <span>Verify & Continue</span>
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>

                <div className="text-center">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={() => handleResendOtp()}
                            disabled={resending}
                            className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-2"
                        >
                            {resending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {resending ? "Resending..." : "Resend code"}
                        </button>
                    ) : (
                        <p className="text-gray-500">
                            Resend code in{" "}
                            <span className="text-white font-medium">{resendTimer}s</span>
                        </p>
                    )}
                </div>
            </form>
        </motion.div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
