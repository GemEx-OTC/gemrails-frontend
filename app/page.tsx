"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  QrCode,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Building2,
  Smartphone,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0d10]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/logo/logo_icon.png" alt="GemRails" className="w-10 h-10 rounded-xl" />
              <div>
                <span className="text-xl font-bold text-white">GemRails</span>
                <p className="text-xs text-emerald-400">by GemEx</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Instant Naira Settlement
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Accept Crypto,{" "}
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Get Naira Instantly
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Enable your business to accept <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Stable Coin</span> payments with instant Naira
                settlement. No crypto knowledge required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Register Your Business
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white border border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Start accepting crypto payments in minutes with our simple QR code system
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: Building2,
                title: "Register",
                desc: "Sign up and verify your business in minutes",
              },
              {
                step: 2,
                icon: QrCode,
                title: "Get QR Code",
                desc: "Receive your unique payment QR code",
              },
              {
                step: 3,
                icon: Smartphone,
                title: "Customer Pays",
                desc: "Customer scans and pays with Stable Coins",
              },
              {
                step: 4,
                icon: Zap,
                title: "Instant Settlement",
                desc: "Receive Naira + ₦100 bonus instantly",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-emerald-400 font-bold mb-2">Step {item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why Choose GemRails?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Instant Settlement",
                    desc: "Receive Naira in your bank account within seconds of payment confirmation, No custody of crypto, just settlement",
                  },
                  {
                    icon: TrendingUp,
                    title: "Earn ₦100 Bonus Per Transaction",
                    desc: "Get a bonus on every successful payment - it adds up fast!",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Compliant",
                    desc: "Bank-grade security with full regulatory compliance",
                  },
                  {
                    icon: QrCode,
                    title: "Simple QR Payments",
                    desc: "No complex integrations - just display your QR code",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8"
            >
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Business QR Code
                </h3>
                <p className="text-gray-400 mb-4">
                  Customers scan to pay with Stable Coins
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Verified Merchant
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Accept Crypto Payments?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of businesses already using GemRails
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo/logo_icon.png" alt="GemRails" className="w-8 h-8 rounded-lg" />
              <span className="text-white font-semibold">GemRails</span>
              <span className="text-gray-500">by GemEx</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GemRails. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
