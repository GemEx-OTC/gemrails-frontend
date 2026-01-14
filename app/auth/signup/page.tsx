"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRegister } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

export default function SignupPage() {
  const router = useRouter()
  const registerMutation = useRegister()

  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const validateDetails = (): string | null => {
    if (!businessName.trim()) return "Business name is required"
    if (!email.includes("@")) return "Please enter a valid email"

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      return "Password must meet all requirements"
    }

    if (password !== confirmPassword) return "Passwords do not match"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateDetails()
    if (validationError) {
      toast.error(validationError)
      return
    }

    registerMutation.mutate(
      { businessName, email, password, contactName: businessName },
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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="text-center lg:text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 mt-2">Get started in seconds. Complete your profile later.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
                disabled={registerMutation.isPending}
                className="gemrails-input-icon"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="business@example.com"
                disabled={registerMutation.isPending}
                className="gemrails-input-icon"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                disabled={registerMutation.isPending}
                className="w-full bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-12 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) && (
              <div className="mt-2 space-y-2">
                {[
                  { label: "At least 8 characters", met: password.length >= 8 },
                  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
                  { label: "One lowercase letter", met: /[a-z]/.test(password) },
                  { label: "One number", met: /\d/.test(password) },
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />
                    )}
                    <span className={req.met ? "text-emerald-400" : "text-gray-500"}>{req.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                disabled={registerMutation.isPending}
                className="gemrails-input-icon"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={registerMutation.isPending}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="gemrails-button w-full flex items-center justify-center gap-2"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
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
            <span className="px-4 bg-gray-900/60 text-gray-500">Already have an account?</span>
          </div>
        </div>

        <Link href="/auth/login" className="gemrails-button-outline w-full block text-center">
          Sign in
        </Link>
      </motion.div>
    </div>
  )
}
