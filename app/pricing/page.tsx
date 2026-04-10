"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft, ArrowRight, Sparkles, Building2, User, CheckCircle,
  Zap, Shield, Banknote, Code, HeadphonesIcon, RefreshCw,
  Landmark, CircleDollarSign, Info, Rocket, Lock
} from "lucide-react"

const comparisonRows = [
  {
    feature: "Pricing",
    icon: CircleDollarSign,
    merchant: "$0 Merchant Onboarding",
    consumer: "$0 (Network Expansion Phase)",
    highlight: true,
  },
  {
    feature: "Who it's for",
    icon: User,
    merchant: "Businesses that want to accept stablecoin payments and receive NGN settlements",
    consumer: "Individuals paying merchants using stablecoins",
  },
  {
    feature: "Stablecoin Payments",
    icon: Banknote,
    merchant: "Accept payments from customers paying with stablecoins",
    consumer: "Pay merchants directly using stablecoins",
  },
  {
    feature: "Conversion Handling",
    icon: RefreshCw,
    merchant: "Automatic conversion from stablecoins to NGN",
    consumer: "Not required — payments are sent in stablecoins",
  },
  {
    feature: "Bank Settlement",
    icon: Landmark,
    merchant: "Direct settlement to merchant bank accounts",
    consumer: "Not applicable",
  },
  {
    feature: "Crypto Exposure",
    icon: Shield,
    merchant: "None — merchants receive fiat",
    consumer: "Consumers pay using their existing stablecoins",
  },
  {
    feature: "Integration",
    icon: Code,
    merchant: "Merchant API / checkout integration",
    consumer: "Simple payment experience",
  },
  {
    feature: "Fees",
    icon: Zap,
    merchant: "No onboarding cost",
    consumer: "Zero transaction fees during the network expansion phase",
    highlight: true,
  },
  {
    feature: "Support",
    icon: HeadphonesIcon,
    merchant: "Merchant integration and onboarding support",
    consumer: "Standard consumer support",
  },
]

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"merchant" | "consumer">("merchant")
  const [cardIndex, setCardIndex] = useState(0)

  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity }} style={{ top: "10%", left: "10%" }} />
        <motion.div className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }} transition={{ duration: 20, repeat: Infinity }} style={{ bottom: "10%", right: "10%" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <motion.img src="/logo/logo_icon.png" alt="GemRails" className="w-10 h-10 rounded-xl" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} />
              <span className="text-xl font-bold text-white">GemRails</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-8 sm:pt-32 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6" animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles className="w-4 h-4" />
              Transparent Pricing
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              GemRails{" "}
              <motion.span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: "200% 200%" }}>
                Pricing
              </motion.span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Simple, transparent pricing for merchants and consumers. No hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards - Carousel on mobile, grid on desktop */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Tablet & Desktop: side by side */}
          <div className="hidden sm:grid sm:grid-cols-2 gap-4 md:gap-6">
            {/* Merchant Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 md:p-8 group-hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Merchants</h3>
                    <p className="text-gray-500 text-xs">For businesses</p>
                  </div>
                </div>
                <div className="mb-5 md:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-black text-white">$0</span>
                    <span className="text-gray-500 text-sm">onboarding</span>
                  </div>
                  <p className="text-emerald-400 text-sm mt-1">Free to get started</p>
                </div>
                <ul className="space-y-2.5 md:space-y-3 mb-5 md:mb-6">
                  {["Accept stablecoin payments", "Auto-convert to NGN", "Direct bank settlement", "Zero crypto exposure", "API / checkout integration", "Dedicated onboarding support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/auth/signup" className="block w-full text-center py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                    Start Accepting Payments
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            {/* Consumer Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 md:p-8 group-hover:border-teal-500/50 transition-all">
                <div className="absolute top-3 md:top-4 right-3 md:right-4">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">EXPANSION PHASE</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">Consumers</h3>
                    <p className="text-gray-500 text-xs">For individuals</p>
                  </div>
                </div>
                <div className="mb-5 md:mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-black text-white">$0</span>
                    <span className="text-gray-500 text-sm">transaction fees</span>
                  </div>
                  <p className="text-teal-400 text-sm mt-1">During network expansion phase</p>
                </div>
                <ul className="space-y-2.5 md:space-y-3 mb-5 md:mb-6">
                  {["Pay merchants with stablecoins", "Simple payment experience", "Zero transaction fees (expansion phase)", "Use existing stablecoin wallets", "No conversion needed", "Standard consumer support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/auth/signup" className="block w-full text-center py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                    Start Paying with Crypto
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Mobile: Swipeable carousel */}
          <div className="sm:hidden">
            {/* Tab buttons above carousel */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setCardIndex(0)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  cardIndex === 0
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-900/50 text-gray-500 border border-gray-800/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Merchants
              </button>
              <button
                onClick={() => setCardIndex(1)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  cardIndex === 1
                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                    : "bg-gray-900/50 text-gray-500 border border-gray-800/50"
                }`}
              >
                <User className="w-4 h-4" />
                Consumers
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              {/* Glow behind active card */}
              <motion.div
                className="absolute -inset-1 rounded-2xl blur-lg z-0"
                animate={{
                  background: cardIndex === 0
                    ? "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(20,184,166,0.1))"
                    : "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(6,182,212,0.1))"
                }}
                transition={{ duration: 0.4 }}
              />

              <motion.div
                className="flex relative z-10"
                animate={{ x: cardIndex === 0 ? "0%" : "-100%" }}
                transition={{ type: "spring", stiffness: 250, damping: 28 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40) setCardIndex(1)
                  if (info.offset.x > 40) setCardIndex(0)
                }}
              >
                {/* Merchant Card - Mobile */}
                <div className="w-full flex-shrink-0">
                  <motion.div
                    animate={{ scale: cardIndex === 0 ? 1 : 0.95, opacity: cardIndex === 0 ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-gray-900 border border-emerald-500/20 rounded-2xl p-6 overflow-hidden"
                  >
                    {/* Decorative corner gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                          animate={{ rotate: [0, 3, -3, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Building2 className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Merchants</h3>
                          <p className="text-gray-500 text-xs">For businesses</p>
                        </div>
                      </div>

                      <div className="mb-5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">$0</span>
                          <span className="text-gray-500 text-sm">onboarding</span>
                        </div>
                        <p className="text-emerald-400 text-sm mt-1 font-medium">Free to get started</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {["Accept stablecoin payments", "Auto-convert to NGN", "Direct bank settlement", "Zero crypto exposure", "API / checkout integration", "Dedicated onboarding support"].map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: cardIndex === 0 ? i * 0.05 : 0 }}
                            className="flex items-start gap-2.5 text-sm text-gray-300"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                            </div>
                            {item}
                          </motion.li>
                        ))}
                      </ul>

                      <Link href="/auth/signup" className="block w-full text-center py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                        Start Accepting Payments
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Consumer Card - Mobile */}
                <div className="w-full flex-shrink-0">
                  <motion.div
                    animate={{ scale: cardIndex === 1 ? 1 : 0.95, opacity: cardIndex === 1 ? 1 : 0.5 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-gray-900 border border-teal-500/20 rounded-2xl p-6 overflow-hidden"
                  >
                    {/* Decorative corner gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="relative">
                      <div className="absolute top-0 right-0">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/20 font-semibold">EXPANSION PHASE</span>
                      </div>

                      <div className="flex items-center gap-3 mb-5">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20"
                          animate={{ rotate: [0, -3, 3, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <User className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Consumers</h3>
                          <p className="text-gray-500 text-xs">For individuals</p>
                        </div>
                      </div>

                      <div className="mb-5 p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">$0</span>
                          <span className="text-gray-500 text-sm">transaction fees</span>
                        </div>
                        <p className="text-teal-400 text-sm mt-1 font-medium">During network expansion phase</p>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {["Pay merchants with stablecoins", "Simple payment experience", "Zero transaction fees (expansion phase)", "Use existing stablecoin wallets", "No conversion needed", "Standard consumer support"].map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: cardIndex === 1 ? i * 0.05 : 0 }}
                            className="flex items-start gap-2.5 text-sm text-gray-300"
                          >
                            <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-teal-400" />
                            </div>
                            {item}
                          </motion.li>
                        ))}
                      </ul>

                      <Link href="/auth/signup" className="block w-full text-center py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
                        Start Paying with Crypto
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Carousel indicators */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <button onClick={() => setCardIndex(0)} className={`h-2 rounded-full transition-all duration-300 ${cardIndex === 0 ? "w-8 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/30" : "w-2 bg-gray-700"}`} />
              <button onClick={() => setCardIndex(1)} className={`h-2 rounded-full transition-all duration-300 ${cardIndex === 1 ? "w-8 bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md shadow-teal-500/30" : "w-2 bg-gray-700"}`} />
            </div>
            <motion.p
              className="text-center text-gray-600 text-xs mt-2"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Swipe to compare
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Stats Strip */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              { value: "$0", label: "Setup Cost", icon: CircleDollarSign, gradient: "from-emerald-500 to-teal-500" },
              { value: "<1min", label: "Settlement", icon: Zap, gradient: "from-teal-500 to-cyan-500" },
              { value: "24/7", label: "Availability", icon: RefreshCw, gradient: "from-cyan-500 to-blue-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gray-900/60 border border-gray-800/50 rounded-2xl p-4 sm:p-5 md:p-6 text-center overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <div className={`text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</div>
                <div className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Comparison Section - Interactive */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              What You <span className="text-emerald-400">Get</span>
            </h2>
            <p className="text-gray-500 text-sm mb-8">Toggle to see features for each user type</p>

            {/* Big interactive toggle */}
            <div className="inline-flex items-center p-1.5 bg-gray-900/80 border border-gray-800 rounded-2xl relative">
              {/* Animated background pill */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-xl"
                animate={{
                  left: activeTab === "merchant" ? "6px" : "50%",
                  right: activeTab === "merchant" ? "50%" : "6px",
                  background: activeTab === "merchant" 
                    ? "linear-gradient(135deg, #10b981, #14b8a6)" 
                    : "linear-gradient(135deg, #14b8a6, #06b6d4)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setActiveTab("merchant")}
                className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === "merchant" ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Merchants</span>
              </button>
              <button
                onClick={() => setActiveTab("consumer")}
                className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === "consumer" ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <User className="w-4 h-4" />
                <span>For Consumers</span>
              </button>
            </div>
          </motion.div>

          {/* Feature cards in a bento-style grid */}
          {/* Feature cards - horizontal scroll on mobile, grid on desktop */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {comparisonRows.map((row, idx) => {
              const isHighlight = row.highlight
              const content = activeTab === "merchant" ? row.merchant : row.consumer
              const FeatureIcon = row.icon
              return (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`group relative rounded-2xl p-4 md:p-5 transition-all duration-300 cursor-default overflow-hidden ${
                    isHighlight
                      ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30"
                      : "bg-gray-900/50 border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/70"
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isHighlight ? "bg-gradient-to-br from-emerald-500/10 to-transparent" : "bg-gradient-to-br from-gray-700/20 to-transparent"
                  }`} />
                  {isHighlight && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                        <Zap className="w-3 h-3" />KEY
                      </span>
                    </motion.div>
                  )}
                  <div className="relative mb-3 md:mb-4">
                    <motion.div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${isHighlight ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gray-800 group-hover:bg-gray-700"} transition-colors`} whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                      <FeatureIcon className={`w-4 h-4 md:w-5 md:h-5 ${isHighlight ? "text-white" : "text-gray-300"}`} />
                    </motion.div>
                    <motion.div
                      className={`absolute inset-0 rounded-xl border-2 ${isHighlight ? "border-emerald-400/50" : "border-gray-600/40"}`}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: isHighlight ? 2 : 3, repeat: Infinity, delay: idx * 0.2 }}
                    />
                  </div>
                  <h3 className={`text-sm font-bold mb-2 ${isHighlight ? "text-emerald-300" : "text-white"}`}>{row.feature}</h3>
                  <motion.p key={`${row.feature}-${activeTab}`} initial={{ opacity: 0, x: activeTab === "merchant" ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="text-sm text-gray-400 leading-relaxed">
                    {content}
                  </motion.p>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${isHighlight ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent" : "bg-gradient-to-r from-gray-700 to-transparent opacity-0 group-hover:opacity-100"} transition-opacity`} />
                </motion.div>
              )
            })}
          </div>

          {/* Mobile: horizontal scroll cards */}
          <div className="sm:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
              {comparisonRows.map((row, idx) => {
                const isHighlight = row.highlight
                const content = activeTab === "merchant" ? row.merchant : row.consumer
                const FeatureIcon = row.icon
                return (
                  <motion.div
                    key={row.feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex-shrink-0 w-[75vw] snap-center rounded-2xl p-5 overflow-hidden relative ${
                      isHighlight
                        ? "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30"
                        : "bg-gray-900/50 border border-gray-800/60"
                    }`}
                  >
                    {isHighlight && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                        <Zap className="w-3 h-3" />KEY
                      </span>
                    )}
                    <div className="relative mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isHighlight ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gray-800"}`}>
                        <FeatureIcon className={`w-5 h-5 ${isHighlight ? "text-white" : "text-gray-300"}`} />
                      </div>
                      <motion.div
                        className={`absolute inset-0 rounded-lg border-2 ${isHighlight ? "border-emerald-400/50" : "border-gray-600/40"}`}
                        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: isHighlight ? 2 : 3, repeat: Infinity, delay: idx * 0.2 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className={`text-sm font-bold ${isHighlight ? "text-emerald-300" : "text-white"}`}>{row.feature}</h3>
                      <span className="text-[10px] text-gray-600 font-mono">{idx + 1}/{comparisonRows.length}</span>
                    </div>
                    <motion.p key={`${row.feature}-${activeTab}-m`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="text-xs text-gray-400 leading-relaxed">
                      {content}
                    </motion.p>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${isHighlight ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent" : "bg-transparent"}`} />
                  </motion.div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-gray-600">
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.div>
              <p className="text-gray-600 text-[11px]">Swipe to explore features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Network Expansion Note */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-14 md:pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Network Expansion Phase</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  GemRails is currently prioritizing ecosystem growth and stablecoin adoption. Consumers can use the network at <span className="text-emerald-400 font-semibold">$0 cost</span> while the network expands.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Future pricing will remain <span className="text-white font-medium">transparent and transaction-based</span>, designed to be cheaper than traditional payment rails.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center py-12 sm:py-14 md:py-16 px-6 sm:px-8 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10" />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20" />
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{ border: "1px solid transparent" }}
              animate={{
                boxShadow: [
                  "inset 0 0 20px rgba(16,185,129,0.1)",
                  "inset 0 0 40px rgba(16,185,129,0.2)",
                  "inset 0 0 20px rgba(16,185,129,0.1)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/40"
                animate={{ y: [0, -150, 0], x: [0, (i % 2 === 0 ? 30 : -30), 0], opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
                style={{ left: `${5 + i * 6}%`, bottom: 0 }}
              />
            ))}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }} />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6"
              >
                <Rocket className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Ready to Get Started?</h3>
              <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto">Join hundreds of businesses already accepting stablecoin payments with GemRails</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 sm:px-7 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                    Register Your Business
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 sm:px-7 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
                    Contact Sales
                  </Link>
                </motion.div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-gray-800/50">
                {[
                  { icon: Shield, label: "Secure" },
                  { icon: Zap, label: "Fast" },
                  { icon: Lock, label: "Compliant" }
                ].map((badge, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-1.5 text-gray-500">
                    <badge.icon className="w-4 h-4 text-emerald-400/60" />
                    <span className="text-xs">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">© {new Date().getFullYear()} GemRails. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/anti-money" className="hover:text-emerald-400 transition-colors">AML Policy</Link>
              <Link href="/merchant-agreement" className="hover:text-emerald-400 transition-colors">Merchant Agreement</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-color">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
