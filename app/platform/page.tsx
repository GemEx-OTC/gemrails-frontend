"use client"

import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  ArrowRight, CheckCircle, ChevronDown, Zap, Shield, Globe, Banknote,
  BarChart3, Code2, Webhook, Users, Building2, QrCode, Link2, FileText,
  Lock, Eye, ShieldCheck, BookOpen, Cpu, RefreshCw, Clock, TrendingUp,
  AlertTriangle, CreditCard, Truck, Heart, GraduationCap, Briefcase,
  ShoppingCart, Hotel, Utensils, Plane, ArrowDown, Menu, X, Sparkles,
  Star, Terminal, Copy, CheckCheck, Layers, Landmark, SmartphoneNfc,
  CircuitBoard, Rocket, Server, Check, ArrowUpRight, Activity,
  ChevronLeft, AlertCircle, Wallet, Loader2, CheckCircle2, Plus, Search,
} from "lucide-react"

// ─── Utilities ────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / 60
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

function Blob({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-[120px] pointer-events-none", className)}
      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

function Marquee({ items, speed = 40 }: { items: React.ReactNode[]; speed?: number }) {
  return (
    <div className="relative overflow-hidden flex">
      <motion.div
        className="flex gap-0 shrink-0"
        animate={{ x: [0, "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="shrink-0">{item}</div>
        ))}
      </motion.div>
    </div>
  )
}

function FAQItem({ question, answer, isOpen, onClick, id }: { question: string; answer: string; isOpen: boolean; onClick: () => void; id: string }) {
  return (
    <motion.div className="border-b border-gray-800/80 last:border-0" initial={false}>
      <button id={id} onClick={onClick} aria-expanded={isOpen} className="w-full py-6 flex items-start justify-between gap-4 text-left focus:outline-none group">
        <span className={cn("font-medium transition-colors text-base leading-snug", isOpen ? "text-emerald-400" : "text-white group-hover:text-emerald-300")}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 mt-0.5">
          <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center transition-colors", isOpen ? "border-emerald-500 bg-emerald-500/10" : "border-gray-700 group-hover:border-gray-600")}>
            <ArrowRight className="w-3 h-3 text-current -rotate-45" />
          </div>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
            <p className="pb-6 text-gray-400 leading-relaxed pr-10">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── iPhone 17 Pro Max Checkout Demo ─────────────────────────────────────────

type DemoStep = "amount" | "crypto" | "payment" | "processing" | "success"

const DEMO_MERCHANT = { name: "GreenLeaf Supermarket", emoji: "🏪", verified: true }
const DEMO_WALLET = "TXq8rP9mN3kLwB2xYvZ7cEd6..."
const DEMO_TX_ID = "TXN-GR-2024-98123"
const EXCHANGE_RATE = 1634.25 // NGN per USD
type DemoNetworkKey = "BSC" | "BASE" | "POLYGON" | "ARBITRUM" | "OPTIMISM" | "ETH" | "TRC20"

const DEMO_NETWORKS: Record<DemoNetworkKey, { name: string; label: string; badge: string; badgeType: "recommended" | "low" | "high"; icon: string }> = {
  BSC: { name: "BNB Smart Chain (BSC)", label: "BSC", badge: "Recommended • Low Fee", badgeType: "recommended", icon: "/icons/chains/bnb.svg" },
  BASE: { name: "Base", label: "Base", badge: "Recommended • Low Fee", badgeType: "recommended", icon: "/icons/chains/base.svg" },
  POLYGON: { name: "Polygon", label: "Polygon", badge: "Low Fee", badgeType: "low", icon: "/icons/chains/polygon.svg" },
  ARBITRUM: { name: "Arbitrum", label: "Arbitrum", badge: "Low Fee", badgeType: "low", icon: "/icons/chains/arbitrum.svg" },
  OPTIMISM: { name: "Optimism", label: "Optimism", badge: "Low Fee", badgeType: "low", icon: "/icons/chains/optimism.svg" },
  ETH: { name: "Ethereum (ERC-20)", label: "Ethereum", badge: "High Fee", badgeType: "high", icon: "/icons/chains/eth.svg" },
  TRC20: { name: "TRON (TRC-20)", label: "TRC-20", badge: "High Fee", badgeType: "high", icon: "/icons/chains/tron.svg" },
}

function CheckoutDemo() {
  const [step, setStep] = useState<DemoStep>("amount")
  const [typedAmount, setTypedAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<"USDT" | "USDC">("USDT")
  const [selectedNetwork, setSelectedNetwork] = useState<DemoNetworkKey>("BSC")
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(899)
  const [autoPlaying, setAutoPlaying] = useState(true)
  const [isInteractive, setIsInteractive] = useState(false)

  // Auto-cycle through all steps for demo when autoplay is active
  useEffect(() => {
    if (!autoPlaying || isInteractive) return
    const sequence: { step: DemoStep; delay: number }[] = [
      { step: "amount", delay: 0 },
      { step: "crypto", delay: 3500 },
      { step: "payment", delay: 7000 },
      { step: "processing", delay: 11000 },
      { step: "success", delay: 13500 },
    ]
    const timers = sequence.map(({ step, delay }) =>
      setTimeout(() => {
        setStep(step)
        if (step === "amount") setTypedAmount("")
      }, delay)
    )
    // Loop back to start
    const loopTimer = setTimeout(() => {
      setStep("amount")
      setTypedAmount("")
    }, 18500)

    return () => { timers.forEach(clearTimeout); clearTimeout(loopTimer) }
  }, [autoPlaying, isInteractive])

  // Auto-type amount when autoplaying on Step 1
  useEffect(() => {
    if (step !== "amount" || isInteractive) return
    const digits = "47250"
    let i = 0
    const t = setInterval(() => {
      setTypedAmount(digits.slice(0, i + 1))
      i++
      if (i >= digits.length) clearInterval(t)
    }, 180)
    return () => clearInterval(t)
  }, [step, isInteractive])

  // Countdown timer simulation for payment screen
  useEffect(() => {
    if (step !== "payment") { setTimeLeft(899); return }
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [step])

  // Automatic copy address simulation when autoplaying on Step 3
  useEffect(() => {
    if (step !== "payment" || isInteractive) return
    const t = setTimeout(() => setCopied(true), 2500)
    return () => clearTimeout(t)
  }, [step, isInteractive])

  // Auto-advance from processing loader to success screen
  useEffect(() => {
    if (step !== "processing") return
    const t = setTimeout(() => setStep("success"), 2500)
    return () => clearTimeout(t)
  }, [step])

  const handleKeypadPress = (val: string) => {
    // Switch to manual sandbox mode
    setAutoPlaying(false)
    setIsInteractive(true)

    if (val === "clear") {
      setTypedAmount("")
    } else if (val === "back") {
      setTypedAmount(prev => prev.slice(0, -1))
    } else {
      // Limit to 9 million Naira to fit the card screen
      if (typedAmount.length < 7) {
        setTypedAmount(prev => (prev === "" && val === "0" ? "" : prev + val))
      }
    }
  }

  const handlePresetSelect = (amt: number) => {
    setAutoPlaying(false)
    setIsInteractive(true)
    setTypedAmount(amt.toString())
  }

  const handleBack = () => {
    if (step === "crypto") setStep("amount")
    else if (step === "payment") setStep("crypto")
  }

  const handleContinue = () => {
    const numericVal = Number(typedAmount) || 0
    if (numericVal < 5000) return // Enforce minimum NGN amount
    setStep("crypto")
  }

  const handleGetAddress = () => {
    setStep("payment")
  }

  const handleSentPayment = () => {
    setStep("processing")
  }

  const handleCopyManual = () => {
    navigator.clipboard.writeText(DEMO_WALLET).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const currentNgnAmount = Number(typedAmount) || 0
  const currentCryptoAmount = currentNgnAmount > 0 ? currentNgnAmount / EXCHANGE_RATE : 0
  const formattedAmount = currentNgnAmount > 0 ? currentNgnAmount.toLocaleString() : ""
  
  const showProgress = step !== "processing" && step !== "success"
  const progressVal = step === "amount" ? 0 : step === "crypto" ? 50 : 100

  return (
    <div className="relative w-full h-full bg-[#0a0d10] overflow-hidden flex flex-col text-white select-none">
      {/* Glow circles */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-[50px] pointer-events-none" />

      {/* Demo Header */}
      <header className="relative z-10 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-md shrink-0">
        <div className="px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-base shrink-0">
              {DEMO_MERCHANT.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xs truncate leading-none">{DEMO_MERCHANT.name}</p>
              <div className="flex items-center gap-0.5 text-emerald-100 text-[9px] mt-0.5">
                <Shield className="w-2.5 h-2.5 text-white shrink-0" />
                <span>Verified</span>
              </div>
            </div>
          </div>

          {/* Sandbox Toggle */}
          <div className="flex items-center bg-black/35 rounded-full p-0.5 border border-white/10 shrink-0">
            <button 
              onClick={() => { setAutoPlaying(true); setIsInteractive(false); setStep("amount"); setTypedAmount("") }}
              className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold transition-all", autoPlaying ? "bg-emerald-500 text-white" : "text-gray-400")}
            >
              Demo
            </button>
            <button 
              onClick={() => { setAutoPlaying(false); setIsInteractive(true); setStep("amount"); setTypedAmount("15000") }}
              className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold transition-all", isInteractive ? "bg-emerald-500 text-white" : "text-gray-400")}
            >
              Test
            </button>
          </div>
        </div>
      </header>

      {/* Progress slider bar */}
      <div className="h-1 bg-gray-800 shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"
          initial={{ width: "0%" }}
          animate={{ width: showProgress ? `${progressVal}%` : "100%" }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {/* Core viewport */}
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">

          {/* STEP: Amount Screen */}
          {step === "amount" && (
            <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col p-4 gap-3">
              {/* Input section */}
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-[10px] mb-3 font-medium">Enter transaction amount</p>
                <div className="inline-flex items-center justify-center bg-gray-800/40 rounded-xl px-4 py-2 border border-gray-700/50">
                  <span className="text-xl text-emerald-400 mr-1 font-light">₦</span>
                  <span className="text-2xl font-bold text-white min-w-[2.5ch] text-left">
                    {formattedAmount || <span className="text-gray-600">0</span>}
                  </span>
                  <motion.span
                    className="inline-block w-0.5 h-6 bg-emerald-400 ml-0.5 rounded-full"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                </div>
                {isInteractive && currentNgnAmount > 0 && currentNgnAmount < 5000 && (
                  <p className="text-red-400 text-[9px] mt-1.5">Minimum payment is ₦5,000</p>
                )}
                {!isInteractive && (
                  <p className="text-gray-500 text-[9px] mt-1.5">Minimum: ₦5,000</p>
                )}
                
                {/* Preset quick buttons */}
                <div className="grid grid-cols-4 gap-1.5 mt-3">
                  {[5000, 10000, 25000, 75000].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => handlePresetSelect(amt)}
                      className={cn(
                        "py-1.5 rounded-lg text-[10px] font-bold border transition-all active:scale-95",
                        currentNgnAmount === amt 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent"
                          : "bg-gray-800/40 border-gray-700/60 text-gray-400"
                      )}
                    >
                      ₦{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimate badge */}
              {currentNgnAmount >= 5000 && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl py-2 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-medium">≈ {currentCryptoAmount.toFixed(2)} USDT/USDC</span>
                </motion.div>
              )}

              {/* Interactive Keypad */}
              {isInteractive ? (
                <div className="bg-gray-950/50 rounded-2xl p-2.5 border border-white/[0.04] grid grid-cols-3 gap-1 text-center shrink-0">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map(key => {
                    const isControl = key === "clear" || key === "back"
                    return (
                      <button
                        key={key}
                        onClick={() => handleKeypadPress(key)}
                        className={cn(
                          "py-2 rounded-xl text-sm font-bold active:bg-emerald-500/20 transition-all",
                          isControl ? "text-gray-500 bg-gray-900/30 text-xs" : "text-white bg-gray-800/30 hover:bg-gray-800/50"
                        )}
                      >
                        {key === "clear" ? "C" : key === "back" ? "⌫" : key}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              <button 
                onClick={handleContinue}
                disabled={currentNgnAmount < 5000}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md flex items-center justify-center gap-1.5 text-xs disabled:opacity-40 disabled:active:scale-100 active:scale-[0.98] transition-transform shrink-0"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* STEP: Crypto selection */}
          {step === "crypto" && (
            <motion.div key="crypto" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col p-4 gap-3">
              <button onClick={handleBack} className="flex items-center gap-1 text-gray-400 text-xs hover:text-white transition-colors self-start active:scale-95">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {/* Paying summary header */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center relative overflow-hidden">
                <p className="text-gray-400 text-[10px] mb-1 font-medium">Checkout Amount</p>
                <p className="text-2xl font-bold text-white mb-1">₦{currentNgnAmount.toLocaleString()}</p>
                <span className="text-emerald-400 font-semibold text-xs">≈ {currentCryptoAmount.toFixed(2)} {selectedAsset}</span>
              </div>

              {/* Coin option */}
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3.5 shrink-0">
                <h4 className="text-white font-semibold text-[10px] uppercase tracking-wider mb-2.5 text-gray-500">1. Select Asset</h4>
                <div className="flex gap-2">
                  {(["USDT", "USDC"] as const).map(asset => (
                    <button 
                      key={asset}
                      onClick={() => {
                        setSelectedAsset(asset)
                        if (asset === "USDC" && selectedNetwork === "TRC20") {
                          setSelectedNetwork("BSC")
                        }
                      }}
                      className={cn(
                        "flex-1 p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all active:scale-95",
                        selectedAsset === asset ? "border-emerald-500 bg-emerald-500/10 text-white" : "border-gray-800 bg-gray-800/30 text-gray-400"
                      )}
                    >
                      <span className="text-emerald-400 text-xs font-bold">$</span>
                      {asset}
                      {selectedAsset === asset && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network option - Dropdown Selector matching live pay UI */}
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3.5 shrink-0 relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-semibold text-[10px] uppercase tracking-wider text-gray-500">2. Select Network</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPlaying(false)
                      setIsInteractive(true)
                      setNetworkDropdownOpen(!networkDropdownOpen)
                    }}
                    className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5 hover:underline"
                  >
                    <span>{networkDropdownOpen ? "Close list" : "Change network"}</span>
                    <ChevronDown className={cn("w-3 h-3 transition-transform", networkDropdownOpen && "rotate-180")} />
                  </button>
                </div>

                {/* Active Selected Network Selector Card */}
                <button
                  type="button"
                  onClick={() => {
                    setAutoPlaying(false)
                    setIsInteractive(true)
                    setNetworkDropdownOpen(!networkDropdownOpen)
                  }}
                  className="w-full p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-white flex items-center justify-between text-left transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={DEMO_NETWORKS[selectedNetwork].icon} alt="" className="w-4 h-4 object-contain shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-white truncate">{DEMO_NETWORKS[selectedNetwork].name}</span>
                      <span className={cn(
                        "text-[9px] font-semibold block",
                        DEMO_NETWORKS[selectedNetwork].badgeType === "recommended" ? "text-emerald-400" :
                        DEMO_NETWORKS[selectedNetwork].badgeType === "low" ? "text-teal-400" : "text-amber-400"
                      )}>
                        {DEMO_NETWORKS[selectedNetwork].badge}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </button>

                {/* Network Selection Grid/Dropdown */}
                {networkDropdownOpen ? (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 space-y-1 max-h-[140px] overflow-y-auto pr-0.5">
                    {(Object.keys(DEMO_NETWORKS) as DemoNetworkKey[])
                      .filter(netKey => !(selectedAsset === "USDC" && netKey === "TRC20"))
                      .map(netKey => {
                        const net = DEMO_NETWORKS[netKey]
                        const isSel = selectedNetwork === netKey
                        return (
                          <button
                            key={netKey}
                            type="button"
                            onClick={() => {
                              setSelectedNetwork(netKey)
                              setNetworkDropdownOpen(false)
                            }}
                            className={cn(
                              "w-full p-2 rounded-lg border flex items-center justify-between text-left text-xs font-semibold transition-all",
                              isSel ? "border-emerald-500 bg-emerald-500/15 text-white" : "border-gray-800/80 bg-gray-900/80 hover:bg-gray-800 text-gray-300"
                            )}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <img src={net.icon} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
                              <span className="truncate text-[10px]">{net.name}</span>
                            </div>
                            <span className={cn(
                              "text-[8px] font-medium px-1.5 py-0.5 rounded border shrink-0",
                              net.badgeType === "recommended" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                              net.badgeType === "low" ? "bg-teal-500/10 border-teal-500/20 text-teal-400" :
                              "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                              {net.badge.split("•")[0].trim()}
                            </span>
                          </button>
                        )
                      })}
                  </motion.div>
                ) : (
                  /* Quick Pill Bar for Top Networks */
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {(["BSC", "BASE", "POLYGON"] as const).map(netKey => (
                      <button
                        key={netKey}
                        type="button"
                        onClick={() => {
                          setAutoPlaying(false)
                          setIsInteractive(true)
                          setSelectedNetwork(netKey)
                        }}
                        className={cn(
                          "p-1.5 rounded-lg border flex items-center justify-center gap-1 text-[10px] font-semibold transition-all active:scale-95",
                          selectedNetwork === netKey ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold" : "border-gray-800 bg-gray-800/20 text-gray-400"
                        )}
                      >
                        <img src={DEMO_NETWORKS[netKey].icon} alt="" className="w-3 h-3 object-contain shrink-0" />
                        <span>{netKey}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1" />
              <button 
                onClick={handleGetAddress}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] transition-all shrink-0"
              >
                <Wallet className="w-4 h-4" /> Get Payment Address
              </button>
            </motion.div>
          )}

          {/* STEP: Payment address */}
          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col p-4 gap-2.5 overflow-y-auto">
              <button onClick={handleBack} className="flex items-center gap-1 text-gray-400 text-xs hover:text-white transition-colors self-start shrink-0 active:scale-95">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {/* Timer info */}
              <div className={cn("border rounded-xl p-2.5 flex items-center justify-center gap-2 shrink-0 transition-all text-xs", timeLeft < 120 ? "bg-red-500/10 border-red-500/20 text-red-300" : "bg-amber-500/10 border-amber-500/20 text-amber-300")}>
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                <span>remaining</span>
              </div>

              {/* Custom payment amount */}
              <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center shrink-0">
                <p className="text-gray-400 text-[10px] mb-1 font-medium">Transfer exactly</p>
                <p className="text-3xl font-bold text-white">{currentCryptoAmount.toFixed(2)}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 rounded-full px-3 py-1 mt-2">
                  <img src={DEMO_NETWORKS[selectedNetwork].icon} alt="" className="w-3.5 h-3.5 object-contain" />
                  <strong>{selectedAsset}</strong> · {DEMO_NETWORKS[selectedNetwork].name}
                </span>
              </div>

              {/* Address wallet card */}
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3.5 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-[10px] font-medium">To this deposit address:</p>
                </div>
                <div className="flex items-stretch gap-1.5">
                  <code className="flex-1 text-[10px] text-white bg-gray-800/80 p-2.5 rounded-lg break-all font-mono border border-gray-700/60 leading-normal">{DEMO_WALLET}</code>
                  <button
                    onClick={handleCopyManual}
                    className={cn(
                      "px-3 rounded-lg border transition-all active:scale-95 flex items-center justify-center shrink-0",
                      copied ? "bg-emerald-500 border-transparent text-white" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Important card */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 shrink-0">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-300 leading-snug">
                    Transfer only <strong className="text-white">{selectedAsset}</strong> over the <strong className="text-white">{DEMO_NETWORKS[selectedNetwork].name}</strong> network. Wrong network selection causes permanent loss.
                  </p>
                </div>
              </div>

              <div className="flex-grow" />
              <button 
                onClick={handleSentPayment}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] transition-all shrink-0"
              >
                <Check className="w-4 h-4" /> I've Sent the Payment
              </button>
            </motion.div>
          )}

          {/* STEP: Loading confirmation */}
          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex items-center justify-center p-4">
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 text-center w-full">
                <div className="relative w-14 h-14 mx-auto mb-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-gray-800 border-t-emerald-500 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Verifying Deposit</h3>
                <p className="text-gray-400 text-[10px] leading-relaxed max-w-[200px] mx-auto">Confirming block hashes on the {DEMO_NETWORKS[selectedNetwork].name} blockchain...</p>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs">
                    <Check className="w-3 h-3" />
                    <span className="text-[10px]">Payment detected on-chain</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span className="text-[10px]">Matching Naira settlement...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: Confirmed success */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col p-4 gap-2.5 overflow-y-auto">
              <div className="text-center pt-2 shrink-0">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-3 relative">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-0.5">Payment Confirmed! 🎉</h2>
                <p className="text-gray-400 text-[10px]">Shopping with crypto like a boss.</p>
              </div>

              {/* Receipt details */}
              <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-3.5 shrink-0">
                <h4 className="text-white font-bold text-[10px] uppercase tracking-wider mb-2.5 text-gray-500">Transaction details</h4>
                <div className="space-y-1.5">
                  {[
                    { label: "Amount Settled", value: `₦${currentNgnAmount.toLocaleString()}` },
                    { label: "Crypto Received", value: `${currentCryptoAmount.toFixed(2)} ${selectedAsset}` },
                    { label: "Chain Network", value: DEMO_NETWORKS[selectedNetwork].name },
                    { label: "Merchant Account", value: DEMO_MERCHANT.name },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-[11px] py-1 border-b border-gray-800 last:border-0">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="text-white font-semibold">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-gray-400 text-[11px]">Hash ID Reference</span>
                    <span className="text-emerald-400 font-mono font-bold text-[9px] bg-emerald-500/10 px-2 py-0.5 rounded">{DEMO_TX_ID}</span>
                  </div>
                </div>
              </div>

              {/* Notification card */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center shrink-0">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-[10px]">Settlement Complete</span>
                </div>
                <p className="text-gray-300 text-[9px]">Funds will land in the bank account within ~3 seconds.</p>
              </div>

              <div className="flex-grow" />
              {/* Reset interactive demo options */}
              <div className="grid grid-cols-2 gap-2 shrink-0">
                <button 
                  onClick={() => { setStep("amount"); setTypedAmount("") }}
                  className="py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800/60 border border-gray-700/80 hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  Test Again
                </button>
                <button 
                  onClick={() => { setAutoPlaying(true); setIsInteractive(false); setStep("amount"); setTypedAmount("") }}
                  className="py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md hover:shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center"
                >
                  Auto-Play
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}

// Missing icon shim
function Download({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

// ─── iPhone 17 Pro Max Frame ───────────────────────────────────────────────────

function IPhone17Frame() {
  return (
    <div className="relative mx-auto select-none" style={{ width: 340, height: 680 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-6 rounded-[60px] bg-emerald-500/10 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Phone outer shell — Titanium finish */}
      <div className="absolute inset-0 rounded-[46px] bg-gradient-to-br from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]" />

      {/* Titanium side rails */}
      <div className="absolute inset-[3px] rounded-[43px] bg-gradient-to-br from-[#48484a] via-[#3a3a3c] to-[#2c2c2e]" />

      {/* Screen bezel */}
      <div className="absolute inset-[5px] rounded-[41px] bg-[#1c1c1e] overflow-hidden">
        {/* Screen itself */}
        <div className="absolute inset-[3px] rounded-[38px] overflow-hidden bg-[#0a0d10]">

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              className="bg-black rounded-full flex items-center justify-center overflow-hidden"
              animate={{ width: [120, 125, 120], height: [32, 33, 32] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Camera + sensors */}
              <div className="flex items-center gap-4 px-4">
                <div className="w-2 h-2 rounded-full bg-[#1c1c1e] border border-[#2c2c2e] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#3a3a3c]" />
                </div>
                <div className="w-3 h-3 rounded-full border-2 border-[#333] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#222]" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-end justify-between px-6 pb-1 z-40">
            <span className="text-white text-[10px] font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <div className="flex items-end gap-0.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 bg-white rounded-[1px]" style={{ height: h }} />
                ))}
              </div>
              {/* WiFi */}
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.5 8.5C4.6 5.4 8.8 3.5 13 3.5c4.2 0 8.4 1.9 11.5 5L22 11c-2.5-2.5-5.9-4-9-4s-6.5 1.5-9 4L1.5 8.5zM5 12c2.1-2.1 5-3.5 8-3.5s5.9 1.4 8 3.5l-2.5 2.5C16.9 13 15 12 13 12s-3.9 1-5.5 2.5L5 12zM13 20l-3.5-3.5c.9-.9 2.2-1.5 3.5-1.5s2.6.6 3.5 1.5L13 20z" />
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-0.5">
                <div className="w-5 h-2.5 rounded-[3px] border border-white/80 relative overflow-hidden">
                  <div className="absolute inset-[1px] left-[1px] right-[2px] bg-white rounded-[2px]" />
                </div>
                <div className="w-0.5 h-1.5 bg-white/60 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* Screen content — the actual checkout UI */}
          <div className="absolute inset-0 pt-12">
            <CheckoutDemo />
          </div>

          {/* Home bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Volume buttons (left side) */}
      <div className="absolute left-[-4px] top-28 w-1 h-8 bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] rounded-l-sm" />
      <div className="absolute left-[-4px] top-40 w-1 h-12 bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] rounded-l-sm" />
      <div className="absolute left-[-4px] top-56 w-1 h-12 bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] rounded-l-sm" />

      {/* Power button (right side) */}
      <div className="absolute right-[-4px] top-36 w-1 h-16 bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] rounded-r-sm" />

      {/* Screen shine */}
      <div className="absolute inset-[8px] rounded-[36px] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
    </div>
  )
}

// ─── Typewriter Quote Animation ────────────────────────────────────────────────

function TypewriterQuote() {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [currentLength, setCurrentLength] = useState(0)

  const seg1 = "GemRails is to stablecoin payments what "
  const seg2 = "Stripe is to card payments"
  const seg3 = " — infrastructure that makes the complexity invisible."
  const totalLength = seg1.length + seg2.length + seg3.length

  useEffect(() => {
    if (isInView) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setCurrentLength(i)
        if (i >= totalLength) {
          clearInterval(timer)
        }
      }, 35)
      return () => clearInterval(timer)
    }
  }, [isInView])

  const renderText = () => {
    if (currentLength <= seg1.length) {
      return (
        <>
          {seg1.slice(0, currentLength)}
          <span className="animate-pulse text-emerald-400">|</span>
        </>
      )
    }
    if (currentLength <= seg1.length + seg2.length) {
      const seg2Len = currentLength - seg1.length
      return (
        <>
          {seg1}
          <span className="text-emerald-400">{seg2.slice(0, seg2Len)}</span>
          <span className="animate-pulse text-emerald-400">|</span>
        </>
      )
    }
    const seg3Len = currentLength - seg1.length - seg2.length
    const showCursor = currentLength < totalLength
    return (
      <>
        {seg1}
        <span className="text-emerald-400">{seg2}</span>
        {seg3.slice(0, seg3Len)}
        {showCursor && <span className="animate-pulse text-emerald-400">|</span>}
      </>
    )
  }

  return (
    <p ref={ref} className="text-xl sm:text-2xl text-white font-medium leading-relaxed mb-8 min-h-[96px] sm:min-h-[80px]">
      {renderText()}
    </p>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function PlatformPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"node" | "curl" | "python">("node")
  const [copiedTab, setCopiedTab] = useState<string | null>(null)
  const [activeFAQCategory, setActiveFAQCategory] = useState<string>("general")
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("")
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [mouseX, mouseY])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedTab(key)
    setTimeout(() => setCopiedTab(null), 2000)
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Platform", href: "/platform", active: true },
    { label: "OTC Desk", href: "/platform/otc-desk" },
    { label: "Developers", href: "/developers" },
    { label: "Documentation", href: "/docs" },
    { label: "Pricing", href: "/pricing" },
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://gemrails.com/#organization", name: "GemRails", url: "https://gemrails.com", logo: { "@type": "ImageObject", url: "https://gemrails.com/logo/logo_icon.png" }, description: "GemRails is a stablecoin payment infrastructure provider that enables African businesses to accept USDT and USDC payments and receive instant settlement in Nigerian Naira." },
      { "@type": "WebSite", "@id": "https://gemrails.com/#website", url: "https://gemrails.com", name: "GemRails", publisher: { "@id": "https://gemrails.com/#organization" } },
      { "@type": "WebPage", "@id": "https://gemrails.com/platform#webpage", url: "https://gemrails.com/platform", name: "Stablecoin Payment Infrastructure for African Businesses | GemRails", breadcrumb: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://gemrails.com" }, { "@type": "ListItem", position: 2, name: "Platform", item: "https://gemrails.com/platform" }] } },
      { "@type": "FAQPage", mainEntity: faqData.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ],
  }

  const codeSnippets = {
    node: `const gemrails = require('@gemrails/sdk')

const client = new gemrails.Client({
  apiKey: process.env.GEMRAILS_SECRET_KEY,
})

const payment = await client.payments.initiate({
  amount: 47250,       // NGN
  network: 'TRC20',
  reference: 'ORDER-991',
})

console.log(payment.walletAddress)
// "TXq8rP9mN3kLwB2xYvZ7..."`,
    curl: `curl -X POST https://api.gemrails.com/v1/payments/initiate \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 47250,
    "currency": "NGN",
    "network": "TRC20",
    "reference": "ORDER-991"
  }'`,
    python: `import gemrails

client = gemrails.Client(api_key="sk_live_...")

payment = client.payments.initiate(
    amount=47250,
    currency="NGN",
    network="TRC20",
    reference="ORDER-991",
)

print(payment.wallet_address)
# → "TXq8rP9mN3kLwB2xYvZ7..."`,
  }

  const filteredFAQs = faqData.filter(faq => {
    if (faqSearchQuery.trim() !== "") {
      const q = faqSearchQuery.toLowerCase()
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    }
    return faq.category === activeFAQCategory
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 z-[60] origin-left" style={{ scaleX }} />

      {/* Cursor spotlight */}
      <motion.div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          x: useTransform(mouseX, v => v - 250),
          y: useTransform(mouseY, v => v - 250),
        }}
      />

      <div className="min-h-screen bg-[#050709] overflow-x-hidden text-white selection:bg-emerald-500/30">

        {/* ══ HEADER ═══════════════════════════ */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050709]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2.5" aria-label="GemRails Home">
                <motion.img src="/logo/logo_icon.png" alt="GemRails" className="w-8 h-8 rounded-xl" whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.4 }} />
                <span className="font-bold text-white">GemRails</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                {navLinks.map(link => (
                  <Link key={link.label} href={link.href} aria-current={link.active ? "page" : undefined}
                    className={cn("px-3.5 py-1.5 rounded-lg text-sm transition-all", link.active ? "bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-white transition-colors">Sign in</Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/contact" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                    Contact Sales
                  </Link>
                </motion.div>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-400 rounded-lg" aria-label="Toggle menu">
                <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-white/[0.06] bg-[#050709]/95 overflow-hidden">
                <div className="px-4 py-4 space-y-1">
                  {navLinks.map(link => (
                    <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                      className={cn("block px-3 py-2.5 rounded-lg text-sm", link.active ? "text-emerald-400 bg-emerald-500/10 font-medium" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2.5 text-sm text-gray-400">Sign in</Link>
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">Contact Sales</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ══ HERO — iPhone Mockup ══════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" aria-labelledby="hero-heading">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
            <Blob className="w-[700px] h-[700px] bg-emerald-500/8 -top-48 -left-48" />
            <Blob className="w-[500px] h-[500px] bg-teal-500/8 top-1/2 -right-32" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left — Text */}
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-8">
                  <ol className="flex items-center gap-2 text-xs text-gray-600">
                    <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                    <li aria-hidden>/</li>
                    <li className="text-emerald-400">Platform</li>
                  </ol>
                </nav>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  Live — Accepting payments across Nigeria
                </div>

                <h1 id="hero-heading" className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                  <span className="text-white">Stablecoin</span><br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_3s_linear_infinite]">
                    Payment Rails
                  </span><br />
                  <span className="text-white">for Africa.</span>
                </h1>

                <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-lg">
                  Accept USDT and USDC from any customer, anywhere. GemRails converts and settles in{" "}
                  <span className="text-white font-medium">Nigerian Naira within seconds</span> — no crypto knowledge needed.
                </p>

                {/* Arrow pointing to phone on desktop */}
                <div className="hidden lg:flex items-center gap-3 mb-8 text-gray-500 text-sm">
                  <span>See the real checkout experience →</span>
                  <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                    <Link href="/auth/signup" id="hero-cta-signup"
                      className="relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 text-base">
                      <Sparkles className="w-4 h-4" /> Start for Free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Link href="/contact" id="hero-cta-demo"
                      className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-base">
                      Book a Demo
                    </Link>
                  </motion.div>
                </div>

                <div className="flex flex-wrap gap-5 text-sm text-gray-500">
                  {["No setup fee", "KYC in minutes", "NGN bank settlement", "TRC-20 & BSC"].map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />{t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right — iPhone */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6"
              >
                {/* Step label */}
                <StepLabel />

                {/* The phone */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <IPhone17Frame />
                </motion.div>

                {/* Caption */}
                <p className="text-gray-600 text-xs text-center">Live preview of the actual GemRails checkout flow</p>
              </motion.div>
            </div>
          </div>

          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </section>

        {/* ══ MARQUEE STRIP ════════════════════════════════════════════════ */}
        <div className="py-5 border-y border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <Marquee speed={35} items={[
            { icon: Users, value: "10,000+", label: "Verified Merchants" },
            { icon: Zap, value: "< 5 sec", label: "Avg. Settlement" },
            { icon: Shield, value: "99.9%", label: "Platform Uptime" },
            { icon: Globe, value: "TRC-20 & BSC", label: "Supported Networks" },
            { icon: Banknote, value: "₦0", label: "Onboarding Cost" },
            { icon: ShieldCheck, value: "AES-256", label: "Encryption Standard" },
            { icon: Activity, value: "Real-time", label: "Blockchain Monitoring" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 px-10 text-sm text-gray-500">
              <item.icon className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-white font-semibold">{item.value}</span>
              <span>{item.label}</span>
              <span className="ml-6 text-gray-700">·</span>
            </div>
          ))} />
        </div>

        {/* ══ WHAT IS GEMRAILS ═════════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative" aria-labelledby="what-is-heading">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_50%,rgba(16,185,129,0.06),transparent)]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">The Platform</p>
                <h2 id="what-is-heading" className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">What exactly is GemRails?</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  GemRails is <strong className="text-white">payment infrastructure</strong> — the software layer between your business and the global stablecoin economy. Think of it the way you think of a card terminal, but built for the digital dollar era.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  When a customer pays in USDT or USDC, GemRails handles everything: wallet generation, blockchain monitoring, real-time rate conversion, and Naira settlement directly into your bank account. You see only one thing: <strong className="text-emerald-400">money received</strong>.
                </p>
                <Link href="/auth/signup" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors group">
                  Create a free account <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="relative">
                  <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/30 to-teal-500/10 rounded-3xl" />
                  <div className="relative bg-[#0d1117] rounded-3xl p-10 border border-white/5">
                    <div className="text-6xl text-emerald-500/20 font-serif mb-4">"</div>
                    <TypewriterQuote />
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                      {[{ val: "< 5s", label: "Settlement" }, { val: "$0", label: "FX Fees" }, { val: "0", label: "Chargebacks" }].map(s => (
                        <div key={s.label}><p className="text-2xl font-bold text-emerald-400">{s.val}</p><p className="text-xs text-gray-500 mt-0.5">{s.label}</p></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ THE PROBLEM ══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#080b0f]" aria-labelledby="problem-heading">
          <Blob className="w-[600px] h-[600px] bg-red-500/5 top-0 right-0" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="max-w-2xl mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-red-400 text-sm font-medium uppercase tracking-wider mb-4">The Problem</p>
              <h2 id="problem-heading" className="text-4xl sm:text-5xl font-bold text-white leading-tight">Existing payments are failing Africa.</h2>
            </motion.div>

            {/* Desktop Grid Layout (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
              {problemsData.map((p, i) => (
                <motion.div key={i} className="bg-[#080b0f] p-7 group hover:bg-[#0d1117] transition-colors"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <p.icon className={cn("w-6 h-6 mb-4", p.color)} />
                  <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Mobile Swipe Carousel Layout (hidden on desktop) */}
            <ProblemCarousel />
          </div>
        </section>


        {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="how-it-works-heading">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_80%,rgba(16,185,129,0.07),transparent)]" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center max-w-2xl mx-auto mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">How It Works</p>
              <h2 id="how-it-works-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">From payment to bank account in seconds</h2>
              <p className="text-gray-400 text-lg">Five automated steps. Zero manual work.</p>
            </motion.div>
            <div className="relative">
              {/* Desktop connecting lines */}
              <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-white/[0.06] z-0" />
              <motion.div 
                className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] origin-left z-0" 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeStep / 4 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              {/* Mobile vertical connecting lines */}
              <div className="lg:hidden absolute left-[36px] top-10 bottom-10 w-[2px] bg-white/[0.06] z-0" />
              <motion.div 
                className="lg:hidden absolute left-[36px] top-10 w-[2px] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] origin-top z-0"
                style={{ height: "calc(100% - 80px)" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: activeStep / 4 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />

              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-4 relative z-10">
                {[
                  { icon: SmartphoneNfc, step: "01", title: "Customer Pays", desc: "Scans QR or opens payment link. Sends USDT/USDC from wallet.", color: "from-blue-500/20" },
                  { icon: Eye, step: "02", title: "Detected", desc: "GemRails spots the transaction on-chain in real time.", color: "from-purple-500/20" },
                  { icon: ShieldCheck, step: "03", title: "Verified", desc: "Amount confirmed against exchange rate and buffer.", color: "from-amber-500/20" },
                  { icon: Zap, step: "04", title: "Converted", desc: "Stablecoin converted to exact Naira value instantly.", color: "from-emerald-500/20" },
                  { icon: Landmark, step: "05", title: "Settled", desc: "Naira deposited to your bank. Push notification sent.", color: "from-teal-500/20" },
                ].map((s, i) => {
                  const Icon = s.icon
                  const isActive = activeStep === i
                  const isPassed = i <= activeStep
                  return (
                    <motion.div 
                      key={i} 
                      onClick={() => setActiveStep(i)}
                      className="relative flex flex-row gap-5 items-start text-left lg:flex-col lg:items-start lg:text-left cursor-pointer group"
                      animate={{ scale: isActive ? 1.02 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Icon with pulsing background rings */}
                      <div className={cn(
                        "relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 z-10 bg-[#050709]",
                        isActive 
                          ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)]" 
                          : isPassed 
                            ? "border-emerald-500/30" 
                            : "border-white/10 group-hover:border-white/20"
                      )}>
                        {/* Dynamic active circle pulse */}
                        {isActive && (
                          <span className="absolute inset-0 rounded-2xl border border-emerald-500/40 animate-ping pointer-events-none" />
                        )}
                        <Icon className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-500",
                          isActive 
                            ? "text-emerald-400" 
                            : isPassed 
                              ? "text-emerald-400/80" 
                              : "text-gray-400 group-hover:text-white"
                        )} />
                        
                        {/* Number Badge */}
                        <span className={cn(
                          "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center border transition-all duration-500",
                          isActive 
                            ? "bg-emerald-500 border-transparent text-black shadow-[0_0_10px_rgba(16,185,129,0.6)] font-black" 
                            : isPassed
                              ? "bg-emerald-950 border-emerald-500/40 text-emerald-400"
                              : "bg-[#0b0e14] border-white/10 text-gray-500"
                        )}>
                          {s.step}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="pt-2 lg:pt-0">
                        <h3 className={cn(
                          "font-bold text-sm sm:text-base transition-colors duration-500 mb-1.5",
                          isActive ? "text-emerald-400" : "text-white"
                        )}>
                          {s.title}
                        </h3>
                        <p className={cn(
                          "text-xs sm:text-sm leading-relaxed transition-colors duration-500",
                          isActive ? "text-gray-300" : "text-gray-500"
                        )}>
                          {s.desc}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══ BENTO FEATURES ══════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080b0f] relative" aria-labelledby="features-heading">
          <Blob className="w-[500px] h-[500px] bg-teal-500/8 bottom-0 right-0" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">Everything Included</p>
              <h2 id="features-heading" className="text-4xl sm:text-5xl font-bold text-white mb-4">Built for how African businesses actually operate</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4">
              <motion.div className="lg:col-span-2 lg:row-span-2 relative rounded-2xl overflow-hidden border border-white/[0.07] bg-gradient-to-br from-emerald-950/40 to-[#0d1117] p-8 flex flex-col justify-between min-h-[280px]"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ borderColor: "rgba(16,185,129,0.3)" }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-6"><Zap className="w-6 h-6 text-emerald-400" /></div>
                  <h3 className="text-2xl font-bold text-white mb-3">Instant Settlement</h3>
                  <p className="text-gray-400 leading-relaxed">No 3-day bank delays. As soon as blockchain confirms, Naira lands in your balance — ready for bank withdrawal anytime.</p>
                </div>
                <div className="flex items-end justify-between mt-8">
                  <div><p className="text-5xl font-bold text-emerald-400">~3s</p><p className="text-gray-500 text-sm mt-1">average settlement time</p></div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(b => (
                      <motion.div key={b} className="w-1.5 bg-emerald-500/40 rounded-full" style={{ height: 8 + b * 8 }}
                        animate={{ height: [8 + b * 8, 8 + ((b * 7) % 30), 8 + b * 8] }}
                        transition={{ duration: 1.5, delay: b * 0.15, repeat: Infinity, ease: "easeInOut" }} />
                    ))}
                  </div>
                </div>
              </motion.div>
              {[
                { icon: QrCode, color: "text-teal-400", title: "QR Terminal", desc: "Static or dynamic QR codes for in-store or online." },
                { icon: Link2, color: "text-blue-400", title: "Payment Links", desc: "Shareable links via WhatsApp, email, or social." },
                { icon: Code2, color: "text-emerald-400", title: "Developer API", desc: "REST API + SDKs. Full sandbox. Integrate in hours." },
                { icon: Webhook, color: "text-teal-400", title: "Webhooks", desc: "Real-time events for every payment state change." },
              ].map((item, i) => (
                <motion.div key={i} className="rounded-2xl border border-white/[0.07] bg-[#0d1117] p-6 flex flex-col"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ borderColor: "rgba(16,185,129,0.2)", y: -2 }}>
                  <item.icon className={cn("w-8 h-8 mb-4", item.color)} />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.desc}</p>
                </motion.div>
              ))}
              <motion.div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#0d1117] p-6 flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ borderColor: "rgba(16,185,129,0.2)" }}>
                <div className="flex-1"><Building2 className="w-8 h-8 text-purple-400 mb-4" /><h3 className="text-white font-semibold mb-2">Branch Management</h3><p className="text-gray-500 text-sm leading-relaxed">One account. Multiple locations with independent terminals and reporting.</p></div>
                <div className="flex-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-6 sm:pt-0 sm:pl-6"><Users className="w-8 h-8 text-amber-400 mb-4" /><h3 className="text-white font-semibold mb-2">Role-based Access</h3><p className="text-gray-500 text-sm leading-relaxed">Admin, cashier, and auditor roles with fine-grained permissions.</p></div>
              </motion.div>
              <motion.div className="lg:col-span-4 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-[#0d1117] to-[#0a1a14] p-8 flex flex-col sm:flex-row items-center justify-between gap-8"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ borderColor: "rgba(16,185,129,0.2)" }}>
                <div className="flex-1"><BarChart3 className="w-8 h-8 text-emerald-400 mb-4" /><h3 className="text-white font-semibold text-xl mb-2">Analytics & Reporting</h3><p className="text-gray-400 leading-relaxed max-w-md">Real-time dashboard, transaction history, CSV exports, and PDF invoices — everything your finance team needs.</p></div>
                <div className="flex items-end gap-2 h-20 shrink-0">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                    <motion.div key={i} className="w-4 rounded-t-md bg-emerald-500/30 hover:bg-emerald-500/60 transition-colors" style={{ height: `${h}%` }}
                      initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.04, duration: 0.4, ease: "easeOut" }} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ PAYMENT METHODS ═════════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="methods-heading">
          <div className="max-w-7xl mx-auto">
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div>
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">Supported Methods</p>
                <h2 id="methods-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">What payment methods does GemRails support?</h2>
                <p className="text-gray-400 leading-relaxed mb-6">GemRails accepts <strong className="text-white">stablecoins</strong> — dollar-pegged currencies worth exactly $1, with zero price volatility. Your customers pay in digital dollars; you receive Naira.</p>
                <div className="bg-[#0d1117] border border-white/[0.07] rounded-xl p-5 text-sm text-gray-400">
                  <p><strong className="text-white">What is a stablecoin?</strong> A cryptocurrency permanently pegged 1:1 to the US Dollar. USDT and USDC always equal exactly $1 — no volatility risk.</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Stablecoins Accepted", items: ["USDT (Tether)", "USDC (USD Coin)"], icon: CircuitBoard },
                  { label: "Supported Networks", items: ["TRON (TRC-20)", "BNB Smart Chain (BSC)"], icon: Globe },
                  { label: "Settlement Currency", items: ["Nigerian Naira (NGN)", "Direct bank transfer", "Same-day"], icon: Landmark },
                  { label: "Coming Soon", items: ["Ethereum (ERC-20)", "Mobile money", "GHS, KES, ZAR"], icon: Star },
                ].map((m, i) => (
                  <motion.div key={i} className="flex items-start gap-4 p-5 rounded-xl border border-white/[0.07] bg-[#0d1117] hover:border-emerald-500/20 transition-colors"
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <m.icon className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm mb-2">{m.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {m.items.map(item => (<span key={item} className="text-xs text-gray-400 bg-white/5 rounded-full px-2.5 py-1 border border-white/[0.06]">{item}</span>))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ SECURITY ════════════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080b0f] relative overflow-hidden" aria-labelledby="security-heading">
          <Blob className="w-[700px] h-[700px] bg-emerald-500/5 -bottom-48 -left-48" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Lock, title: "TLS 1.3", desc: "All API comms encrypted" },
                  { icon: Shield, title: "AES-256", desc: "Data encrypted at rest" },
                  { icon: Eye, title: "AML Screening", desc: "Every transaction checked" },
                  { icon: FileText, title: "Audit Logs", desc: "Immutable activity trail" },
                  { icon: ShieldCheck, title: "KYC Verified", desc: "All merchants verified" },
                  { icon: Server, title: "99.9% SLA", desc: "Enterprise-grade uptime" },
                ].map((s, i) => (
                  <motion.div key={i} className="bg-[#0d1117] border border-white/[0.07] rounded-xl p-5 hover:border-emerald-500/20 transition-colors"
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -2 }}>
                    <s.icon className="w-5 h-5 text-emerald-400 mb-3" />
                    <p className="text-white font-semibold text-sm">{s.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">Security & Compliance</p>
                <h2 id="security-heading" className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">Built to the same standard as traditional banks</h2>
                <p className="text-gray-400 leading-relaxed mb-6">GemRails implements KYC verification for every merchant using a tiered system. All API communications run over TLS 1.3, data is encrypted at rest using AES-256, and every transaction is screened through AML monitoring.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ INDUSTRIES ══════════════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8" aria-labelledby="industries-heading">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center max-w-2xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">Industries</p>
              <h2 id="industries-heading" className="text-4xl sm:text-5xl font-bold text-white mb-4">Who uses GemRails?</h2>
              <p className="text-gray-400">Any Nigerian business that wants to accept payments from local or international customers.</p>
            </motion.div>
            {/* Apple style card carousel */}
            <IndustriesSection />
          </div>
        </section>

        {/* ══ BIG STATS ═══════════════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080b0f] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(16,185,129,0.06),transparent)]" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
              {[
                { prefix: "", val: 10000, suffix: "+", label: "Verified Merchants", sub: "and growing" },
                { prefix: "< ", val: 5, suffix: " sec", label: "Avg. Settlement", sub: "from blockchain confirmation" },
                { prefix: "₦", val: 0, suffix: "", label: "Onboarding Fee", sub: "free to start" },
                { prefix: "", val: 100, suffix: "%", label: "Chargeback-free", sub: "crypto is final" },
              ].map((s, i) => (
                <motion.div key={i} className="bg-[#080b0f] p-8 text-center hover:bg-[#0d1117] transition-colors"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <p className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2">{s.prefix}<Counter end={s.val} suffix={s.suffix} /></p>
                  <p className="text-white font-medium text-sm mb-1">{s.label}</p>
                  <p className="text-gray-600 text-xs">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ INTERACTIVE SEARCH CONSOLE ══════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8" id="faq" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto">
            {/* FAQ Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">Support Center</p>
                <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Frequently asked questions</h2>
                <p className="text-gray-400 text-sm mt-2">Filter by category or type in the search bar below to find immediate answers.</p>
              </motion.div>

              {/* Search Bar Input */}
              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative w-full md:w-80 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={faqSearchQuery}
                  onChange={e => { setFaqSearchQuery(e.target.value); setOpenFAQ(null) }}
                  placeholder="Search questions (e.g., fees, limits)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                />
                {faqSearchQuery && (
                  <button 
                    onClick={() => setFaqSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </motion.div>
            </div>

            {/* Category Filter Tabs (Faded when search is active to indicate search override) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn("flex flex-wrap gap-2 mb-8 transition-opacity", faqSearchQuery ? "opacity-35 pointer-events-none" : "opacity-100")}
            >
              {[
                { id: "general", label: "General Intro", icon: BookOpen },
                { id: "payments", label: "Payments & Fees", icon: Wallet },
                { id: "security", label: "Security & Limits", icon: Lock },
                { id: "tech", label: "Developer & Sync", icon: Code2 },
              ].map(cat => {
                const Icon = cat.icon
                const isActive = activeFAQCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveFAQCategory(cat.id); setOpenFAQ(null) }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95",
                      isActive
                        ? "bg-emerald-500 border-transparent text-black shadow-lg shadow-emerald-500/10"
                        : "bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/10"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                )
              })}
            </motion.div>

            {/* Results Title when Searching */}
            {faqSearchQuery && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 font-medium">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>Found {filteredFAQs.length} questions matching "{faqSearchQuery}"</span>
              </motion.div>
            )}

            {/* FAQ Accordion List Stack */}
            <motion.div layout className="space-y-2 relative">
              <AnimatePresence mode="popLayout">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => {
                    const originalIndex = faqData.findIndex(f => f.question === faq.question)
                    const isOpen = openFAQ === originalIndex
                    return (
                      <motion.div 
                        layout 
                        key={faq.question}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FAQItem 
                          id={`faq-${originalIndex}`} 
                          question={faq.question} 
                          answer={faq.answer} 
                          isOpen={isOpen} 
                          onClick={() => setOpenFAQ(isOpen ? null : originalIndex)} 
                        />
                      </motion.div>
                    )
                  })
                ) : (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center text-xs text-gray-500"
                  >
                    <AlertCircle className="w-6 h-6 text-emerald-500/60 mx-auto mb-3" />
                    <p className="font-bold text-white mb-1">No matching questions found</p>
                    <p className="max-w-xs mx-auto text-gray-500 mb-4 leading-relaxed">Try typing another keyword or check out general tabs.</p>
                    <button 
                      onClick={() => setFaqSearchQuery("")} 
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 active:scale-95 transition-all"
                    >
                      Clear Search
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer Support CTA */}
            <motion.p className="text-gray-600 text-xs mt-12 flex items-center justify-between gap-4 border-t border-white/[0.04] pt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <span>Still have unanswered questions?</span> 
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1">
                Ask our support desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.p>
          </div>
        </section>

        {/* ══ DEVELOPER PREVIEW ═══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080b0f] relative overflow-hidden" aria-labelledby="developer-heading">
          <Blob className="w-[600px] h-[600px] bg-emerald-500/6 top-0 left-0" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-4">For Developers</p>
                <h2 id="developer-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">A clean API. Integrate in minutes.</h2>
                <p className="text-gray-400 leading-relaxed mb-8">GemRails provides a REST API, SDKs for Node.js, Python, and more, a full sandbox environment, and real-time webhooks — build and test a complete payment integration without touching live funds.</p>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: Terminal, text: "REST API with full CRUD access" },
                    { icon: Code2, text: "Node.js, Python, cURL SDKs included" },
                    { icon: Shield, text: "Sandbox environment — no real funds" },
                    { icon: Webhook, text: "Real-time webhooks for every event" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><item.icon className="w-3.5 h-3.5 text-emerald-400" /></div>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link href="/docs" id="dev-docs-cta" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow"><BookOpen className="w-4 h-4" />View Docs</Link>
                  <Link href="/developers" id="dev-portal-cta" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Developer Portal <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-[#0d1117] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
                  <div className="flex items-center border-b border-white/[0.08] bg-black/30">
                    <div className="flex gap-1.5 px-4 py-3"><span className="w-3 h-3 rounded-full bg-red-500/70" /><span className="w-3 h-3 rounded-full bg-amber-500/70" /><span className="w-3 h-3 rounded-full bg-emerald-500/70" /></div>
                    <div className="flex">
                      {(["node", "curl", "python"] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                          className={cn("px-4 py-3 text-xs font-medium transition-colors capitalize border-b-2 -mb-px", activeTab === tab ? "text-emerald-400 border-emerald-400 bg-emerald-500/5" : "text-gray-600 border-transparent hover:text-gray-400")}>
                          {tab === "node" ? "Node.js" : tab === "curl" ? "cURL" : "Python"}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1" />
                    <button onClick={() => copy(codeSnippets[activeTab], activeTab)} className="flex items-center gap-1.5 px-4 py-3 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                      {copiedTab === activeTab ? <><CheckCheck className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.pre key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                      <code className="text-gray-300 whitespace-pre">{codeSnippets[activeTab]}</code>
                    </motion.pre>
                  </AnimatePresence>
                  <div className="border-t border-white/[0.06] p-4 bg-black/20">
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Response — 200 OK</p>
                    <pre className="text-xs font-mono text-emerald-400/80 leading-relaxed">{`{
  "success": true,
  "data": {
    "transactionId": "txn_abc123",
    "walletAddress": "TXq8rP9mN3kL...",
    "amountNGN": 47250,
    "status": "awaiting_crypto"
  }
}`}</pre>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═══════════════════════════════════════════════════ */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(16,185,129,0.12),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <Blob className="w-[500px] h-[500px] bg-emerald-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-8">
                <Rocket className="w-3.5 h-3.5" /> Get started in under 5 minutes
              </div>
              <h2 id="cta-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Ready to accept<br />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">stablecoin payments?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">Join thousands of Nigerian businesses collecting global payments and settling instantly in Naira.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="relative group w-full sm:w-auto">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                  <Link href="/auth/signup" id="final-cta-primary" className="relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 text-lg">
                    <Sparkles className="w-5 h-5" /> Start for Free <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                  <Link href="/contact" id="final-cta-demo" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-lg">
                    Book a Demo
                  </Link>
                </motion.div>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                {["Free to get started", "No credit card required", "KYC in minutes", "NGN bank settlement"].map(p => (
                  <span key={p} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" />{p}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════════════════ */}
        <footer className="border-t border-white/[0.06] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <img src="/logo/logo_icon.png" alt="GemRails" className="w-7 h-7 rounded-lg" />
                  <span className="text-white font-bold text-sm">GemRails</span>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">Stablecoin payment infrastructure for African businesses. Accept globally, settle locally.</p>
              </div>
              {[
                { title: "Product", links: [{ l: "Platform", h: "/platform" }, { l: "Pricing", h: "/pricing" }, { l: "Security", h: "/security" }] },
                { title: "Developers", links: [{ l: "Documentation", h: "/docs" }, { l: "API Reference", h: "/docs" }, { l: "Developer Portal", h: "/developers" }] },
                { title: "Company", links: [{ l: "About", h: "/about" }, { l: "Contact", h: "/contact" }, { l: "Privacy", h: "/privacy" }] },
              ].map(col => (
                <div key={col.title}>
                  <p className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(lnk => (<li key={lnk.l}><Link href={lnk.h} className="text-gray-600 hover:text-emerald-400 transition-colors text-sm">{lnk.l}</Link></li>))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-700">
              <p>© {new Date().getFullYear()} GemRails. All rights reserved.</p>
              <div className="flex gap-5">
                <Link href="/anti-money" className="hover:text-gray-500 transition-colors">AML Policy</Link>
                <Link href="/merchant-agreement" className="hover:text-gray-500 transition-colors">Merchant Agreement</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}

// ─── Animated step label above phone ─────────────────────────────────────────

const STEP_LABELS: Record<string, { label: string; color: string }> = {
  amount: { label: "Step 1 — Enter amount", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  crypto: { label: "Step 2 — Choose crypto & network", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  payment: { label: "Step 3 — Send to wallet address", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  processing: { label: "Verifying on blockchain...", color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  success: { label: "Payment Confirmed ✓", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
}

function StepLabel() {
  const [currentStep, setCurrentStep] = useState("amount")
  const stepOrder = ["amount", "crypto", "payment", "processing", "success"]

  useEffect(() => {
    // Mirror the phone demo timing
    const timing = [0, 3000, 6000, 9500, 12000]
    const timers = timing.map((t, i) => setTimeout(() => setCurrentStep(stepOrder[i]), t))
    const reset = setTimeout(() => setCurrentStep("amount"), 16000)
    return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
  }, [])

  const info = STEP_LABELS[currentStep]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={cn("inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium", info.color)}
      >
        <motion.span className="w-1.5 h-1.5 rounded-full bg-current" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        {info.label}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqData = [
  { category: "general", question: "What is GemRails?", answer: "GemRails is a stablecoin payment infrastructure platform built for African businesses. It enables merchants to accept USDT and USDC payments from customers anywhere in the world and receive the equivalent in Nigerian Naira directly into their bank account — automatically, within seconds." },
  { category: "general", question: "How does GemRails work?", answer: "When a customer is ready to pay, they receive a QR code or payment link with a unique wallet address. They send USDT or USDC from their crypto wallet. GemRails detects the payment on-chain, converts it to Naira at the live exchange rate, and deposits it directly into your Nigerian bank account — the whole process takes seconds." },
  { category: "general", question: "What is a stablecoin and why does GemRails use them?", answer: "A stablecoin is a cryptocurrency permanently pegged 1:1 to the US Dollar. USDT and USDC always equal exactly $1 — no price volatility. GemRails uses stablecoins because they combine the speed and global reach of crypto with the predictability of the dollar, making them ideal for business payments." },
  { category: "payments", question: "Which networks does GemRails support?", answer: "GemRails currently supports TRON (TRC-20) and BNB Smart Chain (BSC). Both are fast networks with low transaction fees, ideal for merchant payments. Support for Ethereum (ERC-20) and additional networks is planned." },
  { category: "payments", question: "How fast is the Naira settlement?", answer: "Settlement typically completes within 2–5 seconds of blockchain confirmation. TRON confirmations are especially fast. In practice, most payments are settled before the customer puts their phone away." },
  { category: "general", question: "Do I need crypto knowledge to use GemRails?", answer: "No. GemRails is designed specifically so business owners need zero technical crypto knowledge. You manage everything through a standard dashboard — you see payments in Naira, request bank withdrawals in Naira, and receive statements in Naira. The crypto layer is completely invisible." },
  { category: "payments", question: "What are the fees?", answer: "GemRails charges a flat platform fee per transaction. There are no card interchange fees, no SWIFT charges, and no FX markups beyond the published exchange rate buffer. Merchant onboarding is completely free. Visit our Pricing page for full details." },
  { category: "general", question: "How does GemRails differ from a traditional payment gateway?", answer: "Traditional gateways process card payments with interchange fees (1.5–3.5%), chargeback risk, and 3–5 day settlement delays. GemRails processes stablecoin payments that are irreversible (zero chargebacks), settle in seconds, have predictable flat fees, and work for any customer anywhere without a card." },
  { category: "security", question: "Is GemRails compliant and secure?", answer: "Yes. GemRails implements KYC verification for all merchants via a tiered system — phone verification for basic access and CAC document verification for full limits. All API comms are encrypted with TLS 1.3, data is AES-256 encrypted at rest, and every transaction is screened through AML monitoring." },
  { category: "security", question: "What KYC tiers are there?", answer: "Tier 0: Sandbox access immediately after registration. Tier 1: Phone number verification via OTP — unlocks live payments up to ₦100,000/day. Tier 2: CAC business document upload verified via SmileID — unlocks unlimited live transactions. Most merchants complete full verification the same day." },
  { category: "payments", question: "Can I accept payments from international customers?", answer: "Yes — this is a core GemRails strength. Any customer anywhere in the world with USDT or USDC can pay a GemRails merchant instantly, without international wires, SWIFT, or FX desks. You always receive Naira." },
  { category: "tech", question: "Does GemRails support multiple branches?", answer: "Yes. The branch management system lets businesses with multiple locations operate under one account. Each branch can have its own cashiers, QR terminals, and transaction history, while the account owner has a consolidated view across all locations." },
  { category: "tech", question: "Can developers integrate GemRails into a website or app?", answer: "Yes. GemRails provides a full REST API and official SDKs for Node.js, Python, and more. Developers can integrate the payment flow into any website, ecommerce platform, or mobile app. A complete sandbox environment is available for testing before going live." },
  { category: "payments", question: "What happens if a customer sends the wrong amount?", answer: "GemRails generates a unique wallet address and expected amount for each transaction. If a customer sends a different amount, the system flags it for review or handles it per your merchant configuration. You always have full visibility in your dashboard." },
  { category: "general", question: "How do I get started?", answer: "Getting started is free and takes under 5 minutes. Go to gemrails.com/auth/signup, create your account, complete phone verification, and you immediately have access to your dashboard and sandbox. Complete CAC business verification to unlock full live transaction limits." },
]

// ─── Mobile Problem Carousel (prevents mobile scroll fatigue) ─────────────────

const problemsData = [
  { icon: RefreshCw, color: "text-red-400", title: "FX Volatility", desc: "The official rate rarely matches the actual cost. Naira devaluation erodes margins before goods are even delivered." },
  { icon: Clock, color: "text-amber-400", title: "3–5 Day Settlements", desc: "Capital tied up in transit means you can't restock, pay staff, or grow. Slow settlements kill cash flow." },
  { icon: Globe, color: "text-orange-400", title: "Cross-border Friction", desc: "International SWIFT wires cost $25–$50 per transaction, take days, and frequently fail compliance checks." },
  { icon: CreditCard, color: "text-purple-400", title: "Card Declines", desc: "High card failure rates in Nigeria leave international customers unable to pay — lost sales for merchants." },
  { icon: Layers, color: "text-blue-400", title: "Operational Complexity", desc: "Multiple gateways, manual reconciliation, FX desks. Finance teams spend hours on what should be automated." },
  { icon: AlertTriangle, color: "text-pink-400", title: "Chargeback Fraud", desc: "Card payments can be reversed months later. Merchants absorb losses with no recourse from the network." },
]

function ProblemCarousel() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    setDirection(1)
    setIndex(prev => (prev + 1) % problemsData.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setIndex(prev => (prev - 1 + problemsData.length) % problemsData.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.94
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.94
    })
  }

  const active = problemsData[index]

  return (
    <div className="md:hidden relative flex flex-col items-center w-full px-2 mt-2">
      {/* Active Card Frame */}
      <div className="relative w-full max-w-sm h-64 overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0d1117] to-[#050709] rounded-3xl shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, info) => {
              if (info.offset.x < -60) {
                handleNext()
              } else if (info.offset.x > 60) {
                handlePrev()
              }
            }}
            className="absolute inset-0 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing touch-none select-none"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <active.icon className={cn("w-5 h-5", active.color)} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5">
                  0{index + 1} / 0{problemsData.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{active.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{active.desc}</p>
            </div>
            
            <p className="text-[10px] text-gray-600 text-center select-none pointer-events-none mb-1">
              ← Swipe left or right to switch →
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots and arrows */}
      <div className="flex items-center gap-5 mt-6 shrink-0">
        <button onClick={handlePrev} className="w-8 h-8 rounded-full border border-gray-800 bg-gray-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {problemsData.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === index ? "w-5 bg-emerald-500" : "w-1 bg-gray-800"
              )}
            />
          ))}
        </div>

        <button onClick={handleNext} className="w-8 h-8 rounded-full border border-gray-800 bg-gray-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Apple-style Industries Carousel & Lightbox Modal ────────────────────────

const industriesData = [
  {
    category: "COMMERCE",
    title: "Retail & Supermarkets",
    headline: "In-store checkout queues that move instantly.",
    icon: ShoppingCart,
    detailHeader: "NFC, QR, and Cashier Terminals",
    detailDesc: "No more card machine network errors or manual cashier audits. Cashiers display a transaction QR code on the register tablet or print it directly on the checkout receipt. Customers scan with their mobile crypto wallet, send stablecoins, and the cash register updates instantly as Naira lands in your bank account in 3 seconds.",
    benefits: ["Zero bank chargeback fraud", "Instant cashier desk syncing", "Automatic NGN settlement", "Cashier dashboard auditing"],
    mockupColor: "from-blue-500/20 to-teal-500/10",
    backgroundImage: "/images/retail_supermarket_bg.jpg"
  },
  {
    category: "HOSPITALITY",
    title: "Hotels & Hospitality",
    headline: "Seamless check-ins and room bookings.",
    icon: Hotel,
    detailHeader: "Guest Booking Retainer & Invoice Settlement",
    detailDesc: "For hotels hosting international executives or tourists who face local card decline limits. Send guests a dynamic checkout invoice link via email or WhatsApp during booking. Guests settle reservations instantly from their own digital wallets. Avoid card settlement delays and chargeback disputes entirely.",
    benefits: ["Bypass daily card spending limits", "Instant booking locks", "Direct global payments", "Clean checkout invoices"],
    mockupColor: "from-emerald-500/20 to-indigo-500/10",
    backgroundImage: "/images/hotel_hospitality_bg.jpg"
  },
  {
    category: "FOOD & DRINK",
    title: "Restaurants & Bars",
    headline: "Table-side scan and checkout.",
    icon: Utensils,
    detailHeader: "Self-Checkout Diners Receipt",
    detailDesc: "Diners scan the table QR code with their phones, select USDT or USDC on their preferred network, and pay. The checkout confirmation pops up instantly on the kitchen monitor and cashier's POS console, allowing servers to clear tables faster and keep customers satisfied.",
    benefits: ["Table-specific QR billing", "Split-bill friendly", "Instant server dashboard alerts", "Tips settled directly"],
    mockupColor: "from-amber-500/20 to-red-500/10",
    backgroundImage: "/images/restaurant_dining_bg.jpg"
  },
  {
    category: "TRAVEL",
    title: "Travel & Tourism",
    headline: "Book flights and tours without card limits.",
    icon: Plane,
    detailHeader: "High-Value Ticket Clearance",
    detailDesc: "Avoid card payment declines on high-ticket items like international flights, destination tours, and vacation packages. Travelers pay for travel vouchers directly with TRC-20 or BSC stablecoins. GemRails completes transaction clearance and settles to local agencies immediately.",
    benefits: ["Accept high-value payments", "Direct ticketing release", "Zero compliance blockages", "Global traveler reach"],
    mockupColor: "from-purple-500/20 to-pink-500/10",
    backgroundImage: "/images/travel_tourism_bg.jpg"
  },
  {
    category: "MEDICAL",
    title: "Healthcare Clinics",
    headline: "Fast payment access for vital services.",
    icon: Heart,
    detailHeader: "Patient Clinic Billings",
    detailDesc: "Make clinic payments stress-free for patients and their families. Allow walk-in pharmacy clients or hospital visitors to check out immediately, bypassing manual bank transfer confirmations or card terminal failure delays during medical emergencies.",
    benefits: ["Emergency billing speed", "Direct copay clearances", "Cashier dashboard auditing", "Secure medical invoices"],
    mockupColor: "from-rose-500/20 to-cyan-500/10",
    backgroundImage: "/images/healthcare_clinic_bg.jpg"
  },
  {
    category: "EDUCATION",
    title: "Schools & EdTech",
    headline: "Bypass tuition limits for students.",
    icon: GraduationCap,
    detailHeader: "Tuition and Registration Settle",
    detailDesc: "Enable local and international students to pay tuition fees, student housing, and exam registrations smoothly with digital dollars. Tuition payments are cleared immediately, reducing student clearance delays and registrar department manual tracking loads.",
    benefits: ["Global tuition collection", "Automatic student ID tagging", "Direct registrar dashboard checks", "No banking limit holds"],
    mockupColor: "from-indigo-500/20 to-purple-500/10",
    backgroundImage: "/images/education_school_bg.jpg"
  },
  {
    category: "TRADE",
    title: "Import & Export",
    headline: "Global supplier settlement in minutes.",
    icon: Truck,
    detailHeader: "Bulk B2B Freight Settlements",
    detailDesc: "Bypass SWIFT wire costs, intermediary bank delays, and manual documentation checks. Pay overseas manufacturing partners or clear shipping freight bills directly in stablecoins, with automated conversion and instant transaction tracking ledgers.",
    benefits: ["Bypass international bank delays", "Direct supplier stablecoin payouts", "Complete trade ledger compliance", "Cleared invoices in minutes"],
    mockupColor: "from-orange-500/20 to-yellow-500/10",
    backgroundImage: "/images/import_export_bg.jpg"
  },
  {
    category: "B2B SERVICES",
    title: "Professional Services",
    headline: "Clean digital invoicing for agencies.",
    icon: Briefcase,
    detailHeader: "Agency Retainers and Retainer Contracts",
    detailDesc: "For remote software development teams, digital design agencies, and consulting firms. Generate professional, branded payment links and let international client corporations pay retainers instantly with stablecoins. Enjoy low fees and immediate conversions.",
    benefits: ["Generate professional payment links", "Stablecoin client retainers", "Immediate conversion to NGN", "Automatic monthly reports"],
    mockupColor: "from-blue-500/20 to-indigo-500/10",
    backgroundImage: "/images/professional_services_bg.jpg"
  }
]

function MockupSelector({ type, title }: { type: string; title: string }) {
  if (type === "COMMERCE") {
    return (
      <div className="w-full flex flex-col gap-3 py-2 text-left font-mono">
        <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-full blur-lg" />
          <div>
            <p className="text-[9px] text-gray-500 flex items-center gap-1"><ShoppingCart className="w-3 h-3 text-blue-400" /> RETAIL CHECKOUT REGISTER</p>
            <p className="text-sm font-bold text-white mt-1">Supermarket Bill Settle</p>
          </div>
          <span className="text-base font-bold text-emerald-400">₦24,500.00</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 animate-bounce" />
          <span>Naira automatically deposited to merchant bank.</span>
        </div>
      </div>
    )
  }
  if (type === "HOSPITALITY") {
    return (
      <div className="w-full flex flex-col gap-2.5 py-1 text-left">
        <div className="bg-[#1c2331]/30 border border-white/10 rounded-xl p-3.5 relative">
          <div className="absolute top-3 right-3"><Hotel className="w-4 h-4 text-emerald-400 opacity-60" /></div>
          <div className="flex justify-between text-xs text-gray-400 pb-1.5 border-b border-white/5 font-mono">
            <span>BOOKING #7781-A</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">PAID (USDT)</span>
          </div>
          <div className="mt-2.5 space-y-1.5 font-sans">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Guest Name</span><span className="text-white font-semibold">Elena Rostova</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Room Confirmed</span><span className="text-white font-semibold">Deluxe Suite #304</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Total Naira Settled</span><span className="text-emerald-400 font-black">₦185,000.00</span></div>
          </div>
        </div>
      </div>
    )
  }
  if (type === "FOOD & DRINK") {
    return (
      <div className="w-full text-left max-w-xs bg-black/60 border border-white/10 rounded-2xl p-4 font-mono text-xs text-gray-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-full blur-xl" />
        <div className="flex justify-between items-center border-b border-dashed border-white/20 pb-2 mb-2">
          <p className="text-white font-bold flex items-center gap-1"><Utensils className="w-3.5 h-3.5 text-amber-400" /> DINER RECEIPT</p>
          <span className="text-[10px] text-gray-500">TABLE 4</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between"><span>1x Crispy Burger</span><span>₦8,500</span></div>
          <div className="flex justify-between"><span>1x Milkshake</span><span>₦4,000</span></div>
          <div className="flex justify-between border-t border-dashed border-white/20 pt-1.5 font-bold text-white"><span>Total Bill</span><span>₦12,500</span></div>
        </div>
        <div className="mt-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 text-center rounded-lg text-[9px] font-black tracking-wider">
          PAID IN FULL (USDC) ✓
        </div>
      </div>
    )
  }
  if (type === "TRAVEL") {
    return (
      <div className="w-full text-left bg-gradient-to-r from-purple-950/20 to-pink-950/10 border border-white/10 rounded-2xl p-4 font-sans text-xs relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-white font-bold flex items-center gap-1.5"><Plane className="w-3.5 h-3.5 text-purple-400" /> AIRLINE BOARDING VOUCHER</span>
          <span className="bg-emerald-500 text-black font-extrabold text-[8px] px-2 py-0.5 rounded">CLEARED</span>
        </div>
        <div className="flex justify-between items-center py-2 border-y border-white/10 font-mono">
          <div><p className="text-[9px] text-gray-500">DEPARTURE</p><p className="text-sm font-black text-white">LOS (Lagos)</p></div>
          <span className="text-purple-400 text-base animate-pulse">✈</span>
          <div className="text-right"><p className="text-[9px] text-gray-500">ARRIVAL</p><p className="text-sm font-black text-white">LHR (London)</p></div>
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 mt-2 font-mono">
          <span>TICKET CHARGE: 142.50 USDT</span>
          <span className="text-emerald-400 font-bold">₦232,800.00 Settled</span>
        </div>
      </div>
    )
  }
  if (type === "MEDICAL") {
    return (
      <div className="w-full text-left bg-rose-950/10 border border-white/10 rounded-2xl p-4 text-xs font-sans relative overflow-hidden">
        <div className="absolute top-2 right-2"><Heart className="w-4 h-4 text-rose-500 opacity-40 animate-pulse" /></div>
        <div className="pb-2 border-b border-white/10 mb-2">
          <p className="text-white font-bold text-xs">CAREPLUS SPECIALIST CLINIC</p>
          <p className="text-[9px] text-gray-500 mt-0.5">Medical Receipt Clearance</p>
        </div>
        <div className="space-y-1 text-[10px] font-mono text-gray-400">
          <div className="flex justify-between"><span>General Consult / Lab Panel</span><span>₦45,000.00</span></div>
          <div className="flex justify-between"><span>Pharmacy Dispensation</span><span>₦15,000.00</span></div>
          <div className="flex justify-between border-t border-white/10 pt-1 font-bold text-emerald-400"><span>Naira Amount Settled</span><span>₦60,000.00</span></div>
        </div>
        <p className="text-[9px] text-gray-500 mt-2 text-center">Paid via <strong>36.71 USDC (TRC-20)</strong></p>
      </div>
    )
  }
  if (type === "EDUCATION") {
    return (
      <div className="w-full text-left bg-[#1a1f38]/30 border border-white/10 rounded-2xl p-4 text-xs font-sans relative overflow-hidden">
        {/* Large faint background graduation cap watermark */}
        <div className="absolute bottom-2 right-4 text-white/[0.03] pointer-events-none">
          <GraduationCap className="w-24 h-24" />
        </div>
        <div className="pb-2.5 border-b border-white/10 mb-2.5 flex justify-between items-center">
          <div>
            <p className="text-white font-bold text-xs tracking-wide">LASU TUITION PORTAL</p>
            <p className="text-[9px] text-gray-500 mt-0.5">Academic clearance voucher</p>
          </div>
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="space-y-1.5 text-[10px] text-gray-300 font-mono">
          <div className="flex justify-between"><span className="text-gray-500">Student:</span><span className="text-white">Olumide Alabi (ID: 9082)</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Course:</span><span className="text-white">B.Sc Computer Science</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Bill description:</span><span className="text-white">1st Sem Tuition + Lab Fee</span></div>
          <div className="flex justify-between border-t border-white/10 pt-1.5 text-xs text-emerald-400 font-bold"><span className="text-gray-500 font-sans">Clearance amount:</span><span>₦350,000.00</span></div>
        </div>
        <div className="mt-3.5 py-1 text-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 rounded-lg text-[9px] font-black tracking-widest font-mono">
          REGISTRAR CLEARED (USDC)
        </div>
      </div>
    )
  }
  if (type === "TRADE") {
    return (
      <div className="w-full text-left bg-orange-950/10 border border-white/10 rounded-2xl p-4 text-xs font-sans relative overflow-hidden">
        <div className="absolute top-2 right-2"><Truck className="w-4 h-4 text-orange-400 opacity-40" /></div>
        <div className="pb-2 border-b border-white/10 mb-2.5">
          <p className="text-white font-bold text-xs">OCEANIC CARGO LOGISTICS</p>
          <p className="text-[9px] text-gray-500">Bill of Lading Freight Invoice</p>
        </div>
        <div className="space-y-1.5 text-[10px] font-mono text-gray-400">
          <div className="flex justify-between"><span>Cargo:</span><span className="text-white">2x container industrial electronics</span></div>
          <div className="flex justify-between"><span>Route:</span><span className="text-white">Shanghai ➔ Apapa Lagos</span></div>
          <div className="flex justify-between border-t border-white/10 pt-1.5 text-emerald-400 font-bold"><span>Total Paid Invoice:</span><span>₦4,950,000.00</span></div>
        </div>
        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-2 text-center text-[9px] font-bold">
          FREIGHT STATUS: DEPARTURE READY ✓
        </div>
      </div>
    )
  }
  if (type === "B2B SERVICES") {
    return (
      <div className="w-full text-left bg-indigo-950/10 border border-white/10 rounded-2xl p-4 text-xs font-sans relative overflow-hidden">
        <div className="absolute top-2 right-2"><Briefcase className="w-4 h-4 text-indigo-400 opacity-40" /></div>
        <div className="pb-2 border-b border-white/10 mb-2">
          <p className="text-white font-bold text-xs">PIXELFORGE TECH AGENCY</p>
          <p className="text-[9px] text-gray-500">B2B retainer billing ledger</p>
        </div>
        <div className="space-y-1.5 text-[10px] font-mono text-gray-400">
          <div className="flex justify-between"><span>Description:</span><span className="text-white">Software Retainer — July</span></div>
          <div className="flex justify-between"><span>Billed To:</span><span className="text-white">ScaleUp Inc (New York)</span></div>
          <div className="flex justify-between border-t border-white/10 pt-1.5 text-emerald-400 font-bold"><span>Settled Bank Naira:</span><span>₦2,450,000.00</span></div>
        </div>
        <p className="text-[9px] text-gray-500 mt-2.5 text-center">Received: <strong>$1,500.00 USDC (TRON)</strong></p>
      </div>
    )
  }
  return (
    <div className="w-full flex flex-col gap-2.5 py-1 text-left font-mono">
      <div className="bg-[#0a0d10] border border-white/5 rounded-xl p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">{title}</span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[9px]">PAID</span>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-[9px] text-gray-500">TRANSACTION ID</p>
            <p className="text-[10px] text-white font-bold mt-0.5">{DEMO_TX_ID}</p>
          </div>
          <span className="text-xs font-bold text-white">Settle Complete</span>
        </div>
      </div>
    </div>
  )
}

function IndustryModal({ index, onClose }: { index: number; onClose: () => void }) {
  const data = industriesData[index]

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#0d1117] via-[#080b0f] to-black border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden cursor-default my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content layout */}
        <div className="space-y-6">
          <div>
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">{data.category}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-3.5 leading-tight">{data.headline}</h3>
          </div>

          <div className="h-px bg-white/10" />

          {/* Interactive CSS mockup illustration */}
          <div className={cn("bg-gradient-to-br border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden min-h-[140px]", data.mockupColor)}>
            <MockupSelector type={data.category} title={data.title} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm tracking-wide">{data.detailHeader}</h4>
            <p className="text-gray-400 text-xs leading-relaxed">{data.detailDesc}</p>
          </div>

          {/* Advantages bullet grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {data.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Close Trigger */}
          <button 
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold text-black bg-white hover:bg-white/90 active:scale-95 transition-all text-xs mt-4"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function IndustriesSection() {
  const [activeIndustry, setActiveIndustry] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleScroll = (dir: "left" | "right") => {
    if (carouselRef.current) {
      const amt = 340
      carouselRef.current.scrollBy({
        left: dir === "left" ? -amt : amt,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="w-full">
      {/* Horizontal Carousel */}
      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory px-2 sm:px-0"
      >
        {industriesData.map((ind, i) => (
          <div 
            key={i}
            onClick={() => setActiveIndustry(i)}
            className="snap-start shrink-0 w-[270px] sm:w-[310px] aspect-[9/13] sm:aspect-[9/14] rounded-3xl border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
          >
            {/* Background Image overlay with dark tint for text contrast */}
            <div className="absolute inset-0 z-0">
              <img 
                src={ind.backgroundImage} 
                alt={ind.title} 
                className="w-full h-full object-cover opacity-35 group-hover:scale-105 group-hover:opacity-45 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/90" />
            </div>

            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03),transparent_50%)] z-0" />

            {/* Card Content Top */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <span className="text-gray-500 text-[9px] font-bold tracking-widest uppercase">{ind.category}</span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-2 group-hover:text-emerald-400 transition-colors">
                  {ind.headline}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 ml-3.5 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/20 transition-all duration-300">
                <ind.icon className="w-4 h-4" />
              </div>
            </div>

            {/* Card Mockup Graphic Mini Preview */}
            <div className="relative z-10 w-full bg-black/60 backdrop-blur-sm border border-white/[0.06] rounded-xl p-3.5 transform group-hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center justify-between text-[9px] text-gray-500 border-b border-white/[0.05] pb-1.5 mb-1.5 font-mono">
                <span>{ind.title.toUpperCase()}</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white font-mono">GemRails Link</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">₦--,--</span>
              </div>
            </div>

            {/* Card Bottom: Plus trigger */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-semibold">{ind.title}</span>
              <div 
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 active:scale-95 transition-transform shrink-0"
              >
                <Plus className="w-4 h-4 text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center sm:justify-end gap-3 mt-4">
        <button 
          onClick={() => handleScroll("left")}
          className="w-9 h-9 rounded-full border border-gray-800 bg-gray-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90 shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleScroll("right")}
          className="w-9 h-9 rounded-full border border-gray-800 bg-gray-900/60 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90 shrink-0"
          aria-label="Scroll right"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeIndustry !== null && (
          <IndustryModal 
            index={activeIndustry} 
            onClose={() => setActiveIndustry(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}


