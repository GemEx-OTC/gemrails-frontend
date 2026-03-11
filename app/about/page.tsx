"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeft, Target, Lightbulb, Shield, TrendingUp, Globe, CheckCircle,
  Coins, ArrowRight, Zap, DollarSign, Banknote, Repeat, Network, Lock
} from "lucide-react"

// Floating Coin Animation Component
const FloatingCoin = ({ delay, duration, left, top }: { delay: number; duration: number; left: string; top: string }) => (
  <motion.div
    className="absolute"
    style={{ left, top }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      y: [0, -100],
      rotate: [0, 360]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut"
    }}
  >
    <Coins className="w-8 h-8 text-emerald-400" />
  </motion.div>
)

// Payment Flow Animation Component
const PaymentFlowAnimation = () => (
  <div className="relative w-full my-12">
    {/* Desktop Layout */}
    <div className="hidden md:block relative h-64">
      {/* Customer */}
      <motion.div
        className="absolute left-0 flex flex-col items-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-2">
          <DollarSign className="w-10 h-10 text-white" />
        </div>
        <span className="text-sm text-gray-400 font-medium">Customer</span>
        <span className="text-xs text-gray-500">Stablecoin</span>
      </motion.div>

      {/* Animated Arrow 1 */}
      <motion.div
        className="absolute left-24"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-8 h-8 text-emerald-400" />
        </motion.div>
      </motion.div>

      {/* GemRails (Center) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 relative"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(16,185,129,0.3)",
              "0 0 40px rgba(16,185,129,0.6)",
              "0 0 20px rgba(16,185,129,0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-12 h-12 text-white" />
          {/* Rotating particles around GemRails */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-emerald-400"
              animate={{
                rotate: 360,
                x: Math.cos((angle * Math.PI) / 180) * 50,
                y: Math.sin((angle * Math.PI) / 180) * 50,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
        <span className="text-sm text-emerald-400 font-bold">GemRails</span>
        <span className="text-xs text-gray-500">Processing</span>
      </motion.div>

      {/* Animated Arrow 2 */}
      <motion.div
        className="absolute right-24"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          <ArrowRight className="w-8 h-8 text-emerald-400" />
        </motion.div>
      </motion.div>

      {/* Merchant */}
      <motion.div
        className="absolute right-0 flex flex-col items-center"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9 }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2">
          <Banknote className="w-10 h-10 text-white" />
        </div>
        <span className="text-sm text-gray-400 font-medium">Merchant</span>
        <span className="text-xs text-emerald-400 font-semibold">Naira ₦</span>
      </motion.div>

      {/* Floating coins animation */}
      {[...Array(5)].map((_, i) => (
        <FloatingCoin
          key={i}
          delay={i * 0.8}
          duration={3}
          left={`${20 + i * 15}%`}
          top="20%"
        />
      ))}
    </div>

    {/* Mobile Layout - Vertical Flow */}
    <div className="md:hidden flex flex-col items-center gap-6 py-8">
      {/* Customer */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
          <DollarSign className="w-12 h-12 text-white" />
        </div>
        <span className="text-base text-gray-300 font-semibold">Customer</span>
        <span className="text-sm text-gray-500">Pays with Stablecoin</span>
      </motion.div>

      {/* Animated Arrow Down */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="rotate-90"
        >
          <ArrowRight className="w-10 h-10 text-emerald-400" />
        </motion.div>
      </motion.div>

      {/* GemRails (Center) */}
      <motion.div
        className="flex flex-col items-center relative"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 relative shadow-lg"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(16,185,129,0.4)",
              "0 0 40px rgba(16,185,129,0.7)",
              "0 0 20px rgba(16,185,129,0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-14 h-14 text-white" />
          {/* Rotating particles */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-white"
              animate={{
                rotate: 360,
                x: Math.cos((angle * Math.PI) / 180) * 55,
                y: Math.sin((angle * Math.PI) / 180) * 55,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
        <span className="text-base text-emerald-400 font-bold">GemRails</span>
        <span className="text-sm text-gray-500">Instant Processing</span>
      </motion.div>

      {/* Animated Arrow Down */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="rotate-90"
        >
          <ArrowRight className="w-10 h-10 text-emerald-400" />
        </motion.div>
      </motion.div>

      {/* Merchant */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
          <Banknote className="w-12 h-12 text-white" />
        </div>
        <span className="text-base text-gray-300 font-semibold">Merchant</span>
        <span className="text-sm text-emerald-400 font-semibold">Receives Naira ₦</span>
      </motion.div>

      {/* Floating coins for mobile */}
      {[...Array(3)].map((_, i) => (
        <FloatingCoin
          key={i}
          delay={i * 1}
          duration={3}
          left={`${30 + i * 20}%`}
          top={`${20 + i * 20}%`}
        />
      ))}
    </div>
  </div>
)

// Globe Network Animation
const GlobeNetworkAnimation = () => (
  <div className="relative w-full flex items-center justify-center my-12 overflow-hidden">
    {/* Desktop Layout */}
    <div className="hidden md:block relative w-full h-80">
      {/* Central Africa Node */}
      <motion.div
        className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative"
          animate={{
            boxShadow: [
              "0 0 30px rgba(16,185,129,0.4)",
              "0 0 60px rgba(16,185,129,0.8)",
              "0 0 30px rgba(16,185,129,0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Globe className="w-16 h-16 text-white" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Connection Nodes */}
      {[
        { angle: 0, label: "Nigeria", delay: 0.2 },
        { angle: 72, label: "Ghana", delay: 0.4 },
        { angle: 144, label: "Kenya", delay: 0.6 },
        { angle: 216, label: "South Africa", delay: 0.8 },
        { angle: 288, label: "Egypt", delay: 1.0 }
      ].map((node, i) => {
        const radius = 150
        const x = Math.cos((node.angle * Math.PI) / 180) * radius
        const y = Math.sin((node.angle * Math.PI) / 180) * radius
        
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: node.delay }}
          >
            {/* Connection Line */}
            <motion.div
              className="absolute w-1 bg-gradient-to-r from-emerald-500 to-transparent"
              style={{
                height: radius,
                transformOrigin: "bottom",
                rotate: node.angle + 180,
                bottom: 0,
                left: "50%"
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: node.delay, duration: 0.5 }}
            />
            
            {/* Node */}
            <motion.div
              className="w-12 h-12 rounded-full bg-gray-800 border-2 border-emerald-500 flex items-center justify-center"
              animate={{
                borderColor: ["#10b981", "#14b8a6", "#10b981"]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </motion.div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
              {node.label}
            </span>
          </motion.div>
        )
      })}
    </div>

    {/* Mobile Layout - Simplified Grid */}
    <div className="md:hidden w-full py-8">
      {/* Central Node */}
      <motion.div
        className="flex justify-center mb-12"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative shadow-lg"
          animate={{
            boxShadow: [
              "0 0 20px rgba(16,185,129,0.4)",
              "0 0 40px rgba(16,185,129,0.8)",
              "0 0 20px rgba(16,185,129,0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Globe className="w-14 h-14 text-white" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Country Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {[
          { label: "Nigeria", delay: 0.2 },
          { label: "Ghana", delay: 0.3 },
          { label: "Kenya", delay: 0.4 },
          { label: "South Africa", delay: 0.5 },
          { label: "Egypt", delay: 0.6 }
        ].map((node, i) => (
          <motion.div
            key={i}
            className={`flex flex-col items-center gap-2 p-4 bg-gray-900/50 border border-gray-800 rounded-xl ${i === 4 ? 'col-span-2' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: node.delay }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-gray-800 border-2 border-emerald-500 flex items-center justify-center"
              animate={{
                borderColor: ["#10b981", "#14b8a6", "#10b981"]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </motion.div>
            <span className="text-sm text-gray-300 font-medium">{node.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)

// Security Shield Animation
const SecurityAnimation = () => (
  <div className="relative w-full h-64 flex items-center justify-center my-8">
    <motion.div
      className="relative"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
    >
      {/* Shield */}
      <motion.div
        className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative"
        animate={{
          boxShadow: [
            "0 0 30px rgba(16,185,129,0.3)",
            "0 0 60px rgba(16,185,129,0.6)",
            "0 0 30px rgba(16,185,129,0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Shield className="w-20 h-20 text-white" />
        
        {/* Rotating lock icons */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              rotate: 360,
              x: Math.cos((angle * Math.PI) / 180) * 80,
              y: Math.sin((angle * Math.PI) / 180) * 80,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.25
            }}
          >
            <Lock className="w-6 h-6 text-emerald-400" />
          </motion.div>
        ))}
      </motion.div>

      {/* Pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-3xl border-2 border-emerald-400"
          animate={{
            scale: [1, 2, 2],
            opacity: [0.8, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6
          }}
        />
      ))}
    </motion.div>
  </div>
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ bottom: "10%", right: "10%" }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <motion.img 
                src="/logo/logo_icon.png" 
                alt="GemRails" 
                className="w-10 h-10 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              <span className="text-xl font-bold text-white">GemRails</span>
            </Link>
            
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              About <motion.span 
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                GemRails
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-gray-400 leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Digital asset checkout payment infrastructure built for African commerce
            </motion.p>
          </motion.div>

          {/* Animated Icon Grid */}
          <div className="flex justify-center gap-4 sm:gap-8 mt-12">
            {[
              { icon: Coins, delay: 0.5 },
              { icon: Zap, delay: 0.7 },
              { icon: Globe, delay: 0.9 }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay }}
                whileHover={{ scale: 1.2, rotate: 360 }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Gemrails is digital asset Checkout payment infrastructure built for African commerce. We enable businesses to accept stablecoin payments and settle transactions seamlessly across modern financial rails.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              By connecting blockchain networks with real-world commerce, Gemrails helps merchants become borderless – Accept global payments while keeping operations as traditional it was…
            </p>
          </motion.div>

          {/* Payment Flow Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-8 px-4">How Payments Flow</h3>
            <PaymentFlowAnimation />
          </motion.div>

          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">The Problem</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              The adoption of stablecoins has grown rapidly, but using them in everyday commerce remains difficult. While many people now hold digital dollars, there are still limited and inefficient ways to spend them in real-world transactions.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              At the same time, many businesses are open to accepting stablecoins but lack the infrastructure to do so without disrupting their existing operations, accounting systems, and payment workflows.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              As a result, there is a growing gap between people who want to spend stablecoins and businesses that could accept them, but lack a simple way to connect the two. Gemrails bridges this gap by enabling businesses to accept stablecoin payments seamlessly while continuing to operate through their existing commercial systems.
            </p>
          </motion.div>

          {/* The Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">The Solution</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Gemrails provides the infrastructure that allows businesses to accept stablecoin payments without changing how they already operate. When a customer chooses to pay with a supported stablecoin, Gemrails handles the transaction processing behind the scenes.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              The stablecoin payment is received through the Gemrails infrastructure, converted through our liquidity systems, and settled to the merchant in local currency through their existing banking channels.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              This allows businesses to accept stablecoins as a payment method while continuing to operate with their familiar financial systems, accounting processes, and bank relationships. By managing the technical complexity of blockchain payments, conversion, and settlement, Gemrails enables businesses to participate in stablecoin-powered commerce without needing to build new systems or change how they run their operations.
            </p>
          </motion.div>

          {/* Our Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center px-4">Our Vision</h2>
            
            {/* Globe Network Animation */}
            <GlobeNetworkAnimation />
            
            <div className="px-4">
              <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                We believe the future of commerce will be more open, faster, and globally connected. Digital assets, particularly stablecoins, are beginning to reshape how value moves across borders and between people.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                But for this future to become practical, digital assets must integrate seamlessly with the systems businesses already rely on to operate.
              </p>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Gemrails is building the infrastructure that connects stablecoin liquidity to everyday commerce — making it possible for digital dollars to move as easily through businesses as traditional payments do today. We are starting in Nigeria and expanding across Africa, building financial rails designed for a new era of commerce.
              </p>
            </div>
          </motion.div>

          {/* Our Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Focus</h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-center">
              Gemrails is focused on building reliable infrastructure that connects stablecoins to real-world commerce. Our work centers on five core priorities:
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Stablecoin-Powered Commerce",
                  description: "We enable businesses to accept stablecoin payments in a way that integrates seamlessly with their existing operations, allowing customers to spend digital dollars in everyday transactions.",
                  color: "from-emerald-500 to-teal-500"
                },
                {
                  icon: Repeat,
                  title: "Efficient Settlement",
                  description: "Gemrails handles the processing, conversion, and settlement of stablecoin payments so businesses can receive funds directly in their bank accounts without needing to manage digital assets themselves.",
                  color: "from-teal-500 to-cyan-500"
                },
                {
                  icon: Globe,
                  title: "Infrastructure for African Markets",
                  description: "We are building payment rails designed for the realities of African commerce, starting in Nigeria and expanding across the continent.",
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  icon: Shield,
                  title: "Compliance and Risk Management",
                  description: "Compliance and transaction monitoring are built into the foundation of the Gemrails platform. We implement risk monitoring systems and operational controls designed to support responsible and compliant payment processing.",
                  color: "from-blue-500 to-purple-500"
                },
                {
                  icon: Lock,
                  title: "Reliability and Security",
                  description: "Our infrastructure is designed for stability, security, and consistent transaction processing, ensuring businesses can rely on Gemrails as dependable financial infrastructure for digital asset payments.",
                  color: "from-purple-500 to-emerald-500"
                }
              ].map((focus, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex gap-4 p-6 bg-gray-900/50 border border-gray-800 rounded-xl group-hover:border-emerald-500/50 transition-all">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${focus.color} p-0.5`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <focus.icon className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{focus.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{focus.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Animation */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-white mb-4">Bank-Grade Security</h3>
              <SecurityAnimation />
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center py-12 px-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl overflow-hidden"
          >
            {/* Animated background particles */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: 0
                }}
              />
            ))}
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-400 mb-6">Join thousands of businesses accepting stablecoin payments</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Register Your Business
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} GemRails. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
