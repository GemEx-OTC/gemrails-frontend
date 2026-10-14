"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  QrCode,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Building2,
  Smartphone,
  ChevronDown,
  Sparkles,
  Rocket,
  Star,
  Users,
  Clock,
  Banknote,
  ArrowUp,
  Plus,
  Minus,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Menu,
  X,
  User,
  MapPin,
} from "lucide-react"

// Floating Particle Component
const FloatingParticle = ({ delay, duration, size, left, top }: { delay: number; duration: number; size: number; left: string; top: string }) => (
  <motion.div
    className="absolute rounded-full bg-emerald-500/30 blur-sm"
    style={{ width: size, height: size, left, top }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

// Glowing Orb Component
const GlowingOrb = ({ className }: { className?: string }) => (
  <motion.div
    className={`absolute rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40 blur-3xl ${className}`}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.4, 0.6, 0.4],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 2 }: { end: number; suffix?: string; prefix?: string; duration?: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isVisible, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]))
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <motion.div
    className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm"
    initial={false}
    animate={{ backgroundColor: isOpen ? "rgba(16, 185, 129, 0.05)" : "rgba(17, 24, 39, 0.5)" }}
  >
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
    >
      <span className="text-white font-medium pr-4">{question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-6 pb-5 text-gray-400">{answer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [transactions, setTransactions] = useState(100)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()

  // Track mouse for cursor effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Show floating CTA after scrolling past hero, hide when near footer
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetHeight
        const scrollPosition = window.scrollY + window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        
        // Show CTA after hero section
        const shouldShow = window.scrollY > heroBottom
        
        // Hide CTA when within 200px of the bottom (footer area)
        const isNearBottom = scrollPosition >= documentHeight - 200
        
        setShowFloatingCTA(shouldShow && !isNearBottom)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const faqData = [
    { question: "What cryptocurrencies do you support?", answer: "We currently support USDT and USDC stablecoins on multiple networks including Ethereum, BSC, and Polygon. More options coming soon!" },
    { question: "How fast is the Naira settlement?", answer: "Lightning fast! Most settlements complete within 2-5 seconds after blockchain confirmation. Your money hits your bank account almost instantly." },
    { question: "Is there a minimum transaction amount?", answer: "Yes, the minimum transaction is $1 (or equivalent in stablecoins). No maximum limit for verified merchants!" },
    { question: "How do I get the ₦100 bonus?", answer: "The ₦100 bonus is automatically added to every successful transaction. No action needed - just watch your wallet grow!" },
    { question: "What about chargebacks and refunds?", answer: "Crypto payments are final and irreversible, eliminating chargeback fraud. You can issue refunds manually through our dashboard if needed." },
  ]

  const bonusEarnings = transactions * 100

  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-x-hidden">
      {/* Animated Cursor Glow */}
      <motion.div
        className="fixed w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none z-0"
        animate={{ x: mousePosition.x - 128, y: mousePosition.y - 128 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/about"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                About Us
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                How It Works
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                Pricing
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
              <Link
                href="#faq"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                FAQ
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-400 hover:text-white transition-colors relative group"
              >
                Sign in
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-emerald-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-800 bg-[#0a0d10]/95 backdrop-blur-lg"
            >
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/about"
                  className="block text-gray-400 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/how-it-works"
                  className="block text-gray-400 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-400 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  className="block text-gray-400 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <Link
                    href="/auth/login"
                    className="block text-center py-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block text-center px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <GlowingOrb className="w-[600px] h-[600px] -top-40 -left-40" />
          <GlowingOrb className="w-[500px] h-[500px] -bottom-20 -right-20" />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.5}
              duration={3 + ((i * 7 + 3) % 10) / 5}
              size={4 + ((i * 13 + 5) % 10) * 0.8}
              left={`${((i * 17 + 11) % 100)}%`}
              top={`${((i * 23 + 7) % 100)}%`}
            />
          ))}
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Animated Badge */}
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
                animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                Instant Naira Settlement
              </motion.span>

              {/* Hero Heading with Glitch Effect */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Accept Digital Assets,{" "}
                <motion.span 
                  className="relative inline-block bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                  animate={{ backgroundPosition: ["0% center", "200% center"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  Get Naira Instantly
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg -z-10"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.span>
              </h1>

              <motion.p 
                className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Enable your business to accept{" "}
                <span className="text-emerald-400 font-semibold">Stablecoin</span> payments with instant Naira settlement.{" "}
                <span className="text-gray-500">No crypto knowledge required.</span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.4)" }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                  <Link
                    href="/auth/signup"
                    className="relative w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Register Your Business
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/login"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white border border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </motion.div>

              {/* Floating Stats Preview */}
              <motion.div 
                className="mt-16 flex flex-wrap justify-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { icon: Users, value: "10K+", label: "Merchants" },
                  { icon: Banknote, value: "₦500M+", label: "Settled" },
                  { icon: Clock, value: "2 sec", label: "Avg. Settlement" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, borderColor: "rgba(16,185,129,0.5)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                  >
                    <stat.icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-bold">{stat.value}</span>
                    <span className="text-gray-500 text-sm">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-emerald-400/50" />
        </motion.div>
      </section>

      {/* ========== LIVE STATS TICKER ========== */}
      <section className="py-6 border-y border-gray-800/50 bg-gray-900/30 overflow-hidden">
        <motion.div 
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex gap-12">
              {[
                { label: "Daily Volume", value: "₦50M+", icon: TrendingUp },
                { label: "System Uptime", value: "99.99%", icon: Zap },
                { label: "Security Level", value: "Bank Grade", icon: Shield },
                { label: "Platform", value: "Web & Mobile", icon: Smartphone },
                { label: "Transaction Speed", value: "Instant", icon: Rocket },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400">
                  <stat.icon className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">{stat.label}:</span>
                  <span className="text-emerald-400 font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ========== HOW IT WORKS - 3D CARDS ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> Simple Setup
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Start accepting crypto payments in minutes with our simple QR code system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent -translate-y-1/2 z-0" />

            {[
              { step: 1, icon: Building2, title: "Register", desc: "Sign up and verify your business in minutes", color: "from-emerald-500 to-teal-500" },
              { step: 2, icon: QrCode, title: "Get QR Code", desc: "Receive your unique payment QR code", color: "from-teal-500 to-cyan-500" },
              { step: 3, icon: Smartphone, title: "Customer Pays", desc: "Customer scans and pays with Stablecoins", color: "from-cyan-500 to-blue-500" },
              { step: 4, icon: Zap, title: "Instant Settlement", desc: "Receive Naira + ₦100 bonus instantly", color: "from-blue-500 to-emerald-500" },
            ].map((item, idx) => (
              <TiltCard key={item.step} className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center h-full group-hover:border-emerald-500/50 transition-colors">
                    <motion.div 
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} p-0.5`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <div className="text-emerald-400 font-bold mb-2 text-sm">STEP {item.step}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTERACTIVE QR DEMO ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-transparent relative overflow-hidden">
        <GlowingOrb className="w-[400px] h-[400px] top-1/2 left-1/4 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto lg:mx-0"
            >
              <div className="relative w-72 h-[580px] bg-gray-900 rounded-[50px] border-4 border-gray-800 shadow-2xl overflow-hidden">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
                
                {/* Screen Content */}
                <div className="absolute inset-4 top-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[38px] flex flex-col items-center justify-center p-6">
                  {/* QR Code Area */}
                  <div className="bg-white rounded-2xl p-4 shadow-xl relative overflow-hidden">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-gray-700" />
                    </div>
                    {/* Scanning Line Animation */}
                    <motion.div
                      className="absolute left-4 right-4 h-0.5 bg-emerald-500"
                      animate={{ top: ["20%", "80%", "20%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  <div className="mt-6 text-white text-center">
                    <p className="text-lg font-semibold">Pay with Stablecoins</p>
                    <p className="text-white/80 text-sm mt-1">Scan to pay merchant</p>
                  </div>
                  
                  {/* Floating Notifications */}
                  <motion.div
                    className="absolute top-20 right-2 bg-white/90 rounded-lg px-3 py-2 shadow-lg"
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-gray-700 font-medium">+₦100 Bonus!</span>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Flying Money Animation */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [0, 150, 200],
                    y: [0, -50 - i * 20, -100 - i * 20],
                    rotate: [0, 15, 30],
                  }}
                  transition={{
                    duration: 2,
                    delay: 1 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  style={{ top: "50%", left: "60%" }}
                >
                  <Banknote className="w-8 h-8 text-emerald-400" />
                </motion.div>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                <QrCode className="w-4 h-4" /> Live Demo
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Simple QR, Instant Cash
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Your customers scan your unique QR code, pay with their stablecoins, and you receive Naira in your bank account — all in under 5 seconds.
              </p>
              
              <div className="space-y-4">
                {[
                  "Customer scans your business QR code",
                  "Pays with Stablecoins",
                  "You receive Naira + ₦100 bonus instantly",
                  "Track all transactions in real-time dashboard",
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Built for <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Nigerian Businesses</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to accept crypto payments and grow your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Zap, 
                title: "Instant Settlement", 
                desc: "Receive Naira in your bank account within seconds of payment confirmation",
                stat: "2s avg"
              },
              { 
                icon: TrendingUp, 
                title: "Earn Bonus Per Transaction", 
                desc: "You get ₦100 bonus on every successful payment — it adds up fast!",
                stat: "₦100K+/mo"
              },
              { 
                icon: Shield, 
                title: "Bank-Grade Security", 
                desc: "Enterprise security with full regulatory compliance",
                stat: "256-bit"
              },
              { 
                icon: QrCode, 
                title: "Simple QR Payments", 
                desc: "No complex integrations — just display your QR code",
                stat: "1 step"
              },
              { 
                icon: Smartphone, 
                title: "Mobile Dashboard", 
                desc: "Monitor your business from anywhere with our app",
                stat: "Real-time"
              },
              { 
                icon: Users, 
                title: "24/7 Support", 
                desc: "Dedicated support team ready to help you grow",
                stat: "Always on"
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Hover glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative bg-gray-900/90 border border-gray-800 rounded-2xl p-6 h-full group-hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-sm">
                  {/* Icon */}
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20"
                    whileHover={{ rotate: 12, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{feature.desc}</p>
                  
                  {/* Stat badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-400 text-sm font-medium">{feature.stat}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BONUS CALCULATOR ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Bonus Calculator
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Calculate Your Earnings
            </h2>
            <p className="text-gray-400 text-lg">
              See how much bonus you can earn every month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="mb-8">
                <label className="text-gray-400 text-sm mb-2 block">Monthly Transactions</label>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTransactions(Math.max(0, transactions - 50))}
                    className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:border-emerald-500 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={transactions}
                    onChange={(e) => setTransactions(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-emerald-500 [&::-webkit-slider-thumb]:to-teal-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTransactions(Math.min(1000, transactions + 50))}
                    className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white hover:border-emerald-500 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold text-white">{transactions}</span>
                  <span className="text-gray-500 ml-2">transactions/month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Bonus Per Transaction</p>
                  <p className="text-2xl font-bold text-emerald-400">₦100</p>
                </div>
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-6 text-center border border-emerald-500/30"
                  animate={bonusEarnings > 50000 ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-400 text-sm mb-2">Monthly Bonus</p>
                  <motion.p 
                    className="text-2xl font-bold text-emerald-400"
                    key={bonusEarnings}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    ₦{bonusEarnings.toLocaleString()}
                  </motion.p>
                </motion.div>
              </div>

              {bonusEarnings >= 50000 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    🎉 That's ₦{(bonusEarnings * 12).toLocaleString()} per year!
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== TRUST SECTION ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Businesses Across Nigeria</h2>
            <p className="text-gray-400">Join thousands of merchants already growing with GemRails</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Adaobi C.", business: "Adaobi's Boutique, Lagos", quote: "The instant settlement changed my business. I no longer wait days for my money!", rating: 5 },
              { name: "Emeka O.", business: "Tech Hub Nigeria", quote: "Finally, a way to accept international payments without the hassle. The ₦100 bonus adds up!", rating: 5 },
              { name: "Fatima M.", business: "FM Fashion House, Kano", quote: "So easy to use! My customers love paying with crypto and I love the instant Naira.", rating: 5 },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.3, rotate: 20 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.business}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ZERO FEES SECTION ========== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Dramatic background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Orbiting rings */}
          {[280, 360, 440].map((size, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full border border-emerald-500/[0.06]"
              style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }}
            />
          ))}
          {/* Floating dollar signs */}
          {[
            { left: "8%", top: "20%", delay: 0 },
            { left: "85%", top: "15%", delay: 1.5 },
            { left: "15%", top: "75%", delay: 3 },
            { left: "80%", top: "70%", delay: 0.8 },
            { left: "50%", top: "10%", delay: 2.2 },
            { left: "92%", top: "45%", delay: 1 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-500/10 text-2xl sm:text-3xl font-black select-none"
              style={{ left: pos.left, top: pos.top }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: pos.delay }}
            >
              $
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Fee <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Structure</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">Simple, transparent pricing — no surprises</p>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 30px rgba(16,185,129,0.15)", "0 0 0px rgba(16,185,129,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-emerald-400 text-sm font-semibold tracking-wide">Network Expansion Phase</span>
            </motion.div>
          </motion.div>

          {/* Massive $0 hero */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              className="relative inline-block mb-4"
            >
              {/* Glow layers */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="text-[120px] sm:text-[160px] lg:text-[200px] font-black text-emerald-500/10 blur-3xl select-none">$0</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="text-[120px] sm:text-[160px] lg:text-[200px] font-black text-emerald-400/5 blur-xl select-none">$0</div>
              </div>
              {/* Main text */}
              <motion.span
                className="relative text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none bg-gradient-to-b from-white via-emerald-100 to-emerald-500 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "100% 200%" }}
              >
                $0
              </motion.span>
            </motion.div>

            {/* Strikethrough comparison */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <span className="text-gray-600 line-through text-lg">Hidden fees</span>
              <ArrowRight className="w-4 h-4 text-gray-600" />
              <span className="text-emerald-400 font-bold text-lg">Zero. Nada. Nothing.</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 max-w-xl mx-auto leading-relaxed text-base sm:text-lg"
            >
              No onboarding fees for merchants. No transaction fees for consumers. We are building the future of payments in Africa — and you can join for free.
            </motion.p>
          </div>

          {/* Animated comparison cards */}
          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
            {[
              {
                type: "Merchants",
                icon: Building2,
                price: "$0",
                sub: "onboarding",
                color: "emerald",
                gradient: "from-emerald-500 to-teal-500",
                items: [
                  { text: "Free to register", icon: CheckCircle },
                  { text: "Free bank settlement", icon: Banknote },
                  { text: "No hidden charges", icon: Shield },
                  { text: "Instant setup", icon: Zap },
                ],
              },
              {
                type: "Consumers",
                icon: User,
                price: "$0",
                sub: "per transaction",
                color: "teal",
                gradient: "from-teal-500 to-cyan-500",
                items: [
                  { text: "Zero fees to pay", icon: CheckCircle },
                  { text: "No conversion charges", icon: Banknote },
                  { text: "Pay with any stablecoin", icon: Shield },
                  { text: "Expansion phase pricing", icon: Sparkles },
                ],
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.15, type: "spring" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative"
              >
                {/* Hover glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                <div className={`relative bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 group-hover:border-${card.color}-500/40 transition-all overflow-hidden`}>
                  {/* Corner decoration */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-bl ${card.gradient} opacity-[0.07] rounded-full blur-2xl`} />

                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: [0, -8, 8, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <card.icon className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-white font-bold">{card.type}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className={`p-4 rounded-xl bg-${card.color}-500/5 border border-${card.color}-500/10 mb-5`}>
                      <div className="flex items-baseline gap-2">
                        <motion.span
                          className={`text-5xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                        >
                          {card.price}
                        </motion.span>
                        <span className="text-gray-500 text-sm">{card.sub}</span>
                      </div>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3">
                      {card.items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1 + i * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-7 h-7 rounded-lg bg-${card.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-3.5 h-3.5 text-${card.color}-400`} />
                          </div>
                          <span className="text-sm text-gray-300">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl hover:shadow-emerald-500/25 transition-all"
              >
                View Full Pricing
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-center text-gray-600 text-xs mt-8"
          >
            Future pricing will remain transparent and transaction-based — designed to be cheaper than traditional payment rails.
          </motion.p>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about GemRails</p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {faqData.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === idx}
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GlowingOrb className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Transform Your Business?
            </span>
          </motion.h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the payment revolution. Accept crypto, earn bonuses, and get instant Naira settlement.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16,185,129,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              <Rocket className="w-6 h-6" />
              Get Started — It's Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <motion.img 
                  src="/logo/logo_icon.png" 
                  alt="GemRails" 
                  className="w-10 h-10 rounded-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
                <div>
                  <span className="text-xl font-bold text-white">GemRails</span>
                </div>
              </div>
              <p className="text-gray-400 max-w-sm mb-4">
                The easiest way for Nigerian businesses to accept cryptocurrency payments with instant Naira settlement.
              </p>
              <div className="flex items-start gap-2.5 text-gray-400 text-sm max-w-sm mb-6">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                <span>Flat 1b, Higher Life Building, Opposite First Bank, Onile Aro Junction, Ojoo, Ibadan</span>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: "https://www.tiktok.com/@gemrails?_r=1&_t=ZN-95C9RhoxVtW" },
                  { icon: Instagram, href: "https://www.instagram.com/gemrails?igsh=Y2NmaDJ2OWh1M2U1" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/gem-rails/" },
                  { icon: Mail, href: "mailto:Support@gemrails.com" },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: "Contact Us", href: "/contact" },
                  { name: "Terms & Conditions", href: "/terms" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "AML Policy", href: "/anti-money" },
                  { name: "Merchant Agreement", href: "/merchant-agreement" }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors relative group">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">Get the latest news and updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} GemRails. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Flat 1b, Higher Life Building, Opposite First Bank, Onile Aro Junction, Ojoo, Ibadan
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/anti-money" className="hover:text-emerald-400 transition-colors">AML Policy</Link>
              <Link href="/merchant-agreement" className="hover:text-emerald-400 transition-colors">Merchant Agreement</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
              
            </div>
          </div>
        </div>
      </footer>

      {/* ========== FLOATING CTA ========== */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 border-t border-gray-800 backdrop-blur-lg p-4"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-3 h-3 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-white font-medium">Ready to accept crypto payments?</span>
              </div>
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signup"
                    className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  )
}
