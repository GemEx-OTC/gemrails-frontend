"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  AlertCircle,
  Building2,
  Mail,
  Lock,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react"

type SignupStep = "details" | "otp"

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("details")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Account details
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [step, resendTimer])

  const validateDetails = () => {
    if (!businessName.trim()) return "Business name is required"
    if (!email.includes("@")) return "Please enter a valid email"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (password !== confirmPassword) return "Passwords do not match"
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const err = validateDetails()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("otp")
      setResendTimer(60)
      setCanResend(false)
    }, 1000)
  }

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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }
    setLoading(true)
    setTimeout(() => {
      // Redirect to dashboard - they'll see onboarding prompt there
      window.location.href = "/dashboard"
    }, 1500)
  }

  const handleResendOtp = () => {
    if (!canResend) return
    setResendTimer(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Create your account
              </h1>
              <p className="text-gray-400 mt-2">
                Get started in seconds. Complete your profile later.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    className="gemrails-input-icon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="business@example.com"
                    className="gemrails-input-icon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-12 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1.5">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="gemrails-input-icon"
                  />
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
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>

              <p className="text-center text-xs text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-emerald-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>

            <div className="relative py-4 mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/60 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              href="/auth/login"
              className="gemrails-button-outline w-full block text-center"
            >
              Sign in
            </Link>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
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
                We sent a 6-digit code to{" "}
                <span className="text-white">{email}</span>
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
                className="gemrails-button w-full"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </motion.button>

              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-gray-500">
                    Resend code in{" "}
                    <span className="text-white font-medium">{resendTimer}s</span>
                  </p>
                )}
              </div>
            </form>

            <button
              onClick={() => setStep("details")}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to signup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
