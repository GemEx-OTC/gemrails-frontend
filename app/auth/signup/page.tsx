"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { BUSINESS_CATEGORIES, NIGERIAN_BANKS } from "@/lib/constants"
import {
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react"

type SignupStep = "business" | "contact" | "bank" | "otp"

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("business")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Business details
  const [businessName, setBusinessName] = useState("")
  const [businessCategory, setBusinessCategory] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [rcNumber, setRcNumber] = useState("")

  // Contact details
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Bank details
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [verifyingAccount, setVerifyingAccount] = useState(false)

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

  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      setVerifyingAccount(true)
      setTimeout(() => {
        setAccountName("DEMO BUSINESS ACCOUNT")
        setVerifyingAccount(false)
      }, 1500)
    } else {
      setAccountName("")
    }
  }, [accountNumber, bankCode])

  const steps = [
    { id: "business", label: "Business", icon: Building2 },
    { id: "contact", label: "Contact", icon: User },
    { id: "bank", label: "Bank", icon: CreditCard },
    { id: "otp", label: "Verify", icon: Check },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  const validateBusinessStep = () => {
    if (!businessName.trim()) return "Business name is required"
    if (!businessCategory) return "Please select a business category"
    if (!businessAddress.trim()) return "Business address is required"
    return null
  }

  const validateContactStep = () => {
    if (!contactName.trim()) return "Contact name is required"
    if (!email.includes("@")) return "Please enter a valid email"
    if (!phone || phone.length < 10) return "Please enter a valid phone number"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (password !== confirmPassword) return "Passwords do not match"
    return null
  }

  const validateBankStep = () => {
    if (!bankCode) return "Please select a bank"
    if (accountNumber.length !== 10) return "Account number must be 10 digits"
    if (!accountName) return "Please wait for account verification"
    return null
  }

  const handleNext = () => {
    setError("")
    if (step === "business") {
      const err = validateBusinessStep()
      if (err) { setError(err); return }
      setStep("contact")
    } else if (step === "contact") {
      const err = validateContactStep()
      if (err) { setError(err); return }
      setStep("bank")
    } else if (step === "bank") {
      const err = validateBankStep()
      if (err) { setError(err); return }
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStep("otp")
        setResendTimer(60)
        setCanResend(false)
      }, 1000)
    }
  }

  const handleBack = () => {
    setError("")
    if (step === "contact") setStep("business")
    else if (step === "bank") setStep("contact")
    else if (step === "otp") setStep("bank")
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
      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon
            const isActive = idx === currentStepIndex
            const isCompleted = idx < currentStepIndex
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                          : "bg-gray-800 text-gray-500 border border-gray-700"
                    }`}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </motion.div>
                  <span className={`text-xs mt-2 hidden sm:block ${isActive || isCompleted ? "text-emerald-400" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${idx < currentStepIndex ? "bg-emerald-500" : "bg-gray-700"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "business" && (
          <motion.div key="business" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold text-white">Register Your Business</h1>
              <p className="text-gray-400 mt-1">Start accepting crypto payments</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Business Name" className="gemrails-input-icon" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Category</label>
                <select value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="gemrails-select">
                  <option value="">Select category</option>
                  {BUSINESS_CATEGORIES.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Business Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                  <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Full business address" rows={2} className="gemrails-input-icon resize-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">RC/BN Number <span className="text-gray-500 font-normal">(Optional)</span></label>
                <input type="text" value={rcNumber} onChange={(e) => setRcNumber(e.target.value)} placeholder="Business registration number" className="gemrails-input" />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
              </motion.div>
            )}

            <motion.button onClick={handleNext} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button w-full flex items-center justify-center gap-2">
              Continue <ChevronRight className="w-5 h-5" />
            </motion.button>

            <p className="text-center text-gray-500 text-sm">
              Already have an account? <Link href="/auth/login" className="text-emerald-400 hover:underline">Sign in</Link>
            </p>
          </motion.div>
        )}

        {step === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold text-white">Contact Information</h1>
              <p className="text-gray-400 mt-1">We'll use this to reach you</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" className="gemrails-input-icon" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="business@example.com" className="gemrails-input-icon" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" className="gemrails-input-icon" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-12 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1.5">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="gemrails-input-icon" />
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button onClick={handleBack} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button-outline flex-1 flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Back
              </motion.button>
              <motion.button onClick={handleNext} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button flex-1 flex items-center justify-center gap-2">
                Continue <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "bank" && (
          <motion.div key="bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-bold text-white">Settlement Account</h1>
              <p className="text-gray-400 mt-1">Where you'll receive payments</p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-sm text-emerald-300">💡 Payments are settled instantly to this account.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bank</label>
                <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} className="gemrails-select">
                  <option value="">Select your bank</option>
                  {NIGERIAN_BANKS.map((bank) => (<option key={bank.code} value={bank.code}>{bank.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit account number" className="gemrails-input" />
              </div>

              {(verifyingAccount || accountName) && (
                <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Account Name</p>
                  {verifyingAccount ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
                      Verifying...
                    </div>
                  ) : (
                    <p className="text-white font-medium">{accountName}</p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <motion.button onClick={handleBack} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button-outline flex-1 flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Back
              </motion.button>
              <motion.button onClick={handleNext} disabled={loading || verifyingAccount} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button flex-1">
                {loading ? "Creating..." : "Create Account"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
              <p className="text-gray-400 mt-2">We sent a code to <span className="text-white">{email}</span></p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el }}
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
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4" />{error}
                </motion.div>
              )}

              <motion.button type="submit" disabled={loading || otp.join("").length !== 6} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="gemrails-button w-full">
                {loading ? "Verifying..." : "Verify & Continue"}
              </motion.button>

              <div className="text-center">
                {canResend ? (
                  <button type="button" onClick={handleResendOtp} className="text-emerald-400 hover:underline font-medium">Resend code</button>
                ) : (
                  <p className="text-gray-500">Resend code in <span className="text-white font-medium">{resendTimer}s</span></p>
                )}
              </div>
            </form>

            <button onClick={handleBack} className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to bank details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
