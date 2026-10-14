"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef } from "react"
import {
    ArrowLeft, Shield, AlertTriangle, Search, FileSearch,
    Users, Building2, Globe, Lock, FileText, Bell,
    ChevronDown, ChevronRight, Fingerprint, Scale, Cpu,
    ShieldAlert, UserCheck, Database, BookOpen, Gavel,
    Layers, Activity, BarChart2, Radar, Network, Mail,
    LucideIcon
} from "lucide-react"

// ---------- TYPES ----------

interface DualCol {
    label: string
    items: string[]
}

interface ActionItem {
    label: string
    desc: string
    icon: LucideIcon
}

interface DefenseLine {
    line: string
    label: string
    color: string
    gradient: string
    items: string[]
}

interface Section {
    id: string
    icon: LucideIcon
    title: string
    color: string
    gradient: string
    bg: string
    border: string
    text: string
    content: string
    type: "prose" | "bullets" | "risk-tiers" | "dual" | "actions" | "defense"
    bullets?: string[]
    dualCols?: DualCol[]
    actions?: ActionItem[]
    defenseLines?: DefenseLine[]
}

// ---------- DATA ----------

const sections: Section[] = [
    {
        id: "01",
        icon: BookOpen,
        title: "Introduction",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        content: `Gemrails ("the Company") is committed to the highest standards of Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), and Counter-Proliferation Financing (CPF) compliance. This policy establishes the framework by which Gemrails identifies, assesses, monitors, and mitigates financial crime risks associated with its products, services, and operations. This policy applies to all customers, merchants, partners, employees, contractors, and transactions conducted through the Gemrails platform.`,
        type: "prose"
    },
    {
        id: "02",
        icon: Scale,
        title: "Regulatory & Compliance Framework",
        color: "teal",
        gradient: "from-teal-500 to-cyan-500",
        bg: "bg-teal-500/10",
        border: "border-teal-500/30",
        text: "text-teal-400",
        content: `Gemrails operates in accordance with applicable local and international AML/CTF regulations and aligns with global best practices, including principles established by the Financial Action Task Force (FATF).`,
        bullets: [
            "Prevent the use of its platform for illicit financial activity",
            "Detect and investigate suspicious behavior",
            "Report relevant activities to competent authorities",
            "Maintain full cooperation with regulatory and law enforcement bodies"
        ],
        type: "bullets"
    },
    {
        id: "03",
        icon: BarChart2,
        title: "Risk-Based Approach",
        color: "cyan",
        gradient: "from-cyan-500 to-blue-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        content: `Gemrails applies a risk-based approach (RBA) to AML/CTF compliance, enabling proportionate controls based on assessed risk levels. Customers and transactions are categorized into Low, Medium, or High risk tiers. Enhanced Due Diligence (EDD) is applied where elevated risks are identified.`,
        bullets: [
            "Customer type and profile",
            "Nature of business activities",
            "Geographic exposure and jurisdictional risk",
            "Transaction behavior and volume",
            "Blockchain and wallet risk exposure"
        ],
        type: "risk-tiers"
    },
    {
        id: "04",
        icon: UserCheck,
        title: "Customer Due Diligence (CDD) & KYB",
        color: "blue",
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        content: `Gemrails conducts Customer Due Diligence (CDD) prior to establishing any business relationship and on an ongoing basis.`,
        dualCols: [
            {
                label: "Individuals",
                items: ["Full legal name", "Date of birth", "Government-issued identification"]
            },
            {
                label: "Corporate Entities (KYB)",
                items: [
                    "Certificate of incorporation",
                    "Registered business address",
                    "Nature of business activities",
                    "Directors, shareholders, authorized signatories"
                ]
            }
        ],
        type: "dual"
    },
    {
        id: "05",
        icon: Network,
        title: "Ultimate Beneficial Ownership (UBO)",
        color: "indigo",
        gradient: "from-indigo-500 to-violet-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/30",
        text: "text-indigo-400",
        content: `Gemrails identifies and verifies all Ultimate Beneficial Owners (UBOs) of corporate entities. A UBO is any natural person who owns or controls 25% or more of the entity, or exercises significant control over the entity.`,
        bullets: [
            "Ownership structure analysis",
            "Independent documentation review",
            "Sanctions and Politically Exposed Person (PEP) screening"
        ],
        type: "bullets"
    },
    {
        id: "06",
        icon: Database,
        title: "Source of Funds & Source of Wealth",
        color: "violet",
        gradient: "from-violet-500 to-purple-500",
        bg: "bg-violet-500/10",
        border: "border-violet-500/30",
        text: "text-violet-400",
        content: `Gemrails undertakes reasonable and risk-based measures to establish the legitimacy of funds and wealth. Enhanced scrutiny is applied to high-risk customers, high-value transactions, or inconsistent activity.`,
        bullets: [
            "Financial statements or bank records",
            "Commercial invoices and contracts",
            "Transaction histories"
        ],
        type: "bullets"
    },
    {
        id: "07",
        icon: Activity,
        title: "Transaction Monitoring",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        content: `Gemrails implements continuous, risk-based transaction monitoring across fiat and blockchain activities.`,
        bullets: [
            "Unusual or anomalous transaction patterns",
            "Structuring or smurfing behavior",
            "Rapid movement or layering of funds",
            "Exposure to high-risk counterparties or jurisdictions"
        ],
        type: "bullets"
    },
    {
        id: "08",
        icon: Radar,
        title: "High-Risk Transaction Handling (KYT)",
        color: "red",
        gradient: "from-red-500 to-orange-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        content: `Gemrails utilizes blockchain analytics and Know Your Transaction (KYT) tools to assess transaction risk in real time. Each transaction is assigned a quantitative risk score on a scale of 0 to 1. A transaction with a risk score exceeding 0.6 is classified as HIGH RISK.`,
        actions: [
            { label: "Return of Funds", desc: "Funds returned to originating wallet where permissible", icon: ArrowLeft },
            { label: "Asset Restriction", desc: "Assets restricted pending investigation", icon: Lock },
            { label: "Escalation & Reporting", desc: "Reported to regulatory or law enforcement authorities", icon: Bell },
            { label: "Account Controls", desc: "Accounts, wallets, or counterparties may be suspended", icon: ShieldAlert }
        ],
        type: "actions"
    },
    {
        id: "09",
        icon: Bell,
        title: "Merchant & Counterparty Notification",
        color: "orange",
        gradient: "from-orange-500 to-amber-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-400",
        content: `Where a transaction is classified as high-risk, Gemrails will notify the relevant merchant or counterparty without undue delay.`,
        bullets: [
            "Confirmation of transaction flagging",
            "Settlement status (withheld, delayed, or declined)",
            "Requests for additional information or documentation"
        ],
        type: "bullets"
    },
    {
        id: "10",
        icon: FileSearch,
        title: "Review Timeline & Case Management",
        color: "amber",
        gradient: "from-amber-500 to-yellow-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        content: `All high-risk transactions are subject to internal compliance review within a target timeframe of 24 to 72 hours.`,
        bullets: [
            "Clearance and release for settlement",
            "Return of funds",
            "Continued restriction pending further investigation",
            "Filing of Suspicious Activity Reports (SARs) or equivalent"
        ],
        type: "bullets"
    },
    {
        id: "11",
        icon: Search,
        title: "Sanctions & PEP Screening",
        color: "teal",
        gradient: "from-teal-500 to-emerald-500",
        bg: "bg-teal-500/10",
        border: "border-teal-500/30",
        text: "text-teal-400",
        content: `Gemrails conducts ongoing screening of customers, UBOs, and wallet addresses. Positive matches trigger Enhanced Due Diligence and may result in restriction or termination.`,
        bullets: [
            "International sanctions lists",
            "Politically Exposed Persons (PEP) databases",
            "Adverse media sources"
        ],
        type: "bullets"
    },
    {
        id: "12",
        icon: FileText,
        title: "Record Keeping & Data Retention",
        color: "cyan",
        gradient: "from-cyan-500 to-teal-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        content: `Gemrails maintains comprehensive records of customer identification data, transaction records, and compliance reviews. Records are retained in accordance with applicable legal and regulatory requirements and are made available to authorities upon lawful request.`,
        type: "prose"
    },
    {
        id: "13",
        icon: AlertTriangle,
        title: "Suspicious Activity Reporting (SAR)",
        color: "red",
        gradient: "from-red-500 to-pink-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        content: `Gemrails maintains procedures for the identification, escalation, and reporting of suspicious activity. Where suspicion is established, Gemrails will file reports with relevant competent authorities. Employees are required to promptly escalate any suspicious activity to the compliance function.`,
        type: "prose"
    },
    {
        id: "14",
        icon: Users,
        title: "Training & Awareness",
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        content: `Gemrails implements ongoing AML/CTF training programs to ensure employees understand their obligations.`,
        bullets: [
            "Identification of red flags",
            "Escalation procedures",
            "Regulatory requirements"
        ],
        type: "bullets"
    },
    {
        id: "15",
        icon: BookOpen,
        title: "Policy Governance & Review",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        content: `This policy is subject to periodic review and may be updated to reflect regulatory changes, evolving risks, and operational developments.`,
        type: "prose"
    },
    {
        id: "16",
        icon: Gavel,
        title: "Enforcement & Disciplinary Measures",
        color: "red",
        gradient: "from-red-500 to-orange-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        content: `Non-compliance with this policy may result in:`,
        bullets: [
            "Account restriction or termination",
            "Internal disciplinary action",
            "Regulatory reporting or legal action"
        ],
        type: "bullets"
    },
    {
        id: "17",
        icon: Layers,
        title: "Three Lines of Defense",
        color: "teal",
        gradient: "from-teal-500 to-emerald-500",
        bg: "bg-teal-500/10",
        border: "border-teal-500/30",
        text: "text-teal-400",
        content: `Gemrails adopts a Three Lines of Defense model to ensure effective risk management, accountability, and independent oversight of AML/CTF controls.`,
        defenseLines: [
            {
                line: "1st",
                label: "Business Operations",
                color: "emerald",
                gradient: "from-emerald-500 to-teal-500",
                items: [
                    "CDD and KYB execution",
                    "Accurate data collection and verification",
                    "Ongoing monitoring of customer activity",
                    "Identification and escalation of suspicious activities"
                ]
            },
            {
                line: "2nd",
                label: "Compliance & Risk Management",
                color: "teal",
                gradient: "from-teal-500 to-cyan-500",
                items: [
                    "AML/CTF policy development",
                    "Risk assessment frameworks",
                    "Transaction monitoring oversight",
                    "Regulatory reporting including SARs"
                ]
            },
            {
                line: "3rd",
                label: "Independent Audit",
                color: "cyan",
                gradient: "from-cyan-500 to-blue-500",
                items: [
                    "Independent testing of AML/CTF framework",
                    "Assessment of internal controls",
                    "Gap identification and remediation",
                    "Reporting to senior management and Board"
                ]
            }
        ],
        type: "defense"
    }
]

