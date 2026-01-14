"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useVerifyEmail, useResendOtp } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const autoResendTriggered = useRef(false)

  const verifyEmailMutation = useVerifyEmail()
  const resendOtpMutation = useResendOtp()

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
  }, [searchParams, email])

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
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit code")
      return
    }

    verifyEmailMutation.mutate(
      { email, otp: otpValue },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!")
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Verification failed. Please try again.")
        },
      }
    )
  }

  const handleResendOtp = async (force = false) => {
    if ((!canResend && !force) || resendOtpMutation.isPending) return

    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("Verification code sent!")
          setResendTimer(60)
          setCanResend(false)
          setOtp(["", "", "", "", "", ""])
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Failed to resend OTP.")
        },
      }
    )
  }

  if (!email) {
    return <div className="text-center text-gray-400">Invalid access. Email missing.</div>
  }

  const isLoading = verifyEmailMutation.isPending

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
              disabled={isLoading}
              className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
            />
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading || otp.join("").length !== 6}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="gemrails-button w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
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
              disabled={resendOtpMutation.isPending}
              className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-2"
            >
              {resendOtpMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {resendOtpMutation.isPending ? "Resending..." : "Resend code"}
            </button>
          ) : (
            <p className="text-gray-500">
              Resend code in <span className="text-white font-medium">{resendTimer}s</span>
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
