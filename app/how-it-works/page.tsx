"use client"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft, Building2, QrCode, Smartphone, Zap, ArrowRight,
  CheckCircle, Clock, Shield, TrendingUp, Banknote, Globe,
  Sparkles, User, Coins, Landmark, CircleCheck, Rocket, Lock
} from "lucide-react"

const steps = [
  {
    num: 1,
    title: "Register Your Business",
    subtitle: "STEP 1",
    desc: "Sign up and verify your business in minutes",
    icon: Building2,
    color: "emerald" as const,
    gradient: "from-emerald-500 to-teal-500",
    items: ["Quick online form", "Upload documents", "Get verified fast"],
  },
  {
    num: 2,
    title: "Get Your QR Code",
    subtitle: "STEP 2",
    desc: "Receive your unique payment QR code instantly",
    icon: QrCode,
    color: "teal" as const,
    gradient: "from-teal-500 to-cyan-500",
    items: ["Instant generation", "Download & print", "Share digitally"],
  },
  {
    num: 3,
    title: "Customer Pays",
    subtitle: "STEP 3",
    desc: "Customer scans and pays with Stablecoins",
    icon: Smartphone,
    color: "cyan" as const,
    gradient: "from-cyan-500 to-blue-500",
    items: ["Scan QR code", "Pay with USDT/USDC", "Instant confirmation"],
  },
  {
    num: 4,
    title: "Instant Settlement",
    subtitle: "STEP 4",
    desc: "Receive Naira + N100 bonus instantly",
    icon: Zap,
    color: "blue" as const,
    gradient: "from-blue-500 to-emerald-500",
    items: ["Auto conversion", "Bank in seconds", "N100 bonus"],
  },
]
const colorMap = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  teal: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
}

const flowNodes = [
  { Icon: User, label: "Customer", sub: "Scans QR", imgSrc: "" },
  { Icon: Coins, label: "Stablecoin", sub: "USDT/USDC", imgSrc: "" },
  { Icon: null, label: "GemRails", sub: "Converts", imgSrc: "/apple-touch-icon.png" },
  { Icon: Landmark, label: "Bank", sub: "NGN Deposit", imgSrc: "" },
  { Icon: CircleCheck, label: "Merchant", sub: "Receives N", imgSrc: "" },
]

