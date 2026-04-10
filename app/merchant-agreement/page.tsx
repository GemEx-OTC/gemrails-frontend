"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef } from "react"
import {
  ArrowLeft, Shield, FileText, Users, Building2, Globe,
  Lock, Bell, ChevronDown, ChevronRight, Scale, AlertTriangle,
  Handshake, Gavel, ShieldAlert, Ban, Clock, CheckCircle,
  XCircle, AlertCircle, ScrollText, Landmark, RefreshCw,
  UserX, Zap, ShieldCheck, BookOpen, Mail, LucideIcon
} from "lucide-react"

// ---------- TYPES ----------

interface BulletItem {
  text: string
  icon?: LucideIcon
}

interface ColGroup {
  label: string
  icon: LucideIcon
  color: string
  items: string[]
}

interface TimelineItem {
  label: string
  desc: string
  icon: LucideIcon
}

interface ProhibitedGroup {
  category: string
  icon: LucideIcon
  color: string
  border: string
  bg: string
  items: string[]
}

interface Section {
  id: string
  icon: LucideIcon
  title: string
  gradient: string
  bg: string
  border: string
  text: string
  accent: string
  content: string
  type: "prose" | "bullets" | "groups" | "timeline" | "prohibited" | "arbitration"
  bullets?: string[]
  groups?: ColGroup[]
  timeline?: TimelineItem[]
  prohibited?: ProhibitedGroup[]
  note?: string
}

// ---------- DATA ----------

