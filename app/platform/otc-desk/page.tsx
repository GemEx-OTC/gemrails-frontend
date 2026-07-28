"use client"

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  ArrowRight, Shield, Globe, Banknote, Lock,
  ShieldCheck, Check, ArrowUpRight, Zap,
  Menu, X, TrendingUp, Briefcase,
  UserCheck, BarChart3, AlertCircle,
  Coins, Cpu, Activity, FileCheck, Eye, Server, ArrowDown,
  Rocket, ChevronRight, Search,
} from "lucide-react"

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

// ─── Live ticker simulation ────────────────────────────────────────────────────

const TICKER_PAIRS = [
  { pair: "USDT/NGN", base: 1620, symbol: "₦" },
  { pair: "USDC/NGN", base: 1618, symbol: "₦" },
  { pair: "BTC/NGN",  base: 162000000, symbol: "₦" },
  { pair: "ETH/NGN",  base: 7400000, symbol: "₦" },
]

function LiveTicker() {
  const [rates, setRates] = useState(TICKER_PAIRS.map(p => p.base))
  const [dirs, setDirs] = useState(TICKER_PAIRS.map(() => 0))

  useEffect(() => {
    const t = setInterval(() => {
      setRates(prev => prev.map((r) => {
        const delta = r * (Math.random() * 0.002 - 0.001)
        return Math.round((r + delta) * 100) / 100
      }))
      setDirs(prev => prev.map(() => Math.random() > 0.5 ? 1 : -1))
    }, 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-4 min-w-max px-2 sm:px-0">
        {TICKER_PAIRS.map((p, i) => (
          <motion.div
            key={p.pair}
            animate={{ y: [0, dirs[i] === 1 ? -1 : 1, 0] }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md shrink-0"
          >
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">{p.pair}</span>
            <span className={cn("text-[11px] font-black font-mono", dirs[i] === 1 ? "text-emerald-400" : "text-red-400")}>
              {p.symbol}{rates[i].toLocaleString()}
            </span>
            <span className={cn("text-[9px]", dirs[i] === 1 ? "text-emerald-500" : "text-red-500")}>
              {dirs[i] === 1 ? "▲" : "▼"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Coin card ─────────────────────────────────────────────────────────────────

const ASSETS = [
  { name: "Tether", symbol: "USDT", color: "#26A17B", bg: "from-[#26A17B]/20 to-[#26A17B]/5", border: "border-[#26A17B]/20", desc: "USD-pegged stablecoin on TRC-20 & BSC" },
  { name: "USD Coin", symbol: "USDC", color: "#2775CA", bg: "from-[#2775CA]/20 to-[#2775CA]/5", border: "border-[#2775CA]/20", desc: "Circle's regulated dollar stablecoin" },
  { name: "Bitcoin", symbol: "BTC", color: "#F7931A", bg: "from-[#F7931A]/20 to-[#F7931A]/5", border: "border-[#F7931A]/20", desc: "The world's largest cryptocurrency" },
  { name: "Ethereum", symbol: "ETH", color: "#627EEA", bg: "from-[#627EEA]/20 to-[#627EEA]/5", border: "border-[#627EEA]/20", desc: "Smart contract platform & digital asset" },
]

// ─── FAQ Data (22 questions) ──────────────────────────────────────────────────

const FAQ_DATA = [
  { cat: "Basics", q: "What is an OTC crypto desk?", a: "An Over-the-Counter (OTC) crypto desk enables individuals and businesses to buy or sell digital assets directly without relying on public exchange order books. GemRails OTC Desk provides direct trading with instant Naira settlement, making it ideal for both small and large transactions." },
  { cat: "Basics", q: "What is GemRails OTC Desk?", a: "GemRails OTC Desk is a secure, automated cryptocurrency trading platform that enables individuals and businesses in Nigeria and Africa to buy and sell USDT, USDC, Bitcoin, Ethereum and other digital assets with instant Naira settlement directly to their bank accounts." },
  { cat: "Basics", q: "Is GemRails suitable for beginners?", a: "Yes. The Retail Desk is designed to be simple enough for first-time users. Our step-by-step flow guides you through KYC verification, selecting your asset and receiving your Naira payout — all without needing any crypto expertise." },
  { cat: "Selling Crypto", q: "How do I sell USDT in Nigeria?", a: "Create a GemRails account, complete your KYC verification, select 'Sell', choose USDT, enter the amount, and send your USDT to the generated wallet address. Once blockchain confirmation is received, your Naira is automatically sent to your registered Nigerian bank account within seconds." },
  { cat: "Selling Crypto", q: "How long does payout take after I sell crypto?", a: "Payout is instant. After the required blockchain confirmations are received, GemRails automatically processes your Naira settlement and transfers it directly to your bank account — typically within seconds of confirmation." },
  { cat: "Selling Crypto", q: "How much crypto can I sell?", a: "Retail users can sell up to limits determined by their KYC tier. Tier 1 (phone verification) covers standard volumes. Tier 2 (government ID + CAC for businesses) unlocks higher limits. Business OTC accounts have negotiated limits based on volume requirements." },
  { cat: "Selling Crypto", q: "Where can I sell USDT for Naira instantly?", a: "GemRails is one of the fastest crypto-to-Naira OTC desks in Nigeria. We offer fully automated settlement directly to your Nigerian bank account, with no manual processing delays. Simply complete verification and send your USDT to receive Naira instantly." },
  { cat: "Selling Crypto", q: "Do you support USDC?", a: "Yes. GemRails OTC Desk supports USDC (USD Coin) in addition to USDT, Bitcoin and Ethereum. You can sell USDC and receive Naira directly to your bank account with the same instant automated settlement process." },
  { cat: "Buying Crypto", q: "Can I buy USDT on GemRails?", a: "Yes. GemRails OTC Desk supports both buying and selling of USDT, USDC, Bitcoin and Ethereum. To buy, complete your verification, select 'Buy', enter the amount in Naira, and your crypto will be delivered to your designated wallet address after payment is confirmed." },
  { cat: "Buying Crypto", q: "How much USDT can I buy?", a: "Retail users can buy up to their verified tier limits. Businesses requiring large USDT purchases can access the Business OTC Desk, which provides institutional-grade liquidity with no standard volume caps — subject to KYB verification and agreed trading terms." },
  { cat: "Buying Crypto", q: "Can businesses buy large amounts of USDT in Nigeria?", a: "Yes. GemRails Business OTC Desk is specifically built for organizations that need to purchase USDT in bulk — whether for supplier payments, treasury management or business operations. Businesses complete KYB verification to access institutional liquidity with negotiated pricing." },
  { cat: "Business Accounts", q: "Can businesses trade on GemRails?", a: "Yes. GemRails offers a dedicated Business OTC Desk for companies requiring institutional cryptocurrency trading. Businesses complete Know Your Business (KYB) verification to access competitive pricing, dedicated relationship management, high-volume liquidity and enterprise settlement infrastructure." },
  { cat: "Business Accounts", q: "How do business accounts work?", a: "Business accounts go through our KYB enterprise onboarding process, which includes business registration verification, director identity checks and risk assessment. Once approved, businesses receive access to institutional trading features including negotiated OTC pricing, dedicated support and higher transaction limits." },
  { cat: "Business Accounts", q: "What is crypto treasury management?", a: "Crypto treasury management refers to businesses holding and managing digital assets (like USDT) as part of their financial operations. GemRails helps businesses buy crypto for supplier payments, convert crypto revenue to Naira, and manage digital asset positions with institutional-grade infrastructure." },
  { cat: "Security", q: "Is GemRails non-custodial?", a: "Yes. GemRails operates a non-custodial model for the Retail OTC Desk. Your cryptocurrency assets remain in your own wallet until you initiate a transaction. GemRails does not require you to permanently deposit assets onto the platform, significantly reducing custodial risk." },
  { cat: "Security", q: "How does GemRails keep my funds safe?", a: "GemRails combines non-custodial architecture with KYC/KYB identity verification, AML transaction monitoring, secure blockchain infrastructure and fraud detection systems. Our platform is designed to protect both retail users and businesses throughout every stage of the trading process." },
  { cat: "Security", q: "What KYC is required?", a: "Retail users complete a straightforward KYC process: phone number verification for Tier 1 access, and government-issued ID verification for higher limits. Business users complete KYB onboarding with company registration documents and director verification. Most verifications are processed within minutes." },
  { cat: "Assets & Networks", q: "What cryptocurrencies does GemRails support?", a: "GemRails OTC Desk currently supports USDT (TRC-20 and BSC), USDC, Bitcoin (BTC) and Ethereum (ETH). We are continuously expanding our supported asset list. Contact our team for assets not listed here, especially for large institutional trades." },
  { cat: "Assets & Networks", q: "Which blockchain networks are supported?", a: "GemRails supports TRON (TRC-20) and BNB Smart Chain (BSC) for stablecoins, plus the Bitcoin and Ethereum networks. TRC-20 is recommended for USDT transactions due to its speed and low fees." },
  { cat: "Rates & Fees", q: "How are exchange rates determined?", a: "GemRails uses live market rates combined with our liquidity infrastructure to provide competitive exchange rates. The rate applicable to your transaction is displayed clearly before you confirm. Business OTC clients may access negotiated rates for high-volume transactions." },
  { cat: "Rates & Fees", q: "What fees does GemRails charge?", a: "GemRails charges a transparent platform fee per transaction with no hidden costs. There are no SWIFT charges, no FX markup beyond our published rate buffer, and no charges for account registration or KYC verification. Detailed fee schedules are available on our Pricing page." },
  { cat: "Rates & Fees", q: "Can I get better rates for large volumes?", a: "Yes. Business OTC Desk clients executing high-volume trades benefit from customized OTC pricing negotiated directly with our team. Contact our enterprise desk to discuss pricing arrangements suitable for your organization's trading volume." },
]

const FAQ_CATS = ["All", "Basics", "Selling Crypto", "Buying Crypto", "Business Accounts", "Security", "Assets & Networks", "Rates & Fees"]

// ─── FAQ Item ──────────────────────────────────────────────────────────────────

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div layout className={cn("rounded-xl border transition-colors overflow-hidden", isOpen ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-white/[0.07] bg-white/[0.01] hover:border-white/10")}>
      <button className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left" onClick={onClick} aria-expanded={isOpen}>
        <span className={cn("font-semibold text-xs sm:text-sm leading-snug transition-colors", isOpen ? "text-emerald-300" : "text-white")}>{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn("shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isOpen ? "border-emerald-500 text-emerald-400" : "border-white/20 text-gray-500")}
        >
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M4 0v8M0 4h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-4 sm:px-5 pb-4 sm:pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function OTCDeskPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [faqCat, setFaqCat] = useState("All")
  const [faqSearch, setFaqSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 4), 3000)
    return () => clearInterval(t)
  }, [])

  const filteredFAQ = FAQ_DATA.filter(f => {
    const matchesCat = faqCat === "All" || f.cat === faqCat
    const q = faqSearch.toLowerCase()
    const matchesSearch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  const steps = [
    { n: "01", icon: UserCheck, title: "Create Account", sub: "Register with your email. Free, instant access." },
    { n: "02", icon: FileCheck, title: "Complete KYC", sub: "Simple identity verification in minutes." },
    { n: "03", icon: Coins, title: "Send Crypto", sub: "Buy or sell — view transparent rates and confirm." },
    { n: "04", icon: Banknote, title: "Receive Naira", sub: "Automatic payout to your bank within seconds." },
  ]

  const industries = [
    { name: "Importers", desc: "Purchase inventory from overseas suppliers using USDT" },
    { name: "Exporters", desc: "Convert international payments to Naira instantly" },
    { name: "Freight Companies", desc: "Settle international shipping bills in crypto" },
    { name: "Supermarkets", desc: "Accept crypto payments and receive Naira" },
    { name: "Manufacturers", desc: "Pay global suppliers in stablecoins" },
    { name: "Fintech Companies", desc: "Integrate crypto rails into your product" },
    { name: "Payment Companies", desc: "Offer crypto settlement to your merchants" },
    { name: "Travel Agencies", desc: "Process international bookings in crypto" },
    { name: "Hotels", desc: "Accept global payments from international guests" },
    { name: "Logistics Companies", desc: "Manage cross-border payments efficiently" },
  ]

  return (
    <>
      {/* Progress line */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 z-[100] origin-left" style={{ scaleX }} />

      <div className="min-h-screen bg-[#050709] text-white overflow-x-hidden">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#050709]/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="font-extrabold text-white text-base sm:text-lg">GemRails</span>
                <span className="ml-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">OTC</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1 text-xs">
                {[
                  { l: "Platform", h: "/platform" },
                  { l: "OTC Desk", h: "/platform/otc-desk", active: true },
                ].map(n => (
                  <Link key={n.l} href={n.h} className={cn("px-3.5 py-1.5 rounded-lg font-semibold transition-all", n.active ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-gray-400 hover:text-white hover:bg-white/5")}>
                    {n.l}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link href="https://app.gemotc.com/" className="hidden sm:block text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 font-medium" target="_blank" rel="noopener noreferrer">Log in</Link>
              <Link href="https://app.gemotc.com/" className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 sm:px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20" target="_blank" rel="noopener noreferrer">
                Start Trading
              </Link>
              <button className="lg:hidden p-1.5 text-gray-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
                {mobileOpen ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-white/[0.05] bg-[#050709] overflow-hidden">
                <div className="p-4 space-y-1">
                  {[{ l: "Platform", h: "/platform" }, { l: "OTC Desk", h: "/platform/otc-desk" }].map(n => (
                    <Link key={n.l} href={n.h} onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">{n.l}</Link>
                  ))}
                  <div className="pt-3 border-t border-white/[0.06] flex gap-2">
                    <Link href="https://app.gemotc.com/" className="flex-1 py-2.5 text-center text-sm border border-white/10 rounded-xl font-semibold" target="_blank" rel="noopener noreferrer">Log in</Link>
                    <Link href="https://app.gemotc.com/" className="flex-1 py-2.5 text-center text-sm bg-emerald-500 text-black font-bold rounded-xl" target="_blank" rel="noopener noreferrer">Start Trading</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-10 pb-16 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-labelledby="otc-hero-h1">
          {/* Background radial glows matching Platform page */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(139,92,246,0.06),transparent)]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-6 sm:mb-10">
              <Link href="/platform" className="hover:text-gray-400 transition-colors">Platform</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-emerald-400 font-semibold">OTC Desk</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6 sm:mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Nigeria's Fastest OTC Crypto Trading Desk</span>
              </div>
            </motion.div>

            <motion.h1
              id="otc-hero-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-3xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.1] sm:leading-[1.05] tracking-tight mb-5 sm:mb-6"
            >
              Buy and Sell{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                Cryptocurrency
              </span>
              <br className="hidden sm:block" />
              {" "}Instantly in Nigeria
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="text-gray-400 text-sm sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 px-2 sm:px-0"
            >
              Trade USDT, USDC, Bitcoin, Ethereum and other supported cryptocurrencies with{" "}
              <strong className="text-white">instant Naira settlement</strong>. Fully automated, non-custodial and built for individuals and businesses across Africa.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row justify-center gap-3 mb-10 sm:mb-14 px-2 sm:px-0">
              <Link href="https://app.gemotc.com/" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20" target="_blank" rel="noopener noreferrer">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all active:scale-95">
                See How It Works <ArrowDown className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Live rates */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mb-2.5">Live Indicative Rates</p>
              <LiveTicker />
            </motion.div>
          </div>
        </section>

        {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
        <div className="border-y border-white/[0.05] py-4 sm:py-5 px-4 bg-[#080b0f]">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-2.5 text-[11px] sm:text-xs font-semibold text-gray-400">
            {[
              { i: Zap, l: "Settlement in seconds" },
              { i: Lock, l: "Non-custodial wallet" },
              { i: ShieldCheck, l: "KYC & KYB verified" },
              { i: Globe, l: "Built for Africa" },
              { i: Activity, l: "24/7 automated trading" },
              { i: BarChart3, l: "Institutional liquidity" },
            ].map(t => (
              <span key={t.l} className="flex items-center gap-1.5">
                <t.i className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {t.l}
              </span>
            ))}
          </div>
        </div>

        {/* ── WHY CHOOSE ───────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="why-otc">
          <div className="max-w-7xl mx-auto">
            <motion.div className="max-w-2xl mb-10 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Why GemRails OTC?</p>
              <h2 id="why-otc" className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4 leading-tight">
                Nigeria's most reliable crypto exchange platform
              </h2>
              <p className="text-gray-400 text-xs sm:text-base leading-relaxed">
                GemRails combines automated crypto exchange infrastructure with enterprise-grade security and instant settlement — making it the trusted platform for individuals and businesses looking to buy and sell USDT, convert crypto to Naira, or access institutional crypto liquidity.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {[
                { icon: Zap, title: "Instant Naira Payout", desc: "Receive Naira directly to your Nigerian bank account within seconds of blockchain confirmation. No delays, no manual processing — fully automated crypto withdrawal.", badge: "< 5 seconds", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { icon: Cpu, title: "Fully Automated Trading", desc: "Our automated crypto exchange engine handles wallet generation, blockchain monitoring, rate conversion and Naira settlement end-to-end — zero manual intervention required.", badge: "100% Automated", badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
                { icon: Lock, title: "Non-Custodial Wallet", desc: "Your cryptocurrency stays in your own wallet until you initiate a trade. GemRails does not hold your assets — eliminating custodial risk on the best OTC desk in Nigeria.", badge: "Self-Custody", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { icon: UserCheck, title: "Fast KYC Verification", desc: "Retail users are verified in minutes. Simple identity verification unlocks instant crypto trading with Naira settlement — no complex paperwork or lengthy waiting periods.", badge: "Minutes", badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                { icon: BarChart3, title: "Institutional Crypto Liquidity", desc: "Access deep OTC liquidity for large USDT purchases and high-volume cryptocurrency trades. GemRails supports corporate crypto trading without the limitations of public exchanges.", badge: "High Volume", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                { icon: TrendingUp, title: "Competitive Exchange Rates", desc: "We leverage deep liquidity and market expertise to provide competitive USDT to NGN and USDC to NGN rates. Business OTC clients access negotiated pricing for large transactions.", badge: "Best Rates", badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
              ].map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative rounded-2xl p-5 sm:p-6 border border-emerald-500/10 bg-emerald-950/20 hover:border-emerald-500/25 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3.5 relative z-10">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-emerald-500/15">
                      <w.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 sm:py-1 rounded-full border", w.badgeColor)}>{w.badge}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1.5 relative z-10">{w.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed relative z-10">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-y border-white/[0.05] bg-[#080b0f]" aria-labelledby="how-works">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-12 sm:mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">How It Works</p>
              <h2 id="how-works" className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4">
                From sign-up to Naira in four steps
              </h2>
              <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto">Convert USDT to Naira instantly. The entire process takes minutes — your payout arrives in seconds.</p>
            </motion.div>

            {/* Steps */}
            <div className="relative">
              {/* Progress connector on desktop */}
              <div className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-[2px] bg-white/[0.05]" />
              <motion.div
                className="hidden lg:block absolute top-9 left-[10%] h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 origin-left"
                style={{ right: "10%", boxShadow: "0 0 8px rgba(16,185,129,0.6)" }}
                animate={{ scaleX: activeStep / 3 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                {steps.map((s, i) => {
                  const isActive = activeStep === i
                  const isPast = i < activeStep
                  return (
                    <motion.div
                      key={i}
                      onClick={() => setActiveStep(i)}
                      animate={{ scale: isActive ? 1.02 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex lg:flex-col items-center lg:text-center p-4 sm:p-5 lg:p-0 rounded-2xl lg:rounded-none border lg:border-none transition-all cursor-pointer group",
                        isActive ? "bg-emerald-500/[0.06] lg:bg-transparent border-emerald-500/30" : "bg-white/[0.01] lg:bg-transparent border-white/[0.06]"
                      )}
                    >
                      <div className={cn(
                        "relative w-12 h-12 sm:w-14 sm:h-14 lg:w-[72px] lg:h-[72px] rounded-xl sm:rounded-2xl border-2 flex items-center justify-center shrink-0 lg:mb-5 transition-all duration-500 bg-[#0d1117] mr-4 lg:mr-0",
                        isActive ? "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : isPast ? "border-emerald-500/40" : "border-white/10 group-hover:border-white/20"
                      )}>
                        {isActive && <span className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-emerald-400/30 animate-ping" />}
                        <s.icon className={cn("w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-colors duration-500", isActive ? "text-emerald-400" : isPast ? "text-emerald-400/60" : "text-gray-500")} />
                        <span className={cn(
                          "absolute -top-1.5 -right-1.5 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-5 lg:h-5 rounded-full text-[8px] lg:text-[9px] font-black flex items-center justify-center border transition-all duration-500",
                          isActive ? "bg-emerald-500 border-transparent text-black" : isPast ? "bg-emerald-950 border-emerald-500/40 text-emerald-400" : "bg-[#0d1117] border-white/10 text-gray-500"
                        )}>{s.n}</span>
                      </div>
                      <div className="text-left lg:text-center">
                        <h3 className={cn("font-bold text-xs sm:text-sm lg:mb-1.5 transition-colors", isActive ? "text-emerald-300" : "text-white")}>{s.title}</h3>
                        <p className={cn("text-[11px] sm:text-xs leading-relaxed transition-colors", isActive ? "text-gray-300" : "text-gray-500")}>{s.sub}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── RETAIL DESK ───────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="retail-desk">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Retail Crypto Desk</p>
                <h2 id="retail-desk" className="text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
                  Sell crypto online and convert to cash instantly
                </h2>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6">
                  The GemRails Retail Desk is designed for individuals looking to sell crypto online, cash out crypto earnings, or buy digital assets quickly. After a simple KYC, trade USDT, USDC, Bitcoin or Ethereum and receive Naira directly to your Nigerian bank account within seconds.
                </p>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
                  Whether you're a freelancer cashing out USDT, a remote worker converting your crypto salary, or an investor looking for instant crypto withdrawal — GemRails provides Africa's fastest automated crypto-to-Naira experience.
                </p>
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Instant crypto cash out to Naira",
                    "Simple KYC — verified in minutes",
                    "Sell USDT, USDC, BTC & ETH",
                    "Automated — no manual waiting",
                    "Non-custodial — your wallet, your control",
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  {["Freelancers", "Remote Workers", "Crypto Investors", "Traders", "Students", "Digital Creators"].map(t => (
                    <span key={t} className="text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-semibold">{t}</span>
                  ))}
                </div>
                <Link href="https://app.gemotc.com/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20" target="_blank" rel="noopener noreferrer">
                  Start Trading Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Sell mockup panel */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="relative rounded-2xl sm:rounded-3xl p-px" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.05))" }}>
                  <div className="rounded-[15px] sm:rounded-[23px] p-4 sm:p-7 bg-[#0d1117]">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div>
                        <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest">OTC Terminal</p>
                        <p className="text-white font-extrabold text-base sm:text-lg mt-0.5">Sell Crypto</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </div>
                    </div>

                    <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-3.5">
                        <p className="text-[10px] text-gray-500 mb-1 font-medium">You Send</p>
                        <div className="flex justify-between items-center">
                          <span className="text-base sm:text-xl font-black text-white font-mono">500.00 USDT</span>
                          <span className="text-[10px] sm:text-xs text-gray-400 bg-white/5 px-2 py-0.5 sm:py-1 rounded-lg border border-white/5">TRC-20</span>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                          <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                        </div>
                      </div>
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 sm:p-3.5">
                        <p className="text-[10px] text-emerald-400 mb-1 font-medium">You Receive</p>
                        <div className="flex justify-between items-center">
                          <span className="text-base sm:text-xl font-black text-emerald-300 font-mono">₦810,000.00</span>
                          <span className="text-[10px] sm:text-xs text-gray-400 bg-white/5 px-2 py-0.5 sm:py-1 rounded-lg border border-white/5">NGN</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 mb-4 sm:mb-5 font-mono">
                      <span>Rate: 1 USDT = ₦1,620.00</span>
                      <span>Fee: ₦0</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-400 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-2.5 sm:p-3">
                        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>Bank account verified — Payout ready</span>
                      </div>
                      <Link href="https://app.gemotc.com/" target="_blank" rel="noopener noreferrer" className="block w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-black bg-emerald-500 hover:bg-emerald-400 text-center transition-all shadow-lg shadow-emerald-500/20">
                        Confirm Sell Order
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── BUSINESS OTC ──────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-y border-white/[0.05] bg-[#080b0f]" aria-labelledby="business-otc">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Business cards */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                  {[
                    { icon: BarChart3, title: "Competitive OTC Pricing", desc: "Negotiated rates for high-volume institutional trades" },
                    { icon: TrendingUp, title: "High-Volume Liquidity", desc: "Deep liquidity for large USDT purchases and trades" },
                    { icon: Briefcase, title: "Dedicated Manager", desc: "Named relationship manager for your business" },
                    { icon: Server, title: "Enterprise Onboarding", desc: "KYB verification with institutional account setup" },
                    { icon: Activity, title: "Fast Settlement", desc: "High-volume Naira settlement at enterprise speed" },
                    { icon: Shield, title: "Corporate Compliance", desc: "AML monitoring and compliance infrastructure" },
                  ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="rounded-xl border border-purple-500/10 bg-purple-950/20 p-3.5 sm:p-4 hover:border-purple-500/25 transition-all">
                      <c.icon className="w-4 h-4 text-purple-400 mb-2 sm:mb-3" />
                      <p className="text-white font-bold text-xs mb-1">{c.title}</p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="order-1 lg:order-2">
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">Business OTC Trading</p>
                <h2 id="business-otc" className="text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
                  Institutional crypto liquidity for African businesses
                </h2>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Some businesses require more than a standard crypto exchange. Whether your company needs to purchase USDT in bulk for supplier payments, manage crypto treasury operations, or convert large volumes of digital assets to Naira — GemRails Business OTC Desk provides institutional-grade infrastructure.
                </p>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
                  Businesses complete our enterprise KYB onboarding process to access negotiated OTC pricing, dedicated relationship management, high-volume liquidity, and scalable settlement infrastructure — designed specifically for corporate crypto trading in Nigeria and Africa.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  {["OTC Desk Nigeria", "Buy USDT in Bulk", "Crypto Treasury Management", "Corporate Crypto Liquidity", "Institutional Crypto Trading"].map(t => (
                    <span key={t} className="text-[9px] sm:text-[10px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-purple-400 bg-purple-500/10 border-purple-500/20 font-bold">{t}</span>
                  ))}
                </div>
                <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20">
                  Apply for Business Access <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SUPPORTED ASSETS ──────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="supported-assets">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-10 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Supported Assets</p>
              <h2 id="supported-assets" className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4">
                Buy and sell multiple cryptocurrencies in Nigeria
              </h2>
              <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto">Convert USDT to Naira, sell Bitcoin for Naira, or purchase Ethereum — all on one platform with instant settlement.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {ASSETS.map((a, i) => (
                <motion.div
                  key={a.symbol}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn("relative rounded-2xl p-5 sm:p-6 border bg-gradient-to-br overflow-hidden group hover:-translate-y-1 transition-transform", a.bg, a.border)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 font-black text-base sm:text-lg relative z-10" style={{ background: `${a.color}25`, color: a.color }}>
                    {a.symbol.slice(0, 2)}
                  </div>
                  <p className="text-white font-extrabold text-base sm:text-lg relative z-10">{a.symbol}</p>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] font-medium mb-2 sm:mb-3 relative z-10">{a.name}</p>
                  <p className="text-gray-400 sm:text-gray-500 text-xs leading-snug relative z-10">{a.desc}</p>
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex justify-between text-[10px] font-bold relative z-10" style={{ color: a.color }}>
                    <span>BUY</span>
                    <span>SELL</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INDUSTRIES ───────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-y border-white/[0.05] bg-[#080b0f]" aria-labelledby="industries-otc">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-10 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Industries We Serve</p>
              <h2 id="industries-otc" className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4">Trusted across Africa's economy</h2>
              <p className="text-gray-400 text-xs sm:text-base max-w-xl mx-auto">From importers buying USDT for supplier payments to freelancers cashing out crypto earnings — GemRails serves every industry that touches digital assets.</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {industries.map((ind, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all"
                >
                  <h3 className="text-white font-bold text-xs sm:text-sm mb-1 group-hover:text-emerald-300 transition-colors">{ind.name}</h3>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] leading-snug">{ind.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY ──────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="security-otc">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Security & Compliance</p>
                <h2 id="security-otc" className="text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
                  Trade with confidence on a secure crypto platform
                </h2>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6">
                  Security remains at the core of GemRails OTC Desk. Our non-custodial architecture means your cryptocurrency assets are never permanently held by the platform — reducing custodial risk while providing a seamless trading experience.
                </p>
                <p className="text-gray-400 text-xs sm:text-base leading-relaxed mb-6 sm:mb-8">
                  Combined with robust identity verification procedures, AML transaction monitoring, and blockchain-level fraud prevention, GemRails provides a secure crypto exchange environment for both retail users and institutional businesses across Africa.
                </p>
                <Link href="/anti-money" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-bold transition-colors">
                  View our AML Policy <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                {[
                  { icon: Lock, title: "Non-Custodial", desc: "Your assets stay in your own wallet — we never hold your crypto permanently.", color: "emerald" },
                  { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Enterprise-grade blockchain monitoring and transaction security.", color: "teal" },
                  { icon: UserCheck, title: "Identity Verification", desc: "KYC and KYB procedures protect all users and businesses on the platform.", color: "emerald" },
                  { icon: Eye, title: "AML Compliance", desc: "Every transaction is screened through compliance and risk management.", color: "purple" },
                  { icon: Activity, title: "Blockchain Monitoring", desc: "Real-time on-chain detection and confirmation for all trades.", color: "teal" },
                  { icon: Shield, title: "Fraud Prevention", desc: "Advanced fraud prevention systems protect retail and business accounts.", color: "emerald" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className={cn(
                      "rounded-xl border p-3.5 sm:p-4 transition-all",
                      s.color === "emerald" ? "border-emerald-500/15 bg-emerald-500/[0.03] hover:border-emerald-500/25" :
                      s.color === "teal" ? "border-teal-500/15 bg-teal-500/[0.03] hover:border-teal-500/25" :
                      "border-purple-500/15 bg-purple-500/[0.03] hover:border-purple-500/25"
                    )}>
                    <s.icon className={cn("w-4 h-4 mb-2 sm:mb-3",
                      s.color === "emerald" ? "text-emerald-400" :
                      s.color === "teal" ? "text-teal-400" :
                      "text-purple-400"
                    )} />
                    <p className="text-white font-bold text-xs mb-1">{s.title}</p>
                    <p className="text-gray-500 text-[10px] sm:text-[11px] leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.05]" aria-labelledby="otc-faq">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">FAQ</p>
              <h2 id="otc-faq" className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4">
                Frequently asked questions about crypto OTC trading in Nigeria
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">Everything you need to know about buying and selling USDT, USDC, Bitcoin and Ethereum with GemRails.</p>
            </motion.div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 sm:mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={e => { setFaqSearch(e.target.value); setOpenFAQ(null) }}
                  placeholder="Search questions (e.g. sell USDT, payout time)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 font-medium focus:outline-none transition-all border border-white/[0.08] bg-white/[0.02] focus:border-emerald-500/40"
                />
              </div>
            </div>

            {/* Category tabs - horizontal scroll on mobile */}
            <div className={cn("overflow-x-auto no-scrollbar pb-2 mb-6 transition-opacity -mx-4 px-4 sm:mx-0 sm:px-0", faqSearch ? "opacity-30 pointer-events-none" : "opacity-100")}>
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
                {FAQ_CATS.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFaqCat(cat); setOpenFAQ(null) }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0",
                      faqCat === cat
                        ? "bg-emerald-500 border-transparent text-black shadow-lg shadow-emerald-500/10"
                        : "border-white/[0.07] text-gray-400 hover:text-white hover:border-white/15"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {faqSearch && (
              <p className="text-xs text-gray-500 mb-4">
                <Search className="w-3 h-3 inline mr-1 text-emerald-400" />
                {filteredFAQ.length} result{filteredFAQ.length !== 1 ? "s" : ""} for "{faqSearch}"
              </p>
            )}

            <motion.div layout className="space-y-2">
              <AnimatePresence mode="popLayout">
                {filteredFAQ.length > 0 ? filteredFAQ.map((f) => (
                  <motion.div layout key={f.q} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FAQItem
                      q={f.q}
                      a={f.a}
                      isOpen={openFAQ === FAQ_DATA.findIndex(d => d.q === f.q)}
                      onClick={() => {
                        const idx = FAQ_DATA.findIndex(d => d.q === f.q)
                        setOpenFAQ(openFAQ === idx ? null : idx)
                      }}
                    />
                  </motion.div>
                )) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/[0.06] p-6 text-center">
                    <AlertCircle className="w-6 h-6 text-emerald-400/50 mx-auto mb-2" />
                    <p className="text-white font-bold text-xs sm:text-sm mb-1">No results found</p>
                    <p className="text-gray-500 text-xs mb-3">Try different keywords or clear your search</p>
                    <button onClick={() => setFaqSearch("")} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Clear search</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-gray-400 text-xs">Still have questions about our OTC trading platform?</p>
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold text-xs flex items-center gap-1">
                Contact us <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#080b0f] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6 sm:mb-8">
                <Rocket className="w-3.5 h-3.5" /> Ready to Trade?
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
                Your crypto.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Your Naira.</span>
                <br />In seconds.
              </h2>
              <p className="text-gray-400 text-xs sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
                Whether you're converting USDT to Naira, buying cryptocurrency for business operations, or accessing institutional OTC liquidity — GemRails is built for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="https://app.gemotc.com/" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20" target="_blank" rel="noopener noreferrer">
                  Create Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all active:scale-95">
                  Speak with Enterprise Desk
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.05] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 bg-[#050709]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center shrink-0"><Zap className="w-3 h-3 text-black" /></div>
              <span>© {new Date().getFullYear()} GemRails. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 text-[11px] sm:text-xs">
              <Link href="/platform" className="hover:text-gray-300 transition-colors">Platform</Link>
              <Link href="/platform/otc-desk" className="text-emerald-400">OTC Desk</Link>
              <Link href="/anti-money" className="hover:text-gray-300 transition-colors">AML Policy</Link>
              <Link href="/merchant-agreement" className="hover:text-gray-300 transition-colors">Merchant Agreement</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
