"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0d10] relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-teal-500/20 via-transparent to-transparent blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-8 xl:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-12">
              <img src="/logo/logo_icon.png" alt="GemRails" className="w-12 h-12 rounded-xl shadow-lg shadow-emerald-500/20" />
              <div>
                <span className="text-2xl font-bold text-white">GemRails</span>
              </div>
            </Link>

            <div className="space-y-6">
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight">
                Accept Crypto,{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Get Naira Instantly
                </span>
              </h1>
              <p className="text-base xl:text-lg text-gray-400 leading-relaxed max-w-md">
                Enable your business to accept USDT & USDC payments with instant Naira
                settlement. No crypto knowledge required.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {[
              { icon: "🏪", text: "Perfect for every type of business" },
              { icon: "💨", text: "Instant Naira settlement to your bank" },
              { icon: "🎁", text: "Earn ₦100 bonus on every transaction" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-gray-400">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo/logo_icon.png" alt="GemRails" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20" />
                <div>
                  <span className="text-xl font-bold text-white">GemRails</span>
                </div>
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