const sections: Section[] = [
  {
    id: "01",
    icon: BookOpen,
    title: "Introduction",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    accent: "violet",
    content: `This Merchant Agreement ("Agreement") is entered into between Gemrails ("Gemrails", "we", "us", or "our") and the Merchant ("Merchant", "you", or "your"). By accessing or using Gemrails services, the Merchant agrees to be bound by this Agreement, including all applicable policies such as the AML/CTF Policy.`,
    type: "prose"
  },
  {
    id: "02",
    icon: Zap,
    title: "Scope of Services",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    accent: "blue",
    content: `Gemrails provides infrastructure that enables merchants to accept stablecoin payments and receive fiat settlement into designated bank accounts. Gemrails acts as a transaction processor and compliance intermediary.`,
    groups: [
      {
        label: "Acceptance",
        icon: CheckCircle,
        color: "text-emerald-400",
        items: ["Acceptance of supported stablecoins"]
      },
      {
        label: "Conversion",
        icon: RefreshCw,
        color: "text-blue-400",
        items: ["Conversion to fiat currency"]
      },
      {
        label: "Settlement",
        icon: Landmark,
        color: "text-violet-400",
        items: ["Settlement to merchant accounts"]
      }
    ],
    type: "groups"
  },
  {
    id: "03",
    icon: Users,
    title: "Merchant Obligations",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    accent: "emerald",
    content: `The Merchant agrees to uphold the following obligations at all times while using Gemrails services.`,
    bullets: [
      "Provide accurate and complete onboarding information",
      "Comply with all applicable laws and regulations",
      "Avoid engaging in prohibited or unlawful activities",
      "Cooperate with compliance reviews and information requests"
    ],
    note: "The Merchant shall not use Gemrails services for activities involving fraud, money laundering, terrorist financing, or any illegal conduct.",
    type: "bullets"
  },
  {
    id: "04",
    icon: Shield,
    title: "Compliance and AML/CTF Obligations",
    gradient: "from-teal-500 to-cyan-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    accent: "teal",
    content: `The Merchant acknowledges that Gemrails operates a strict AML/CTF compliance program. Failure to comply may result in restriction or termination of services.`,
    bullets: [
      "Conduct Customer Due Diligence (CDD) and ongoing monitoring",
      "Request additional documentation at any time",
      "Perform transaction monitoring using blockchain analytics tools"
    ],
    type: "bullets"
  },
  {
    id: "05",
    icon: Zap,
    title: "Transaction Monitoring and Risk Scoring",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    accent: "amber",
    content: `All transactions processed through Gemrails are subject to real-time monitoring and risk assessment. Each transaction is assigned a risk score on a scale of 0 to 1. Transactions exceeding a risk score threshold of 0.6 are classified as high-risk.`,
    type: "prose"
  },
  {
    id: "06",
    icon: ShieldAlert,
    title: "High-Risk Transactions and Settlement Controls",
    gradient: "from-red-500 to-rose-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    accent: "red",
    content: `Where a transaction is classified as high-risk, fiat settlement will be withheld and the transaction will be subject to compliance review.`,
    timeline: [
      { label: "Return Funds", desc: "Returned to originating wallet where permissible", icon: RefreshCw },
      { label: "Restrict Assets", desc: "Assets frozen pending investigation", icon: Lock },
      { label: "Delay Settlement", desc: "Settlement delayed or refused", icon: Clock },
      { label: "Suspend Account", desc: "Associated accounts suspended or terminated", icon: UserX }
    ],
    note: "Gemrails shall not be liable for delays or non-settlement arising from compliance actions.",
    type: "timeline"
  },
  {
    id: "07",
    icon: Bell,
    title: "Merchant Notification",
    gradient: "from-sky-500 to-blue-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-400",
    accent: "sky",
    content: `Gemrails will notify the Merchant when a transaction is flagged as high-risk. Gemrails may limit disclosure where required by law or regulatory obligations.`,
    bullets: [
      "Transaction status",
      "Settlement status",
      "Requests for additional information"
    ],
    type: "bullets"
  },
  {
    id: "08",
    icon: Clock,
    title: "Review and Resolution Timelines",
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    accent: "indigo",
    content: `Gemrails will conduct compliance reviews within a typical timeframe of 24–72 hours. Timelines may be extended where required by regulatory or law enforcement processes.`,
    bullets: [
      "Settlement release",
      "Refund to originating wallet",
      "Continued restriction",
      "Reporting to authorities"
    ],
    type: "bullets"
  },
  {
    id: "09",
    icon: ShieldCheck,
    title: "Right to Withhold, Suspend, or Terminate",
    gradient: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-400",
    accent: "orange",
    content: `Gemrails reserves the absolute right to take the following actions to comply with legal, regulatory, or risk management obligations.`,
    bullets: [
      "Withhold or delay transactions",
      "Suspend or restrict Merchant access",
      "Terminate this Agreement"
    ],
    type: "bullets"
  },
  {
    id: "10",
    icon: Scale,
    title: "Limitation of Liability",
    gradient: "from-slate-500 to-gray-600",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    accent: "slate",
    content: `Gemrails shall not be liable for any losses arising from the following circumstances.`,
    bullets: [
      "Compliance-related transaction delays or refusals",
      "Regulatory actions or requirements",
      "Actions taken in good faith to prevent financial crime"
    ],
    type: "bullets"
  },
  {
    id: "11",
    icon: Handshake,
    title: "Indemnification",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    accent: "purple",
    content: `The Merchant agrees to indemnify and hold Gemrails harmless from any claims, losses, or damages arising from:`,
    bullets: [
      "Breach of this Agreement",
      "Violation of applicable laws",
      "Fraudulent or unlawful activity"
    ],
    type: "bullets"
  },
  {
    id: "12",
    icon: Landmark,
    title: "Regulatory Cooperation",
    gradient: "from-teal-500 to-emerald-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    accent: "teal",
    content: `Gemrails may disclose information to regulators, law enforcement, or competent authorities as required by law. The Merchant agrees to cooperate with any such inquiries.`,
    type: "prose"
  },
  {
    id: "13",
    icon: RefreshCw,
    title: "Amendments",
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    accent: "cyan",
    content: `Gemrails reserves the right to amend this Agreement at any time. Continued use of the service constitutes acceptance of updated terms.`,
    type: "prose"
  },
  {
    id: "14",
    icon: Globe,
    title: "Governing Law",
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    accent: "blue",
    content: `This Agreement shall be governed by and construed in accordance with applicable laws of the relevant operating jurisdiction.`,
    type: "prose"
  },
  {
    id: "15",
    icon: CheckCircle,
    title: "Acceptance",
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    accent: "emerald",
    content: `By using Gemrails services, the Merchant confirms acceptance of this Agreement and all referenced policies.`,
    type: "prose"
  },
  {
    id: "16",
    icon: Ban,
    title: "Prohibited Businesses and Use Cases",
    gradient: "from-red-600 to-pink-600",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    accent: "red",
    content: `The Merchant shall not use Gemrails services in connection with any unlawful, fraudulent, or high-risk activities.`,
    prohibited: [
      {
        category: "Illegal Activities",
        icon: XCircle,
        color: "text-red-400",
        border: "border-red-500/30",
        bg: "bg-red-500/10",
        items: [
          "Any activity that violates applicable laws or regulations",
          "Money laundering, terrorist financing, or proliferation financing",
          "Fraud, scams, or deceptive practices"
        ]
      },
      {
        category: "Financial Crime",
        icon: AlertTriangle,
        color: "text-orange-400",
        border: "border-orange-500/30",
        bg: "bg-orange-500/10",
        items: [
          "Transactions involving sanctioned individuals or jurisdictions",
          "Use of mixers, tumblers, or obfuscation services",
          "Structuring or layering to evade detection"
        ]
      },
      {
        category: "Restricted Industries",
        icon: Lock,
        color: "text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        items: [
          "Unlicensed money transmission or payment services",
          "Unregulated investment schemes or securities offerings",
          "Gambling or gaming activities where prohibited by law"
        ]
      },
      {
        category: "Harmful Activities",
        icon: ShieldAlert,
        color: "text-pink-400",
        border: "border-pink-500/30",
        bg: "bg-pink-500/10",
        items: [
          "Human trafficking or exploitation",
          "Child exploitation or abuse-related content",
          "Sale of illegal drugs, controlled substances, or paraphernalia"
        ]
      },
      {
        category: "IP & Counterfeit",
        icon: Ban,
        color: "text-purple-400",
        border: "border-purple-500/30",
        bg: "bg-purple-500/10",
        items: [
          "Sale or distribution of counterfeit or pirated goods",
          "Infringement of intellectual property rights"
        ]
      },
      {
        category: "Other Restricted Uses",
        icon: AlertCircle,
        color: "text-slate-400",
        border: "border-slate-500/30",
        bg: "bg-slate-500/10",
        items: [
          "Shell or front businesses with no legitimate economic activity",
          "Activities exposing Gemrails to legal or reputational risk"
        ]
      }
    ],
    type: "prohibited"
  },
  {
    id: "17",
    icon: Gavel,
    title: "Dispute Resolution and Arbitration",
    gradient: "from-violet-500 to-indigo-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    accent: "violet",
    content: `In the event of any dispute, the parties agree to first attempt resolution amicably through good faith negotiations before initiating formal proceedings.`,
    type: "arbitration"
  },
  {
    id: "18",
    icon: ScrollText,
    title: "No Waiver and Severability",
    gradient: "from-gray-500 to-slate-600",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    text: "text-gray-400",
    accent: "gray",
    content: `Failure or delay by Gemrails in exercising any right shall not operate as a waiver. If any provision is determined to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
    type: "prose"
  }
]

// ---------- SUB-COMPONENTS ----------

const RiskScoreBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    <span className="text-red-400 text-xs font-bold tracking-wider">THRESHOLD: 0.6</span>
  </div>
)

const ArbitrationFlow = () => (
  <div className="mt-5 space-y-3">
    {[
      { step: "1", label: "Informal Resolution", desc: "Written notice to Gemrails — 14 days for internal review", color: "from-violet-500 to-purple-500" },
      { step: "2", label: "Binding Arbitration", desc: "Referred to recognized arbitration body if unresolved", color: "from-indigo-500 to-violet-500" },
      { step: "3", label: "Final Decision", desc: "Arbitrator's decision is final and binding on both parties", color: "from-blue-500 to-indigo-500" }
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex gap-4 items-start"
      >
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-xs font-bold">{item.step}</span>
        </div>
        {i < 2 && (
          <div className="absolute ml-4 mt-9 w-0.5 h-3 bg-gray-700" />
        )}
        <div>
          <p className="text-white font-semibold text-sm">{item.label}</p>
          <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
        </div>
      </motion.div>
    ))}
    <div className="mt-4 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
      <p className="text-xs text-gray-400">
        <span className="text-violet-400 font-semibold">Scope: </span>
        Transaction disputes · Settlement delays · Account restrictions · Compliance actions
      </p>
      <p className="text-xs text-gray-400 mt-2">
        <span className="text-violet-400 font-semibold">Exception: </span>
        Gemrails may seek injunctive or equitable relief in any competent court to protect its rights or prevent fraud.
      </p>
    </div>
  </div>
)

interface AccordionProps {
  section: Section
  index: number
}

const AccordionSection = ({ section, index }: AccordionProps) => {
  const [open, setOpen] = useState(index < 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.04 }}
      className="mb-3"
    >
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.003 }}
        className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
          open ? `${section.bg} ${section.border}` : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
        }`}
      >
        {/* Gradient ID pill */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <span className="text-white font-black text-xs">{section.id}</span>
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <section.icon className={`w-4 h-4 ${section.text} flex-shrink-0`} />
          <span className="text-white font-semibold text-sm truncate">{section.title}</span>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className={`mx-2 p-6 rounded-b-2xl border-x border-b ${section.border} bg-gray-950/70`}>
              <p className="text-gray-300 leading-relaxed text-sm mb-4">{section.content}</p>

              {/* Risk score callout for section 05 */}
              {section.id === "05" && (
                <div className="mt-4 flex items-center gap-3">
                  <RiskScoreBadge />
                  <span className="text-xs text-gray-500">Triggers compliance review & settlement hold</span>
                </div>
              )}

              {/* Standard bullets */}
              {section.type === "bullets" && section.bullets && (
                <ul className="space-y-2 mt-1">
                  {section.bullets.map((b: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${section.text}`} />
                      <span className="text-gray-300 text-sm">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* Note callout */}
              {section.note && (
                <div className={`mt-4 p-4 rounded-xl border ${section.border} ${section.bg} flex gap-3`}>
                  <AlertCircle className={`w-4 h-4 ${section.text} flex-shrink-0 mt-0.5`} />
                  <p className="text-gray-300 text-xs leading-relaxed">{section.note}</p>
                </div>
              )}

              {/* Groups (scope of services) */}
              {section.type === "groups" && section.groups && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {section.groups.map((g: ColGroup, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-900/60 border border-gray-800 rounded-xl text-center"
                    >
                      <g.icon className={`w-6 h-6 ${g.color}`} />
                      <p className="text-white text-xs font-semibold">{g.label}</p>
                      <p className="text-gray-500 text-xs">{g.items[0]}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Timeline (high-risk actions) */}
              {section.type === "timeline" && section.timeline && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {section.timeline.map((t: TimelineItem, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                        <t.icon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{t.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{t.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Prohibited grid */}
              {section.type === "prohibited" && section.prohibited && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {section.prohibited.map((p: ProhibitedGroup, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`p-4 rounded-xl border ${p.border} ${p.bg}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <p.icon className={`w-4 h-4 ${p.color}`} />
                        <p className={`text-xs font-bold ${p.color}`}>{p.category}</p>
                      </div>
                      <ul className="space-y-1.5">
                        {p.items.map((item: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                            <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Arbitration flow */}
              {section.type === "arbitration" && <ArbitrationFlow />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ---------- PAGE ----------

export default function MerchantAgreementPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0d10] relative overflow-hidden">

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 z-[100]"
        style={{ width: progressWidth }}
      />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ top: "-5%", left: "-15%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 80, 0] }}
          transition={{ duration: 30, repeat: Infinity }}
          style={{ bottom: "5%", right: "-10%" }}
        />
        {/* Diagonal lines texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, rgba(16,185,129,0.8) 0px, rgba(16,185,129,0.8) 1px, transparent 1px, transparent 12px)",
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-8"
              animate={{ boxShadow: ["0 0 0px rgba(139,92,246,0)", "0 0 28px rgba(139,92,246,0.3)", "0 0 0px rgba(139,92,246,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Handshake className="w-4 h-4" />
              Legal Agreement
            </motion.div>

            {/* Hero layout: big left title, right panel */}
            <div className="lg:grid lg:grid-cols-5 lg:gap-12 lg:items-start mb-10">

              {/* Left: Title */}
              <div className="lg:col-span-3">
                <h1 className="text-6xl sm:text-7xl font-black text-white leading-[0.9] tracking-tight mb-6">
                  <span className="block text-gray-600 text-2xl font-light tracking-widest uppercase mb-3">
                    GemRails
                  </span>
                  Merchant
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Agreement
                  </span>
                </h1>
                <p className="text-gray-400 text-base leading-relaxed max-w-lg">
                  This Agreement governs the relationship between Gemrails and any Merchant using our stablecoin payment infrastructure and fiat settlement services.
                </p>

                {/* Meta tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    { label: "18 Sections", icon: FileText },
                    { label: "Effective March 2026", icon: Clock },
                    { label: "Binding on Use", icon: CheckCircle },
                    { label: "Arbitration Clause", icon: Gavel },
                  ].map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-xs"
                    >
                      <tag.icon className="w-3 h-3" />
                      {tag.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Right: Key highlights card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 mt-10 lg:mt-0"
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur opacity-30" />
                  <div className="relative bg-gray-900 border border-emerald-500/30 rounded-2xl p-6">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Key Terms at a Glance</p>
                    {[
                      { label: "Risk threshold", value: "0.6 / 1.0", color: "text-red-400" },
                      { label: "Review window", value: "24 – 72 hrs", color: "text-amber-400" },
                      { label: "Informal dispute notice", value: "14 days", color: "text-violet-400" },
                      { label: "Settlement model", value: "Fiat to bank", color: "text-emerald-400" },
                      { label: "Governing law", value: "Applicable jurisdiction", color: "text-blue-400" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                        <span className="text-gray-400 text-xs">{item.label}</span>
                        <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">

            {/* Sticky TOC */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Sections</p>
                <nav className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#section-${s.id}`}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-gray-900/60 group"
                    >
                      <span className="font-mono text-gray-700 group-hover:text-gray-500 transition-colors">{s.id}</span>
                      <span className="truncate">{s.title}</span>
                    </a>
                  ))}
                </nav>

                {/* Small acceptance reminder */}
                <div className="mt-6 p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-violet-400 font-semibold block mb-1">By using Gemrails</span>
                    you confirm acceptance of this Agreement and all referenced policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Accordion list */}
            <div className="lg:col-span-2">
              {sections.map((section, i) => (
                <div key={section.id} id={`section-${section.id}`}>
                  <AccordionSection section={section} index={i} />
                </div>
              ))}
            </div>
          </div>

          {/* Contact / CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-20" />
            <div className="relative bg-gray-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Questions about this Agreement?</h2>
                  <p className="text-gray-400 text-sm">Our legal and compliance teams are here to help</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Legal Enquiries", email: "legal@gemrails.com", value: undefined, icon: Scale, color: "text-violet-400" },
                  { label: "Compliance", email: "compliance@gemrails.com", value: undefined, icon: Shield, color: "text-purple-400" },
                  { label: "Registered Address", email: undefined, value: "Flat 2b, Higher-life Building, Onile-Aro, Ojoo, Ibadan", icon: Building2, color: "text-pink-400" },
                ].map((c, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
                  >
                    <c.icon className={`w-6 h-6 ${c.color} mb-3`} />
                    <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                    {c.email ? (
                      <a href={`mailto:${c.email}`} className="text-white text-sm font-semibold hover:text-violet-400 transition-colors break-words">
                        {c.email}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-semibold">{c.value}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} GemRails. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="/anti-money" className="hover:text-emerald-400 transition-colors">AML Policy</Link>
            <Link href="/merchant-agreement" className="text-emerald-400 font-medium">Merchant Agreement</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