// ---------- COMPONENTS ----------

const RiskMeter = () => (
    <div className="mt-6 p-5 bg-gray-900/60 border border-gray-700 rounded-2xl">
        <p className="text-sm text-gray-400 mb-4 font-medium">Risk Classification Tiers</p>
        <div className="flex gap-3">
            {[
                { label: "LOW", color: "bg-emerald-500", w: "w-1/3" },
                { label: "MEDIUM", color: "bg-amber-500", w: "w-1/3" },
                { label: "HIGH", color: "bg-red-500", w: "w-1/3" }
            ].map((tier, i: number) => (
                <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    style={{ originX: 0 }}
                    className={`${tier.w} ${tier.color} rounded-lg p-3 text-center`}
                >
                    <span className="text-white text-xs font-bold tracking-widest">{tier.label}</span>
                </motion.div>
            ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Standard CDD</span>
            <span>Enhanced CDD</span>
            <span>EDD + Escalation</span>
        </div>
    </div>
)

const KYTScoreMeter = () => (
    <div className="mt-6 p-5 bg-gray-900/60 border border-gray-700 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-400 font-medium">KYT Risk Score Scale</p>
            <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                &gt; 0.6 = HIGH RISK
            </span>
        </div>
        <div className="relative h-5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="h-full rounded-full"
                style={{
                    background: "linear-gradient(to right, #10b981 0%, #10b981 40%, #f59e0b 40%, #f59e0b 60%, #ef4444 60%, #ef4444 100%)"
                }}
            />
            <motion.div
                initial={{ left: "0%" }}
                whileInView={{ left: "60%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{ position: "absolute" }}
            />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0</span>
            <span>0.6 threshold</span>
            <span>1.0</span>
        </div>
    </div>
)

interface AccordionSectionProps {
    section: Section
    index: number
}

const AccordionSection = ({ section, index }: AccordionSectionProps) => {
    const [open, setOpen] = useState(index < 2)

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mb-4"
        >
            {/* Header */}
            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.005 }}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${open
                        ? `${section.bg} ${section.border}`
                        : "bg-gray-900/40 border-gray-800 hover:border-gray-700"
                    }`}
            >
                {/* Number badge */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{section.id}</span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-3 flex-1 text-left">
                    <section.icon className={`w-5 h-5 ${section.text} flex-shrink-0`} />
                    <span className="text-white font-semibold text-base">{section.title}</span>
                </div>

                {/* Chevron */}
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
            </motion.button>

            {/* Body */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className={`mx-2 mt-1 p-6 rounded-b-2xl border-x border-b ${section.border} bg-gray-950/60`}>
                            <p className="text-gray-300 leading-relaxed mb-4">{section.content}</p>

                            {/* Bullets */}
                            {(section.type === "bullets") && section.bullets && (
                                <ul className="space-y-2 mt-3">
                                    {section.bullets.map((b: string, i: number) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
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

                            {/* Risk tiers */}
                            {section.type === "risk-tiers" && (
                                <>
                                    {section.bullets && (
                                        <ul className="space-y-2 mt-3 mb-2">
                                            {section.bullets.map((b: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${section.text}`} />
                                                    <span className="text-gray-300 text-sm">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <RiskMeter />
                                </>
                            )}

                            {/* Dual columns */}
                            {section.type === "dual" && section.dualCols && (
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    {section.dualCols.map((col: DualCol, i: number) => (
                                        <div key={i} className={`p-4 rounded-xl border ${section.border} ${section.bg}`}>
                                            <p className={`text-sm font-bold mb-3 ${section.text}`}>{col.label}</p>
                                            <ul className="space-y-2">
                                                {col.items.map((item: string, j: number) => (
                                                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${section.text}`} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions (KYT) */}
                            {section.type === "actions" && (
                                <>
                                    <KYTScoreMeter />
                                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                                        {section.actions?.map((a: ActionItem, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.07 }}
                                                className="flex gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                    <a.icon className="w-4 h-4 text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-semibold">{a.label}</p>
                                                    <p className="text-gray-400 text-xs mt-0.5">{a.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Three lines of defense */}
                            {section.type === "defense" && section.defenseLines && (
                                <div className="mt-4 space-y-4">
                                    {section.defenseLines.map((d: DefenseLine, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-4"
                                        >
                                            {/* Line indicator */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center flex-shrink-0`}>
                                                    <span className="text-white text-xs font-bold">{d.line}</span>
                                                </div>
                                                {i < 2 && <div className="w-0.5 flex-1 bg-gray-700 mt-2" />}
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <p className={`font-bold text-sm text-${d.color}-400 mb-2`}>{d.label}</p>
                                                <ul className="space-y-1.5">
                                                    {d.items.map((item: string, j: number) => (
                                                        <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                                                            <ChevronRight className={`w-4 h-4 mt-0.5 flex-shrink-0 text-${d.color}-400`} />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ---------- MAIN PAGE ----------

export default function AMLPolicyPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    return (
        <div ref={containerRef} className="min-h-screen bg-[#0a0d10] relative overflow-hidden">

            {/* Scroll progress bar */}
            <motion.div
                className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 z-[100]"
                style={{ width: progressWidth }}
            />

            {/* Ambient BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl"
                    animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
                    transition={{ duration: 22, repeat: Infinity }}
                    style={{ top: "5%", left: "-10%" }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl"
                    animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
                    transition={{ duration: 28, repeat: Infinity }}
                    style={{ bottom: "10%", right: "-5%" }}
                />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)",
                        backgroundSize: "60px 60px"
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
            <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6"
                            animate={{ boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 25px rgba(239,68,68,0.25)", "0 0 0px rgba(239,68,68,0)"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            Compliance & Regulatory
                        </motion.div>

                        {/* Title layout */}
                        <div className="lg:flex lg:items-end lg:justify-between gap-12 mb-8">
                            <div className="lg:max-w-2xl">
                                <h1 className="text-5xl sm:text-6xl font-black text-white leading-none mb-3">
                                    Anti-Money<br />
                                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                        Laundering
                                    </span>
                                    <br />
                                    <span className="text-3xl sm:text-4xl font-light text-gray-400 tracking-wide">& CTF Policy</span>
                                </h1>
                                <p className="text-gray-400 mt-4 text-base max-w-xl leading-relaxed">
                                    Gemrails&apos; framework for identifying, assessing, monitoring, and mitigating financial crime risks across all products, services, and operations.
                                </p>
                            </div>

                            {/* Stats vertical stack */}
                            <div className="flex lg:flex-col gap-4 mt-8 lg:mt-0 flex-wrap">
                                {[
                                    { label: "Policy Sections", value: "17", icon: FileText, color: "text-emerald-400" },
                                    { label: "Risk Score Threshold", value: "0.6", icon: Radar, color: "text-red-400" },
                                    { label: "Review Window", value: "24–72h", icon: Activity, color: "text-amber-400" },
                                    { label: "Data Retention", value: "7 yrs", icon: Database, color: "text-teal-400" },
                                ].map((stat, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                        whileHover={{ x: -4 }}
                                        className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3"
                                    >
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        <div>
                                            <p className="text-white font-bold leading-none">{stat.value}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Meta bar */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 border-t border-gray-800 pt-5">
                            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-emerald-500" />Effective: March 10, 2026</span>
                            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-teal-500" />FATF Aligned</span>
                            <span className="flex items-center gap-1.5"><Scale className="w-3.5 h-3.5 text-cyan-500" />Nigerian Regulatory Compliant</span>
                            <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5 text-blue-500" />KYC / KYB / KYT Enforced</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Sections */}
            <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">

                        {/* Sticky table of contents */}
                        <div className="hidden lg:block">
                            <div className="sticky top-24">
                                <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Contents</p>
                                <nav className="space-y-1">
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#section-${s.id}`}
                                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-gray-900/50"
                                        >
                                            <span className="text-xs font-mono text-gray-600">{s.id}</span>
                                            <span className="truncate">{s.title}</span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="lg:col-span-2">
                            {sections.map((section, i) => (
                                <div key={section.id} id={`section-${section.id}`}>
                                    <AccordionSection section={section} index={i} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
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
                                    <h2 className="text-2xl font-bold text-white">Compliance Contact</h2>
                                    <p className="text-gray-400 text-sm">Reach our compliance and DPO teams</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Compliance", email: "compliance@gemrails.com", value: undefined, icon: Shield, color: "text-emerald-400" },
                                    { label: "Data Protection Officer", email: "dpo@gemrails.com", value: undefined, icon: Lock, color: "text-teal-400" },
                                    { label: "Registered Address", email: undefined, value: "Flat 1b, Higher Life Building, Opposite First Bank, Onile Aro Junction, Ojoo, Ibadan", icon: Building2, color: "text-cyan-400" },
                                ].map((c, i: number) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4 }}
                                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-5"
                                    >
                                        <c.icon className={`w-6 h-6 ${c.color} mb-3`} />
                                        <p className="text-xs text-gray-400 mb-1">{c.label}</p>
                                        {c.email ? (
                                            <a href={`mailto:${c.email}`} className="text-white text-sm font-semibold hover:text-emerald-400 transition-colors break-words">
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
            <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left space-y-1">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} GemRails. All rights reserved.
                            </p>
                            <p className="text-gray-600 text-xs">
                                Flat 1b, Higher Life Building, Opposite First Bank, Onile Aro Junction, Ojoo, Ibadan
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                            <Link href="/anti-money" className="text-emerald-400 font-mediums">AML Policy</Link>
                            <Link href="/merchant-agreement" className="hover:text-emerald-400 transition-colors">Merchant Agreement</Link>
                            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
                            <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
