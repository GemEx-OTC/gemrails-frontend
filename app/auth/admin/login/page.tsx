"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { toast } from "sonner"
import { useAdminLogin } from "@/lib/hooks/use-auth"
import type { ApiError } from "@/lib/api/types"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const adminLoginMutation = useAdminLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    adminLoginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Admin login successful!")
        },
        onError: (err: ApiError) => {
          toast.error(err.message || "Invalid credentials. Please try again.")
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium text-sm">Admin Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Access</h1>
        <p className="text-gray-400 mt-2">Sign in to manage the platform</p>
      </div>

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
              placeholder="admin@gemexrails.com"
              disabled={adminLoginMutation.isPending}
              className="gemrails-input-icon"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              disabled={adminLoginMutation.isPending}
              className="w-full bg-gray-800/60 border border-gray-700 focus:border-emerald-500 text-white placeholder-gray-500 pl-12 pr-12 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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

        <motion.button
          type="submit"
          disabled={adminLoginMutation.isPending}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="gemrails-button w-full flex items-center justify-center gap-2"
        >
          {adminLoginMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Access Dashboard"
          )}
        </motion.button>
      </form>

      <Link href="/auth/login" className="block text-center text-sm text-gray-500 hover:text-white mt-6">
        ← Back to Merchant Login
      </Link>
    </div>
  )
}
