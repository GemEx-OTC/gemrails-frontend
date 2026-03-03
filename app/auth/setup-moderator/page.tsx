"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { enterpriseApi } from "@/lib/api/enterprise"

function SetupModeratorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing invitation token")
      router.push("/auth/login")
    }
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      await enterpriseApi.setupModerator({ token: token!, password })
      setIsSuccess(true)
      toast.success("Account set up successfully!")
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to set up account")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Setup Complete!</h1>
          <p className="text-gray-400 mt-2">Your account has been successfully created. Redirecting you to login...</p>
        </div>
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Complete Your Setup</h1>
        <p className="text-gray-400 mt-2">Set a secure password for your GemRails moderator account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 font-outfit">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 font-outfit">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full bg-gray-900/50 border border-gray-800 focus:border-emerald-500/50 text-white pl-12 pr-4 py-3.5 rounded-xl transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            By setting your password, you agree to GemRails' <span className="text-emerald-400">Terms of Service</span> and <span className="text-emerald-400">Privacy Policy</span>.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Complete Setup</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default function SetupModeratorPage() {
  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-gray-400">Loading setup...</p>
          </div>
        }
      >
        <SetupModeratorContent />
      </Suspense>

      <p className="text-center text-gray-500 text-sm mt-8 border-t border-gray-800/50 pt-8">
        &copy; {new Date().getFullYear()} GemRails. Secure Enterprise Solutions.
      </p>
    </div>
  )
}
