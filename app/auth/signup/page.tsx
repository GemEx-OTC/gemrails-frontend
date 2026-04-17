"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2, Store, Landmark, ChevronLeft, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useRegister } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

export default function SignupPage() {
  const router = useRouter()
  const registerMutation = useRegister()

  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<"merchant" | "enterprise" | null>(null)
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const validateDetails = (): string | null => {
    if (!businessName.trim()) return "Business name is required"
    if (!email.includes("@")) return "Please enter a valid email"
    if (password.length < 8) return "Password must be at least 8 characters"
    return null
  }

  const handleAccountTypeSelect = (type: "merchant" | "enterprise") => {
    setAccountType(type)
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateDetails()
    if (validationError) {
      toast.error(validationError)
      return
    }

    if (!accountType) {
      toast.error("Please select an account type")
      setStep(1)
      return
    }

    registerMutation.mutate(
      { 
        businessName, 
        email, 
        password, 
        accountType,
        referralCode: referralCode.trim() || undefined
      },
      {
        onSuccess: () => {
          toast.success("Account created! Please verify your email.")
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Registration failed. Please try again.")
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Create your profile</h1>
              <p className="text-gray-400 mt-2">Select the account type that best fits your business.</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => handleAccountTypeSelect("merchant")}
                className="relative flex items-center gap-4 p-5 rounded-2xl border border-gray-800 bg-gray-800/20 hover:bg-gray-800/40 hover:border-emerald-500/50 transition-all text-left group"
              >
                <div className="p-3 rounded-xl bg-gray-800 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Merchant</h3>
                  <p className="text-sm text-gray-500 mt-1">Single office or shop. One wallet and one bank account.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleAccountTypeSelect("enterprise")}
                className="relative flex items-center gap-4 p-5 rounded-2xl border border-gray-800 bg-gray-800/20 hover:bg-gray-800/40 hover:border-emerald-500/50 transition-all text-left group"
              >
                <div className="p-3 rounded-xl bg-gray-800 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">Enterprise</h3>
                  <p className="text-sm text-gray-500 mt-1">Multiple branches and terminals. Manage everything centrally.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setStep(1)}
                className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Business Details</h1>
                <p className="text-xs text-gray-500">Creating {accountType} account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-outfit">Business Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-outfit">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="business@example.com"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-outfit">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-12 py-3.5 rounded-xl transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-outfit">Referral Code (Optional)</label>
                <div className="relative group">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="GEM-XXXXXX"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={registerMutation.isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Signup</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative py-4 mt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800/50"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#0a0d10] text-gray-500">Already have an account?</span>
        </div>
      </div>

      <Link href="/auth/login" className="gemrails-button-outline w-full block text-center">
        Sign in
      </Link>
    </div>
  )
}