const whyFeatures = [
  {
    icon: Zap,
    title: "Instant Conversion & Settlement",
    desc: "When a customer pays with stablecoins, GemRails automatically receives the payment, converts it to local currency, and settles the funds directly to your bank account.",
    highlight: "Your business receives fiat in the bank, while customers enjoy paying with digital dollars.",
    gradient: "from-emerald-500 to-teal-500",
    ring: "border-emerald-500/40",
    glow: "shadow-emerald-500/20",
    steps: ["Receive stablecoin payment", "Convert to local currency", "Settle to bank account"],
  },
  {
    icon: Banknote,
    title: "No Cost to Get Started",
    desc: "GemRails is currently in its network expansion phase, which means onboarding and usage are free. No setup fees. No onboarding fees for merchants.",
    highlight: "We believe adoption should come before monetization.",
    gradient: "from-teal-500 to-cyan-500",
    ring: "border-teal-500/40",
    glow: "shadow-teal-500/20",
    steps: ["$0 merchant onboarding", "$0 consumer transactions", "Free during expansion"],
  },
  {
    icon: Shield,
    title: "No Crypto Knowledge Required",
    desc: "You don't need wallets, private keys, or blockchain expertise. GemRails handles the technical infrastructure so your team can continue operating like a normal business.",
    highlight: "Unlock a new global payment rail without the complexity.",
    gradient: "from-cyan-500 to-blue-500",
    ring: "border-cyan-500/40",
    glow: "shadow-cyan-500/20",
    steps: ["No wallets needed", "No private keys", "No blockchain expertise"],
  },
  {
    icon: TrendingUp,
    title: "Built for Reliability",
    desc: "Payments infrastructure must be dependable. GemRails is designed with high uptime settlement systems, secure transaction monitoring, and enterprise-grade payment routing.",
    highlight: "Merchants can rely on it for everyday commerce.",
    gradient: "from-blue-500 to-emerald-500",
    ring: "border-blue-500/40",
    glow: "shadow-blue-500/20",
    steps: ["High uptime systems", "Secure monitoring", "Enterprise-grade routing"],
  },
]
function WhyChooseSection() {
  const [currentCard, setCurrentCard] = useState(0)

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    const swipe = info.offset.x
    if (swipe < -50 && currentCard < whyFeatures.length - 1) {
      setCurrentCard(currentCard + 1)
    } else if (swipe > 50 && currentCard > 0) {
      setCurrentCard(currentCard - 1)
    }
  }

  function renderCard(feature: typeof whyFeatures[number], i: number) {
    const FeatureIcon = feature.icon
    return (
      <div
        key={i}
        className={`relative rounded-2xl border ${feature.ring} bg-gray-900/60 p-6 overflow-hidden group hover:bg-gray-900/80 transition-all`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 ${feature.glow} shadow-lg`}>
          <FeatureIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-400 text-sm mb-3 leading-relaxed">{feature.desc}</p>
        <p className="text-emerald-400/80 text-xs italic mb-3">{feature.highlight}</p>
        <div className="flex flex-wrap gap-2">
          {feature.steps.map((step, j) => (
            <span key={j} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700/50">
              <CheckCircle className="w-3 h-3 text-emerald-400/60" />
              {step}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Why Choose <span className="text-emerald-400">GemRails</span></h2>
          <p className="text-gray-500 text-sm">Everything you need to accept stablecoin payments</p>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          {whyFeatures.map((feature, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {renderCard(feature, i)}
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            animate={{ x: `-${currentCard * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex"
          >
            {whyFeatures.map((feature, i) => (
              <div key={i} className="w-full flex-shrink-0 px-1">
                {renderCard(feature, i)}
              </div>
            ))}
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-4">
            {whyFeatures.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${currentCard === i ? "w-6 bg-emerald-400" : "w-2 bg-gray-700"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev: number) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ bottom: "10%", right: "10%" }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
      </div>

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
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      <section className="relative pt-28 pb-8 sm:pt-32 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
              animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              Simple and Fast
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              How It{" "}
              <motion.span
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Works
              </motion.span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Start accepting stablecoin payments in 4 simple steps. No technical knowledge required.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-24">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-3 sm:p-4 overflow-hidden">
                  <video ref={videoRef} className="w-full rounded-xl max-h-[400px] object-contain" poster="/video-poster.jpeg" controls>
                    <source src="/videos/how-it-works.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex items-center gap-2 mt-3 px-1">
                    <div className="flex items-center gap-1.5">
                      <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      <span className="text-xs text-gray-500">Watch the demo</span>
                    </div>
                    <div className="flex-1" />
                    <span className="text-xs text-gray-600">See how easy it is</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Setup Time", value: "< 5 min", icon: Clock },
                  { label: "Settlement", value: "Instant", icon: Zap },
                  { label: "Bonus", value: "N100/tx", icon: Banknote },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-3 text-center">
                    <stat.icon className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-white text-sm font-semibold">{stat.value}</div>
                    <div className="text-gray-500 text-[10px]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="relative">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">4 Steps to <span className="text-emerald-400">Get Started</span></h2>
                <p className="text-gray-500 text-sm">From registration to receiving payments</p>
              </motion.div>
              <div className="absolute left-[23px] top-[120px] bottom-[52px] w-[2px] bg-gradient-to-b from-emerald-500/30 via-cyan-500/30 to-blue-500/30 hidden sm:block z-0" />
              <div className="space-y-4 sm:space-y-6">
                {steps.map((step, idx) => {
                  const colors = colorMap[step.color]
                  const isActive = activeStep === idx
                  const StepIcon = step.icon
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} onClick={() => setActiveStep(idx)} className="relative cursor-pointer group">
                      <div className="hidden sm:block absolute left-0 top-6 z-10">
                        <motion.div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? `bg-gradient-to-br ${step.gradient} border-transparent shadow-lg` : "bg-[#0a0d10] border-gray-700 group-hover:border-gray-500"}`} animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}>
                          <StepIcon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                        </motion.div>
                        {isActive && <motion.div className={`absolute inset-0 rounded-full border-2 ${colors.border}`} animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                      </div>
                      <div className={`sm:ml-[68px] relative rounded-xl border transition-all duration-300 overflow-hidden ${isActive ? `${colors.border} bg-gray-900/80` : "border-gray-800/50 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-900/60"}`}>
                        <motion.div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${step.gradient}`} initial={{ scaleY: 0 }} animate={{ scaleY: isActive ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ transformOrigin: "top" }} />
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`sm:hidden flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${step.gradient}`}>
                              <StepIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold tracking-wider ${colors.text}`}>{step.subtitle}</span>
                                {isActive && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`text-[9px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>ACTIVE</motion.span>}
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{step.title}</h3>
                              <p className="text-gray-400 text-xs sm:text-sm mb-3">{step.desc}</p>
                              <AnimatePresence initial={false}>
                                {isActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="flex flex-wrap gap-1 pt-1 pb-1">
                                      {step.items.map((item, i) => (
                                        <span key={i} className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                                          <CheckCircle className="w-3 h-3" />
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className={`flex-shrink-0 text-3xl sm:text-4xl font-black transition-colors duration-300 ${isActive ? colors.text : "text-gray-800"}`}>{step.num}</div>
                          </div>
                        </div>
                        {isActive && <motion.div className={`h-0.5 bg-gradient-to-r ${step.gradient}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4, ease: "linear" }} style={{ transformOrigin: "left" }} />}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-2 mt-6 sm:hidden">
                {steps.map((step, idx) => (
                  <button key={idx} onClick={() => setActiveStep(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep === idx ? `w-6 bg-gradient-to-r ${step.gradient}` : "bg-gray-700"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">The <span className="text-emerald-400">Flow</span></h2>
            <p className="text-gray-500 text-sm">How your payment moves from customer to your bank</p>
          </motion.div>
          <div className="hidden md:flex items-center justify-between relative">
            <div className="absolute top-[32px] left-[32px] right-[32px] h-[2px] -translate-y-1/2 z-0">
              <div className="w-full h-full bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30" />
              <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" animate={{ left: ["0%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            </div>
            {flowNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative z-10 flex flex-col items-center">
                <motion.div whileHover={{ scale: 1.1, y: -5 }} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border ${i === 2 ? "bg-[#0a0d10] border-emerald-500/50 shadow-lg shadow-emerald-500/20" : "bg-[#0a0d10] border-gray-700"}`}>
                  {node.imgSrc ? (
                    <img src={node.imgSrc} alt={node.label} className="w-10 h-10 rounded-lg" />
                  ) : node.Icon ? (
                    <node.Icon className="w-7 h-7 text-gray-300" />
                  ) : null}
                </motion.div>
                <span className="text-white text-xs font-semibold mt-2">{node.label}</span>
                <span className="text-gray-500 text-[10px]">{node.sub}</span>
              </motion.div>
            ))}
          </div>
          <div className="md:hidden flex flex-col items-center gap-1">
            {flowNodes.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border w-full max-w-[260px] ${i === 2 ? "bg-[#0a0d10] border-emerald-500/40" : "bg-gray-900/50 border-gray-800/50"}`}>
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                    {node.imgSrc ? (
                      <img src={node.imgSrc} alt={node.label} className="w-7 h-7 rounded" />
                    ) : node.Icon ? (
                      <node.Icon className="w-5 h-5 text-gray-300" />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{node.label}</div>
                    <div className="text-gray-500 text-[10px]">{node.sub}</div>
                  </div>
                </div>
                {i < 4 && (
                  <motion.div className="w-[2px] h-4 bg-gradient-to-b from-emerald-500/30 to-transparent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose GemRails */}
      <WhyChooseSection />

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center py-16 px-8 rounded-3xl overflow-hidden"
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
            ))}            <div className="absolute inset-0 opacity-[0.02]" style={{
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
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Join hundreds of businesses already accepting stablecoin payments with GemRails</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                    Register Your Business
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">
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
            <p className="text-gray-500 text-sm text-center md:text-left"> {new Date().getFullYear()} GemRails. All rights reserved.</p>
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