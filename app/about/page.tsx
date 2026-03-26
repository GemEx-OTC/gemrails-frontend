"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { 
  ArrowLeft, Target, Lightbulb, Shield, TrendingUp, Globe,
  Coins, ArrowRight, Zap, Banknote, Repeat, Lock,
  AlertTriangle, Clock, TrendingDown, Users, User, Rocket, Layers
} from "lucide-react"

// Payment Flow Animation Component — Premium version
const PaymentFlowAnimation = () => {
  const [activeNode, setActiveNode] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setActiveNode(p => (p + 1) % 5), 2000)
    return () => clearInterval(interval)
  }, [])

  const nodes = [
    { Icon: User, label: "Customer", sub: "Scans QR", gradient: "from-blue-500 to-indigo-500" },
    { Icon: Coins, label: "Stablecoin", sub: "USDT / USDC", gradient: "from-teal-500 to-emerald-500" },
    { Icon: null, label: "GemRails", sub: "Converts", gradient: "from-emerald-500 to-green-500", isCenter: true },
    { Icon: Banknote, label: "Local Currency", sub: "NGN", gradient: "from-green-500 to-lime-500" },
    { Icon: User, label: "Merchant", sub: "Receives ₦", gradient: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="relative w-full my-12">
      {/* Desktop */}
      <div className="hidden md:block relative h-72">
        {/* Connection line */}
        <div className="absolute top-[52px] left-[10%] right-[10%] h-[2px]">
          <div className="w-full h-full bg-gradient-to-r from-blue-500/20 via-emerald-500/40 to-emerald-500/20 rounded-full" />
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400"
              style={{ filter: "blur(1px)", boxShadow: "0 0 12px rgba(16,185,129,0.8)" }}
              animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "linear" }}
            />
          ))}
        </div>

        {/* Nodes */}
        <div className="relative flex items-start justify-between px-[2%]">
          {nodes.map((node, i) => {
            const isActive = activeNode === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center relative z-10"
              >
                <motion.div
                  className={`relative w-[104px] h-[104px] rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                    node.isCenter
                      ? "bg-[#0a0d10] border-emerald-500/60"
                      : isActive
                      ? "bg-gray-800/80 border-emerald-500/50"
                      : "bg-gray-900/80 border-gray-700/50"
                  }`}
                  animate={isActive ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 30px rgba(16,185,129,0.4)", "0 0 0px rgba(16,185,129,0)"] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  {node.isCenter ? (
                    <img src="/apple-touch-icon.png" alt="GemRails" className="w-14 h-14 rounded-xl" />
                  ) : node.Icon ? (
                    <node.Icon className={`w-8 h-8 ${isActive ? "text-emerald-400" : "text-gray-400"} transition-colors`} />
                  ) : null}
                  {/* Pulse ring */}
                  {(isActive || node.isCenter) && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-emerald-500/30"
                      animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className={`text-sm font-semibold mt-3 transition-colors ${isActive ? "text-emerald-400" : "text-white"}`}>{node.label}</span>
                <span className="text-[11px] text-gray-500">{node.sub}</span>
              </motion.div>
            )
          })}
        </div>

        {/* Step labels */}
        <div className="flex justify-between px-[2%] mt-6">
          {["01 — Pay", "02 — Send", "03 — Convert", "04 — Settle", "05 — Receive"].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`text-center w-[104px] text-[10px] font-medium tracking-wider uppercase ${activeNode === i ? "text-emerald-400" : "text-gray-600"} transition-colors`}
            >
              {step}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile — vertical */}
      <div className="md:hidden flex flex-col items-center gap-2 py-6">
        {nodes.map((node, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
            <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border w-full max-w-[280px] ${
              node.isCenter ? "bg-[#0a0d10] border-emerald-500/40" : activeNode === i ? "bg-gray-800/60 border-emerald-500/30" : "bg-gray-900/50 border-gray-800/50"
            } transition-all`}>
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${node.isCenter ? "bg-transparent" : "bg-gray-800"}`}>
                {node.isCenter ? (
                  <img src="/apple-touch-icon.png" alt="GemRails" className="w-9 h-9 rounded-lg" />
                ) : node.Icon ? (
                  <node.Icon className={`w-5 h-5 ${activeNode === i ? "text-emerald-400" : "text-gray-400"}`} />
                ) : null}
              </div>
              <div>
                <div className={`text-sm font-semibold ${activeNode === i ? "text-emerald-400" : "text-white"}`}>{node.label}</div>
                <div className="text-gray-500 text-[11px]">{node.sub}</div>
              </div>
            </div>
            {i < 4 && (
              <motion.div className="w-[2px] h-5 bg-gradient-to-b from-emerald-500/30 to-transparent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Globe Network Animation — Enhanced
const GlobeNetworkAnimation = () => {
  const [hoveredCountry, setHoveredCountry] = useState<number | null>(null)
  const [isIgnited, setIsIgnited] = useState(false)
  const [showShockwave, setShowShockwave] = useState(false)

  const handleIgnite = () => {
    setShowShockwave(true)
    setTimeout(() => { setIsIgnited(true); setShowShockwave(false) }, 600)
  }

  const countries = [
    { label: "Nigeria", code: "NG", status: "Live", angle: 90, users: "2.4K+" },
    { label: "Ghana", code: "GH", status: "Coming Soon", angle: 162, users: "-" },
    { label: "Kenya", code: "KE", status: "Coming Soon", angle: 234, users: "-" },
    { label: "South Africa", code: "ZA", status: "Coming Soon", angle: 306, users: "-" },
    { label: "Egypt", code: "EG", status: "Coming Soon", angle: 18, users: "-" }
  ]

  return (
    <div className="relative w-full my-12">
      {/* Desktop */}
      <div className="hidden md:block relative w-full h-[420px]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(16,185,129,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {[180, 240, 300].map((size, i) => (
          <motion.div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" style={{ width: size, height: size }} animate={{ rotate: 360 }} transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }} />
        ))}

        <AnimatePresence>
          {showShockwave && (
            <>
              {[1, 2, 3].map(ring => (
                <motion.div key={`sw-${ring}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400" initial={{ width: 50, height: 50, opacity: 1 }} animate={{ width: 400, height: 400, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: ring * 0.15, ease: "easeOut" }} />
              ))}
              {[...Array(12)].map((_, i) => {
                const a = (i * 30) * Math.PI / 180
                return <motion.div key={`sp-${i}`} className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-emerald-400" initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: Math.cos(a) * 150, y: Math.sin(a) * 150, scale: 0, opacity: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ boxShadow: "0 0 10px rgba(16,185,129,0.8)" }} />
              })}
            </>
          )}
        </AnimatePresence>

        {/* Beams */}
        {countries.map((country, i) => {
          const isLive = country.status === "Live"
          const shouldGlow = isIgnited && isLive
          return (
            <motion.div key={`beam-${i}`} className="absolute left-1/2 top-1/2 origin-left" style={{ width: 160, height: shouldGlow ? 3 : 2, rotate: country.angle, translateX: 0, translateY: -1 }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}>
              <motion.div className="w-full h-full rounded-full" animate={{ background: shouldGlow ? "linear-gradient(to right, rgba(16,185,129,0.9), rgba(16,185,129,0.4))" : hoveredCountry === i ? "linear-gradient(to right, rgba(16,185,129,0.5), rgba(16,185,129,0.1))" : "linear-gradient(to right, rgba(16,185,129,0.2), rgba(16,185,129,0.02))", boxShadow: shouldGlow ? "0 0 15px rgba(16,185,129,0.6)" : "none" }} transition={{ duration: 0.5 }} />
              <motion.div className="absolute top-1/2 -translate-y-1/2 rounded-full" style={{ width: shouldGlow ? 8 : 6, height: shouldGlow ? 8 : 6, background: shouldGlow ? "#10b981" : isLive ? "#10b981" : "#6b7280", boxShadow: shouldGlow ? "0 0 15px rgba(16,185,129,0.8)" : "none" }} animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: shouldGlow ? 1.5 : 2, repeat: Infinity, delay: i * 0.4 }} />
            </motion.div>
          )
        })}

        {/* Central Hub */}
        <motion.div className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} onClick={handleIgnite} whileTap={{ scale: 0.95 }}>
          <motion.div className="w-28 h-28 rounded-full bg-[#0a0d10] border-2 flex items-center justify-center relative" animate={{ borderColor: isIgnited ? "rgba(16,185,129,0.8)" : "rgba(16,185,129,0.5)", boxShadow: isIgnited ? ["0 0 40px rgba(16,185,129,0.5), inset 0 0 30px rgba(16,185,129,0.15)", "0 0 80px rgba(16,185,129,0.8), inset 0 0 40px rgba(16,185,129,0.25)", "0 0 40px rgba(16,185,129,0.5), inset 0 0 30px rgba(16,185,129,0.15)"] : ["0 0 30px rgba(16,185,129,0.2), inset 0 0 20px rgba(16,185,129,0.05)", "0 0 60px rgba(16,185,129,0.4), inset 0 0 30px rgba(16,185,129,0.1)", "0 0 30px rgba(16,185,129,0.2), inset 0 0 20px rgba(16,185,129,0.05)"] }} transition={{ duration: isIgnited ? 1.5 : 3, repeat: Infinity }}>
            <div className="w-16 h-16 rounded-xl overflow-hidden"><img src="/apple-touch-icon.png" alt="GemRails" className="w-full h-full object-contain" /></div>
            {[1, 2, 3].map(ring => (
              <motion.div key={ring} className="absolute inset-0 rounded-full border" style={{ borderColor: isIgnited ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.2)" }} animate={{ scale: [1, 1.5 + ring * 0.3], opacity: [isIgnited ? 0.5 : 0.3, 0] }} transition={{ duration: isIgnited ? 1.5 : 2.5, repeat: Infinity, delay: ring * 0.4 }} />
            ))}
            {isIgnited && <motion.div className="absolute inset-0 rounded-full" animate={{ background: ["radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)", "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)", "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)"] }} transition={{ duration: 1, repeat: Infinity }} />}
          </motion.div>
          <p className="text-center text-xs text-emerald-400 font-bold mt-2">{isIgnited ? "🔥 GemRails Hub" : "Click to Ignite"}</p>
        </motion.div>

        {/* Country Nodes */}
        {countries.map((country, i) => {
          const angleRad = (country.angle * Math.PI) / 180
          const x = Math.cos(angleRad) * 160
          const y = Math.sin(angleRad) * 160
          const isLive = country.status === "Live"
          const isLit = isIgnited && isLive
          return (
            <motion.div key={i} className="absolute left-1/2 top-1/2 z-20 cursor-pointer" style={{ x, y, translateX: "-50%", translateY: "-50%" }} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15, type: "spring", bounce: 0.3 }} onMouseEnter={() => setHoveredCountry(i)} onMouseLeave={() => setHoveredCountry(null)} whileHover={{ scale: 1.15 }}>
              {isLit && <motion.div className="absolute inset-0 rounded-xl" animate={{ boxShadow: ["0 0 20px rgba(16,185,129,0.4)", "0 0 30px rgba(16,185,129,0.6)", "0 0 20px rgba(16,185,129,0.4)"] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ margin: -8 }} />}
              <motion.div className="relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl border backdrop-blur-sm" animate={{ backgroundColor: isLit ? "rgba(16,185,129,0.15)" : hoveredCountry === i ? "rgba(31,41,55,0.9)" : "rgba(17,24,39,0.7)", borderColor: isLit ? "rgba(16,185,129,0.6)" : hoveredCountry === i ? "rgba(16,185,129,0.5)" : "rgba(55,65,81,0.5)" }}>
                <motion.div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full" animate={{ backgroundColor: isLit ? "#10b981" : isLive ? "#10b981" : "#4b5563" }}>
                  {(isLive || isLit) && <motion.div className="absolute inset-0 rounded-full bg-emerald-400" animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                </motion.div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${isLit ? "bg-emerald-500/30 text-emerald-300" : isLive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/50 text-gray-400"}`}>{country.code}</div>
                <motion.span className="text-xs font-semibold whitespace-nowrap" animate={{ color: isLit ? "#10b981" : "#ffffff" }}>{country.label}</motion.span>
                <motion.span className="text-[10px] font-medium px-2 py-0.5 rounded-full" animate={{ backgroundColor: isLit ? "rgba(16,185,129,0.3)" : isLive ? "rgba(16,185,129,0.2)" : "rgba(55,65,81,0.5)", color: isLit ? "#10b981" : isLive ? "#10b981" : "#6b7280" }}>{isLit ? "🔥 Live" : country.status}</motion.span>
                <AnimatePresence>{hoveredCountry === i && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="text-[10px] text-gray-400 mt-1">{isLive ? `${country.users} merchants` : "Expanding soon"}</motion.div>}</AnimatePresence>
              </motion.div>
            </motion.div>
          )
        })}

        {[...Array(8)].map((_, i) => (
          <motion.div key={`p-${i}`} className="absolute w-1 h-1 rounded-full bg-emerald-400/30" style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }} animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }} />
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full py-6">
        <motion.div className="flex flex-col items-center mb-5 cursor-pointer" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} onClick={handleIgnite} whileTap={{ scale: 0.95 }}>
          <motion.div className="w-20 h-20 rounded-full bg-[#0a0d10] border-2 flex items-center justify-center relative" animate={{ borderColor: isIgnited ? "rgba(16,185,129,0.8)" : "rgba(16,185,129,0.5)", boxShadow: isIgnited ? ["0 0 30px rgba(16,185,129,0.4)", "0 0 60px rgba(16,185,129,0.7)", "0 0 30px rgba(16,185,129,0.4)"] : ["0 0 20px rgba(16,185,129,0.2)", "0 0 40px rgba(16,185,129,0.5)", "0 0 20px rgba(16,185,129,0.2)"] }} transition={{ duration: isIgnited ? 1.5 : 3, repeat: Infinity }}>
            <div className="w-12 h-12 rounded-lg overflow-hidden"><img src="/apple-touch-icon.png" alt="GemRails" className="w-full h-full object-contain" /></div>
            <motion.div className="absolute inset-0 rounded-full border" style={{ borderColor: isIgnited ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.2)" }} animate={{ scale: [1, 1.5], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
          <span className="text-xs text-emerald-400 font-bold mt-2">{isIgnited ? "🔥 GemRails Hub" : "Tap to Ignite"}</span>
        </motion.div>

        <div className="flex justify-center mb-3">
          <div className="relative w-[1px] h-6 bg-gradient-to-b from-emerald-500/40 to-emerald-500/10">
            <motion.div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 -left-[2.5px]" animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} />
          </div>
        </div>

        <div className="space-y-2.5 px-4 max-w-sm mx-auto">
          {countries.map((country, i) => {
            const isLive = country.status === "Live"
            const isLit = isIgnited && isLive
            return (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}>
                <motion.div className="flex items-center gap-3 p-3.5 rounded-xl border transition-all" animate={{ backgroundColor: isLit ? "rgba(16,185,129,0.08)" : "rgba(17,24,39,0.5)", borderColor: isLit ? "rgba(16,185,129,0.5)" : isLive ? "rgba(16,185,129,0.3)" : "rgba(31,41,55,0.6)" }}>
                  <motion.div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" animate={{ backgroundColor: isLit ? "rgba(16,185,129,0.2)" : isLive ? "rgba(16,185,129,0.1)" : "rgba(31,41,55,0.8)" }}>
                    <Globe className={`w-5 h-5 ${isLit || isLive ? "text-emerald-400" : "text-gray-500"}`} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isLit ? "text-emerald-400" : "text-white"}`}>{country.label}</span>
                      {isLive && <div className="relative w-2 h-2 rounded-full bg-emerald-400"><motion.div className="absolute inset-0 rounded-full bg-emerald-400" animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} /></div>}
                    </div>
                    <span className={`text-[11px] ${isLit ? "text-emerald-400/80" : isLive ? "text-emerald-400/70" : "text-gray-500"}`}>{isLit ? `🔥 ${country.users} merchants` : isLive ? `${country.users} merchants` : country.status}</span>
                  </div>
                  <motion.span className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full" animate={{ backgroundColor: isLit ? "rgba(16,185,129,0.3)" : isLive ? "rgba(16,185,129,0.2)" : "rgba(31,41,55,1)", color: isLit ? "#10b981" : isLive ? "#10b981" : "#6b7280" }}>{isLit ? "🔥 Live" : isLive ? "Live" : "Soon"}</motion.span>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Security Shield Animation — Enhanced with orbiting icons
const SecurityAnimation = () => (
  <div className="relative w-full h-72 flex items-center justify-center my-8">
    <motion.div className="relative" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
      <motion.div
        className="w-36 h-36 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative"
        animate={{ boxShadow: ["0 0 30px rgba(16,185,129,0.3)", "0 0 60px rgba(16,185,129,0.6)", "0 0 30px rgba(16,185,129,0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Shield className="w-16 h-16 text-white" />
      </motion.div>
      {[1, 2, 3].map(i => (
        <motion.div key={i} className="absolute inset-0 rounded-3xl border-2 border-emerald-400" animate={{ scale: [1, 2, 2], opacity: [0.8, 0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }} />
      ))}
      {/* Orbiting security icons */}
      {[
        { Icon: Lock, angle: 0 },
        { Icon: Shield, angle: 120 },
        { Icon: Zap, angle: 240 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
          style={{ transformOrigin: "0 0" }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg bg-gray-900 border border-emerald-500/30 flex items-center justify-center"
            style={{ transform: `translate(${Math.cos(item.angle * Math.PI / 180) * 90}px, ${Math.sin(item.angle * Math.PI / 180) * 90}px) translate(-50%, -50%)` }}
          >
            <item.Icon className="w-4 h-4 text-emerald-400" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  </div>
)

// Problem / Solution Section — Enhanced with better visuals
const ProblemSolutionTabs = () => {
  const [activeTab, setActiveTab] = useState<"problem" | "solution">("problem")
  const [progress, setProgress] = useState(0)
  const isProblem = activeTab === "problem"

  useEffect(() => {
    const interval = setInterval(() => setProgress(prev => prev + (100 / 150)), 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) { setActiveTab(c => c === "problem" ? "solution" : "problem"); setProgress(0) }
  }, [progress])

  const handleTabSwitch = (tab: "problem" | "solution") => { setActiveTab(tab); setProgress(0) }

  const problemStats = [
    { icon: Clock, value: "Limited", label: "spending options", title: "Adoption Gap" },
    { icon: TrendingDown, value: "Complex", label: "integration needed", title: "Infrastructure Barrier" },
    { icon: Users, value: "Growing", label: "unmet demand", title: "Market Disconnect" },
    { icon: AlertTriangle, value: "High", label: "operational friction", title: "Workflow Disruption" }
  ]

  const solutionStats = [
    { icon: Zap, value: "Instant", label: "settlement", title: "Fast Processing" },
    { icon: Layers, value: "Zero", label: "integration changes", title: "Seamless Setup" },
    { icon: Users, value: "Any", label: "stablecoin supported", title: "Wide Compatibility" },
    { icon: Rocket, value: "Direct", label: "bank settlement", title: "Local Currency" }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
      <div className={`relative rounded-3xl p-6 sm:p-10 overflow-hidden border transition-all duration-700 ${isProblem ? "bg-gradient-to-br from-red-950/40 via-red-900/20 to-gray-900/80 border-red-500/20" : "bg-gradient-to-br from-emerald-950/40 via-emerald-900/20 to-gray-900/80 border-emerald-500/20"}`}>
        <motion.div className="absolute inset-0 transition-all duration-700" animate={{ background: isProblem ? "radial-gradient(ellipse at top, rgba(239,68,68,0.12) 0%, transparent 70%)" : "radial-gradient(ellipse at top, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />
        <div className={`absolute inset-0 transition-opacity duration-700 opacity-[0.03]`} style={{ backgroundImage: `linear-gradient(${isProblem ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.5)"} 1px, transparent 1px), linear-gradient(90deg, ${isProblem ? "rgba(239,68,68,0.5)" : "rgba(16,185,129,0.5)"} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

        {[...Array(6)].map((_, i) => (
          <motion.div key={`${activeTab}-${i}`} className={`absolute w-1 h-1 rounded-full ${isProblem ? "bg-red-400" : "bg-emerald-400"}`} style={{ left: `${15 + i * 15}%`, bottom: "10%" }} animate={{ y: [0, -120 - i * 20, 0], opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }} />
        ))}

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ duration: 0.5, type: "spring", bounce: 0.3 }} className="relative">
                <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-colors duration-500 ${isProblem ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}>
                  {isProblem ? <AlertTriangle className="w-9 h-9 sm:w-10 sm:h-10 text-red-400" /> : <Lightbulb className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-400" />}
                </div>
                {[1, 2].map(ring => (
                  <motion.div key={ring} className={`absolute inset-0 rounded-2xl border ${isProblem ? "border-red-500/30" : "border-emerald-500/30"}`} animate={{ scale: [1, 1.5 + ring * 0.3], opacity: [0.4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: ring * 0.5 }} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -30, filter: "blur(10px)" }} transition={{ duration: 0.4 }} className="text-center mb-8">
              <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isProblem ? "text-red-400" : "text-emerald-400"}`}>{isProblem ? "The Problem" : "The Solution"}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">{isProblem ? "Stablecoin adoption is growing, but spending them in everyday commerce remains difficult for both customers and businesses." : "GemRails handles the complexity of blockchain payments, conversion, and settlement so businesses don't have to."}</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {(isProblem ? problemStats : solutionStats).map((stat, idx) => (
                <motion.div key={`${activeTab}-${idx}`} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.15 + idx * 0.1, type: "spring", bounce: 0.2 }} whileHover={{ y: -5, scale: 1.03 }} className={`group relative rounded-xl p-5 border transition-all duration-300 cursor-default ${isProblem ? "bg-red-500/5 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10" : "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10"}`}>
                  <div className="relative z-10">
                    <stat.icon className={`w-5 h-5 mb-3 ${isProblem ? "text-red-400" : "text-emerald-400"}`} />
                    <div className={`text-2xl sm:text-3xl font-bold mb-1 ${isProblem ? "text-red-400" : "text-emerald-400"}`}>{stat.value}</div>
                    <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                    <p className="text-white text-sm font-medium">{stat.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full transition-colors duration-500 ${isProblem ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${progress}%` }} />
            </div>
            <div className="inline-flex items-center bg-gray-900/80 border border-gray-700 rounded-full p-1 backdrop-blur-sm">
              <button onClick={() => handleTabSwitch("problem")} className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isProblem ? "text-white" : "text-gray-400 hover:text-white"}`}>
                {isProblem && <motion.div layoutId="tabIndicator" className="absolute inset-0 bg-red-500 rounded-full shadow-lg shadow-red-500/30" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className="relative z-10">Problem</span>
              </button>
              <button onClick={() => handleTabSwitch("solution")} className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${!isProblem ? "text-white" : "text-gray-400 hover:text-white"}`}>
                {!isProblem && <motion.div layoutId="tabIndicator" className="absolute inset-0 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className="relative z-10">Solution</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnView)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOnView) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setHasStarted(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [startOnView])

  useEffect(() => {
    if (!hasStarted) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => { start += step; if (start >= end) { setCount(end); clearInterval(timer) } else setCount(Math.floor(start)) }, 16)
    return () => clearInterval(timer)
  }, [hasStarted, end, duration])

  return { count, ref }
}

// Stats Banner — Enhanced with animated counters and better layout
const StatsBanner = () => {
  const stat1 = useCounter(500, 2000)
  const stat2 = useCounter(99, 1800)
  const stat3 = useCounter(3, 1200)
  const stat4 = useCounter(24, 1500)

  const stats = [
    { ...stat1, suffix: "+", label: "Merchants Onboarded", icon: Users },
    { ...stat2, suffix: ".9%", label: "Uptime Guaranteed", icon: Zap },
    { ...stat3, suffix: "s", label: "Average Settlement", icon: Clock },
    { ...stat4, suffix: "/7", label: "Support Available", icon: Shield },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
      <div className="relative rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 p-1 overflow-hidden">
        <motion.div className="absolute inset-0 rounded-2xl" animate={{ background: ["linear-gradient(0deg, rgba(16,185,129,0.1), transparent, rgba(16,185,129,0.1))", "linear-gradient(180deg, rgba(16,185,129,0.1), transparent, rgba(16,185,129,0.1))", "linear-gradient(360deg, rgba(16,185,129,0.1), transparent, rgba(16,185,129,0.1))"] }} transition={{ duration: 4, repeat: Infinity }} />
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-8 bg-[#0a0d10]/80 rounded-xl backdrop-blur-sm">
          {stats.map((stat, i) => (
            <motion.div key={i} ref={stat.ref} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative text-center group py-2 sm:py-0">
              {i > 0 && <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-700/50" />}
              <motion.div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2 sm:mb-3 mx-auto" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </motion.div>
              <div className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{stat.count}{stat.suffix}</span>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Focus Card with interactive hover
const FocusCard = ({ focus, idx }: { focus: { icon: any; title: string; description: string; color: string; stat: string; statLabel: string }; idx: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const FocusIcon = focus.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, type: "spring", bounce: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.div whileHover={{ scale: 1.01, y: -2 }} className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-emerald-500/30 transition-all duration-500">
        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(16,185,129,0.1) 50%, transparent 60%)", backgroundSize: "200% 200%" }} animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} />
        <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-6">
          <div className="flex-shrink-0 flex items-start gap-3">
            <div className="relative">
              <motion.div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${focus.color} p-0.5`} whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <FocusIcon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-emerald-500/30">{idx + 1}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">{focus.title}</h3>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                <span className="text-sm font-bold text-emerald-400">{focus.stat}</span>
                <span className="text-[10px] text-gray-500">{focus.statLabel}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{focus.description}</p>
          </div>
        </div>
        <motion.div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }} />
      </motion.div>
    </motion.div>
  )
}

// Mission Statement — new premium component
const MissionStatement = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-16 relative"
  >
    <div className="relative rounded-3xl overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
      <div className="absolute inset-0 border border-emerald-500/10 rounded-3xl" />
      
      {/* Animated corner accents */}
      <motion.div className="absolute top-0 left-0 w-20 h-20" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
        <div className="w-full h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-b from-emerald-500/50 to-transparent" />
      </motion.div>
      <motion.div className="absolute bottom-0 right-0 w-20 h-20" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}>
        <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-l from-emerald-500/50 to-transparent" />
        <div className="absolute right-0 w-[1px] h-full bg-gradient-to-t from-emerald-500/50 to-transparent" />
      </motion.div>

      <div className="relative p-8 sm:p-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left — animated icon cluster */}
          <div className="flex-shrink-0 relative w-32 h-32">
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-2 rounded-xl bg-[#0a0d10] flex items-center justify-center"
              animate={{ boxShadow: ["inset 0 0 20px rgba(16,185,129,0.05)", "inset 0 0 40px rgba(16,185,129,0.15)", "inset 0 0 20px rgba(16,185,129,0.05)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <img src="/apple-touch-icon.png" alt="GemRails" className="w-16 h-16 rounded-xl" />
              </motion.div>
            </motion.div>
            {/* Orbiting dots */}
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-400/60"
                style={{
                  left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 56}px)`,
                  top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 56}px)`,
                  transform: "translate(-50%, -50%)"
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

          {/* Right — text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
            >
              <Target className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Our Mission</span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Making Digital Dollars <span className="text-emerald-400">Spendable Everywhere</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Gemrails is digital asset checkout payment infrastructure built for African commerce. We enable businesses to accept stablecoin payments and settle transactions seamlessly across modern financial rails.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base mt-3">
              By connecting blockchain networks with real-world commerce, Gemrails helps merchants become borderless — accept global payments while keeping operations as traditional as they were.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)

// "What Sets Us Apart" — new visual differentiator section
const WhatSetsUsApart = () => {
  const differentiators = [
    { icon: Zap, title: "Instant Settlement", desc: "Funds hit your bank in seconds, not days", metric: "< 3s" },
    { icon: Shield, title: "Zero Crypto Exposure", desc: "Merchants receive local currency, never crypto", metric: "0%" },
    { icon: Globe, title: "Borderless Payments", desc: "Accept from anyone, anywhere with stablecoins", metric: "Global" },
    { icon: Lock, title: "Built-in Compliance", desc: "KYT and transaction monitoring from day one", metric: "24/7" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">What Sets Us <span className="text-emerald-400">Apart</span></h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">The infrastructure layer that makes stablecoins practical for everyday business</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {differentiators.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            <div className="relative bg-gray-900/70 border border-gray-800/60 rounded-2xl p-5 group-hover:border-emerald-500/30 transition-all h-full flex flex-col">
              <motion.div
                className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <item.icon className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <div className="text-2xl font-black text-emerald-400 mb-1">{item.metric}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const focusItems = [
  { icon: TrendingUp, title: "Stablecoin-Powered Commerce", description: "We enable businesses to accept stablecoin payments in a way that integrates seamlessly with their existing operations, allowing customers to spend digital dollars in everyday transactions.", color: "from-emerald-500 to-teal-500", stat: "100+", statLabel: "Integrations" },
  { icon: Repeat, title: "Efficient Settlement", description: "Gemrails handles the processing, conversion, and settlement of stablecoin payments so businesses can receive funds directly in their bank accounts without needing to manage digital assets themselves.", color: "from-teal-500 to-cyan-500", stat: "< 3s", statLabel: "Settlement" },
  { icon: Globe, title: "Infrastructure for African Markets", description: "We are building payment rails designed for the realities of African commerce, starting in Nigeria and expanding across the continent.", color: "from-cyan-500 to-blue-500", stat: "5+", statLabel: "Countries" },
  { icon: Shield, title: "Compliance and Risk Management", description: "Compliance and transaction monitoring are built into the foundation of the Gemrails platform. We implement risk monitoring systems and operational controls designed to support responsible and compliant payment processing.", color: "from-blue-500 to-purple-500", stat: "99.9%", statLabel: "Compliance" },
  { icon: Lock, title: "Reliability and Security", description: "Our infrastructure is designed for stability, security, and consistent transaction processing, ensuring businesses can rely on Gemrails as dependable financial infrastructure for digital asset payments.", color: "from-purple-500 to-emerald-500", stat: "24/7", statLabel: "Monitoring" }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} style={{ top: "10%", left: "10%" }} />
        <motion.div className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity }} style={{ bottom: "10%", right: "10%" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
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

      {/* Hero Section — Enhanced */}
      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-emerald-500/5 blur-[80px] sm:blur-[100px]" />
          {[...Array(10)].map((_, i) => (
            <motion.div key={`hd-${i}`} className="absolute w-1 h-1 rounded-full bg-emerald-400/20 hidden sm:block" style={{ left: `${5 + (i * 9) % 90}%`, top: `${10 + (i * 7.3) % 80}%` }} animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1] }} transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5 sm:mb-6">
              <motion.div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400">Building the future of African commerce</span>
            </motion.div>

            <motion.h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              About <motion.span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent inline-block" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: "200% 200%" }}>GemRails</motion.span>
            </motion.h1>
            <motion.p className="text-base sm:text-xl text-gray-400 leading-relaxed px-2 sm:px-4 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Digital asset checkout payment infrastructure built for African commerce
            </motion.p>
          </motion.div>

          {/* Animated Icon Grid */}
          <div className="flex justify-center gap-6 sm:gap-8 mt-8 sm:mt-12">
            {[
              { icon: Coins, label: "Stablecoins", delay: 0.5 },
              { icon: Zap, label: "Instant", delay: 0.7 },
              { icon: Globe, label: "Global", delay: 0.9 }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: item.delay }} whileHover={{ scale: 1.15, y: -5 }} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center relative">
                  <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                  <motion.div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-emerald-500/20" animate={{ scale: [1, 1.2], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator */}
          <motion.div className="mt-12 sm:mt-16 hidden sm:flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">Scroll to explore</span>
            <motion.div className="w-5 h-8 rounded-full border border-gray-700 flex justify-center pt-1.5" animate={{ borderColor: ["rgba(55,65,81,1)", "rgba(16,185,129,0.3)", "rgba(55,65,81,1)"] }} transition={{ duration: 3, repeat: Infinity }}>
              <motion.div className="w-1 h-2 rounded-full bg-emerald-400" animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Mission Statement — new premium component */}
          <MissionStatement />

          {/* Stats Banner */}
          <StatsBanner />

          {/* What Sets Us Apart — new section */}
          <WhatSetsUsApart />

          {/* Payment Flow Animation */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12 sm:mb-16">
            <h3 className="text-lg sm:text-2xl font-bold text-center text-white mb-4 sm:mb-8">How Payments Flow</h3>
            <PaymentFlowAnimation />
          </motion.div>

          {/* Problem / Solution */}
          <ProblemSolutionTabs />

          {/* Our Vision */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Our Vision</h2>
            <GlobeNetworkAnimation />
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">We believe the future of commerce will be more open, faster, and globally connected. Digital assets, particularly stablecoins, are beginning to reshape how value moves across borders and between people.</p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">But for this future to become practical, digital assets must integrate seamlessly with the systems businesses already rely on to operate.</p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">Gemrails is building the infrastructure that connects stablecoin liquidity to everyday commerce — making it possible for digital dollars to move as easily through businesses as traditional payments do today. We are starting in Nigeria and expanding across Africa, building financial rails designed for a new era of commerce.</p>
            </div>
          </motion.div>

          {/* Our Focus */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="text-center mb-12">
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <Target className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Our Priorities</span>
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Focus</h2>
              <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">Building reliable infrastructure that connects stablecoins to real-world commerce across five core priorities.</p>
            </div>
            <div className="space-y-4">
              {focusItems.map((focus, idx) => (
                <FocusCard key={idx} focus={focus} idx={idx} />
              ))}
            </div>
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-white mb-4">Bank-Grade Security</h3>
              <SecurityAnimation />
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative text-center py-16 px-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10" />
            <motion.div className="absolute inset-0" animate={{ background: ["radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)", "radial-gradient(circle at 80% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)", "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)"] }} transition={{ duration: 8, repeat: Infinity }} />
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20" />
            <motion.div className="absolute inset-0 rounded-3xl" style={{ border: "1px solid transparent" }} animate={{ boxShadow: ["inset 0 0 20px rgba(16,185,129,0.1)", "inset 0 0 40px rgba(16,185,129,0.2)", "inset 0 0 20px rgba(16,185,129,0.1)"] }} transition={{ duration: 3, repeat: Infinity }} />
            {[...Array(15)].map((_, i) => (
              <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/40" animate={{ y: [0, -150, 0], x: [0, (i % 2 === 0 ? 30 : -30), 0], opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }} transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }} style={{ left: `${5 + i * 6}%`, bottom: 0 }} />
            ))}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
            <div className="relative z-10">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6">
                <Rocket className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Join hundreds of businesses already accepting stablecoin payments with GemRails</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                    Register Your Business
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all">Contact Sales</Link>
                </motion.div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-gray-800/50">
                {[{ icon: Shield, label: "Secure" }, { icon: Zap, label: "Fast" }, { icon: Lock, label: "Compliant" }].map((badge, i) => (
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

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">© {new Date().getFullYear()} GemRails. All rights reserved.</p>
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
