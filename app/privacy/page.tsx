"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft, Shield, Lock, Eye, Database, UserCheck,
  FileText, Mail, AlertCircle, CheckCircle, Globe, Server,
  Fingerprint, Key, ShieldCheck, Users, Clock, Zap,
  Sparkles, Info, Award, Target, Bell, Settings, Building2
} from "lucide-react"
import { useState, useRef } from "react"

// Interactive Data Flow Animation
const DataFlowAnimation = () => (
  <div className="relative w-full h-64 my-12 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Central Shield */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative"
          animate={{
            boxShadow: [
              "0 0 30px rgba(16,185,129,0.4)",
              "0 0 60px rgba(20,184,166,0.6)",
              "0 0 30px rgba(16,185,129,0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-16 h-16 text-white" />

          {/* Orbiting Data Icons */}
          {[
            { icon: Lock, angle: 0, color: "text-emerald-400" },
            { icon: Key, angle: 90, color: "text-teal-400" },
            { icon: Fingerprint, angle: 180, color: "text-cyan-400" },
            { icon: ShieldCheck, angle: 270, color: "text-green-400" }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                rotate: 360,
                x: Math.cos((item.angle * Math.PI) / 180) * 80,
                y: Math.sin((item.angle * Math.PI) / 180) * 80,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-gray-900 border-2 border-emerald-500/50 flex items-center justify-center"
                whileHover={{ scale: 1.2 }}
              >
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Pulse Rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 2, 2.5] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1
          }}
        >
          <div className="w-32 h-32 rounded-full border-2 border-emerald-500" />
        </motion.div>
      ))}
    </div>
  </div>
)

// Interactive Stats Card
const StatCard = ({ icon: Icon, value, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity" />
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 group-hover:border-emerald-500/50 transition-all">
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6 text-emerald-400" />
      </motion.div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  </motion.div>
)

// Enhanced Section with Hover Effects
const PrivacySection = ({
  icon: Icon,
  title,
  children,
  gradient = "from-blue-500 to-purple-500",
  delay = 0
}: any) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-12 relative"
    >
      <div className="flex items-start gap-4 mb-6">
        <motion.div
          className="relative"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-0.5`}>
            <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient}`}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : 1,
              opacity: isHovered ? [0.5, 0, 0.5] : 0
            }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          />
        </motion.div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <motion.div
            className={`h-1 bg-gradient-to-r ${gradient} rounded-full`}
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      <div className="pl-0 lg:pl-18 text-gray-300 leading-relaxed">
        {children}
      </div>
    </motion.div>
  )
}

// Interactive Feature Card
const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ y: -10, scale: 1.05 }}
    className="relative group cursor-pointer"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity" />
    <div className="relative bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 h-full">
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-6 h-6 text-emerald-400" />
      </motion.div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </motion.div>
)

export default function PrivacyPolicyPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.8])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0d10] relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
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

            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-8"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(16,185,129,0)",
                  "0 0 30px rgba(16,185,129,0.3)",
                  "0 0 0px rgba(16,185,129,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-5 h-5" />
              </motion.div>
              Your Privacy Matters
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              <motion.span
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Privacy Policy
              </motion.span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              We're committed to protecting your data with bank-grade security and transparency
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Last Updated: March 10, 2026</span>
              </motion.div>
              <span className="hidden sm:inline">•</span>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Effective: March 10, 2026</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <StatCard icon={Shield} value="256-bit" label="Encryption" delay={0.1} />
            <StatCard icon={Users} value="24/7" label="Monitoring" delay={0.2} />
            <StatCard icon={Lock} value="100%" label="Secure" delay={0.3} />
            <StatCard icon={Award} value="GDPR" label="Compliant" delay={0.4} />
          </div>

          {/* Data Flow Animation */}
          <DataFlowAnimation />
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Introduction with Interactive Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(20,184,166,0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.2) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Info className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Welcome</h2>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4 text-lg">
                  At GemRails, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital payment platform and services.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg">
                  By using GemRails, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 1 - Information We Collect */}
          <PrivacySection
            icon={Database}
            title="1. Information We Collect"
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          >
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <FeatureCard
                icon={Users}
                title="Personal Information"
                description="Business details, contact info, bank accounts, and KYC documents"
                delay={0.1}
              />
              <FeatureCard
                icon={Zap}
                title="Transaction Data"
                description="Payment amounts, wallet addresses, and settlement records"
                delay={0.2}
              />
              <FeatureCard
                icon={Server}
                title="Technical Information"
                description="IP addresses, device info, browser data, and usage analytics"
                delay={0.3}
              />
            </div>
          </PrivacySection>

          {/* Section 2 - How We Use Your Information */}
          <PrivacySection
            icon={Eye}
            title="2. How We Use Your Information"
            gradient="from-emerald-500 to-teal-500"
            delay={0.2}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Zap, text: "Process and settle your transactions" },
                { icon: Shield, text: "Verify your identity and prevent fraud" },
                { icon: FileText, text: "Comply with legal requirements" },
                { icon: Target, text: "Improve our services and user experience" },
                { icon: Bell, text: "Send important updates and notifications" },
                { icon: Users, text: "Provide customer support" },
                { icon: Settings, text: "Analyze platform usage" },
                { icon: Lock, text: "Detect and prevent security threats" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </PrivacySection>

          {/* Section 3 - Data Security (Enhanced) */}
          <PrivacySection
            icon={Lock}
            title="3. Data Security"
            gradient="from-teal-500 to-cyan-500"
            delay={0.3}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                {
                  icon: Shield,
                  title: "Encryption",
                  desc: "All data encrypted in transit (TLS/SSL) and at rest (AES-256)",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Lock,
                  title: "Access Controls",
                  desc: "Strict role-based access to sensitive data",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: Eye,
                  title: "24/7 Monitoring",
                  desc: "Continuous security monitoring and threat detection",
                  color: "from-emerald-500 to-teal-500"
                },
                {
                  icon: Award,
                  title: "Compliance",
                  desc: "Regular security audits and compliance checks",
                  color: "from-orange-500 to-red-500"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity`} />
                  <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                While we implement strong security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </motion.div>
          </PrivacySection>

          {/* Section 4 */}
          <PrivacySection
            icon={UserCheck}
            title="4. Sharing Your Information"
            gradient="from-emerald-500 to-green-500"
            delay={0.4}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Banking Partners", desc: "To process settlements and transfers to your bank account", icon: Building2 },
                { title: "Regulatory Authorities", desc: "When required by law or to comply with legal obligations", icon: FileText },
                { title: "Service Providers", desc: "Third-party vendors who help us operate our platform", icon: Server },
                { title: "Blockchain Networks", desc: "Transaction data recorded on public blockchains", icon: Globe }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-teal-500/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm italic text-gray-400 mt-6 text-center"
            >
              We do not sell your personal information to third parties for marketing purposes.
            </motion.p>
          </PrivacySection>

          {/* Section 5 - Your Rights */}
          <PrivacySection
            icon={CheckCircle}
            title="5. Your Rights"
            gradient="from-emerald-500 to-green-500"
            delay={0.5}
          >
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Access your personal data we hold",
                "Request correction of inaccurate data",
                "Request deletion of your data",
                "Object to processing of your data",
                "Request data portability",
                "Withdraw consent at any time",
                "Lodge a complaint with authorities"
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: 5, backgroundColor: "rgba(16, 185, 129, 0.05)" }}
                  className="flex items-start gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm mt-6 text-center text-gray-400"
            >
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@gemrails.com" className="text-emerald-400 hover:underline font-semibold">
                privacy@gemrails.com
              </a>
            </motion.p>
          </PrivacySection>

          {/* Section 6 - Cookies */}
          <PrivacySection
            icon={Globe}
            title="6. Cookies and Tracking"
            gradient="from-teal-500 to-emerald-500"
            delay={0.6}
          >
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6">
              <p className="text-gray-300 mb-4">We use cookies and similar technologies to:</p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Keep you signed in",
                  "Remember your preferences",
                  "Analyze platform usage",
                  "Improve security and prevent fraud"
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                You can control cookies through your browser settings, but disabling them may affect platform functionality.
              </p>
            </div>
          </PrivacySection>

          {/* Section 7 - Data Retention */}
          <PrivacySection
            icon={FileText}
            title="7. Data Retention"
            gradient="from-emerald-500 to-teal-500"
            delay={0.7}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6"
            >
              <p className="text-gray-300 leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and comply with legal obligations.
                Transaction records are kept for a minimum of <span className="text-emerald-400 font-semibold">7 years</span> as
                required by Nigerian financial regulations. After this period, data is securely deleted or anonymized.
              </p>
            </motion.div>
          </PrivacySection>

          {/* Section 8 - International Transfers */}
          <PrivacySection
            icon={Globe}
            title="8. International Transfers"
            gradient="from-teal-500 to-cyan-500"
            delay={0.8}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6"
            >
              <p className="text-gray-300 leading-relaxed">
                Your data is primarily stored and processed in Nigeria. If we transfer data internationally, we ensure
                appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
            </motion.div>
          </PrivacySection>

          {/* Section 9 - Children's Privacy */}
          <PrivacySection
            icon={AlertCircle}
            title="9. Children's Privacy"
            gradient="from-red-500 to-pink-500"
            delay={0.9}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
            >
              <p className="text-gray-300 leading-relaxed">
                GemRails is not intended for individuals under <span className="text-red-400 font-semibold">18 years of age</span>.
                We do not knowingly collect personal information from children. If you believe we have collected information from
                a child, please contact us immediately.
              </p>
            </motion.div>
          </PrivacySection>

          {/* Section 10 - Changes to Policy */}
          <PrivacySection
            icon={FileText}
            title="10. Changes to This Policy"
            gradient="from-emerald-500 to-green-500"
            delay={1.0}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6"
            >
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
                the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes
                constitutes acceptance of the updated policy.
              </p>
            </motion.div>
          </PrivacySection>

          {/* Contact Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mt-16"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl blur opacity-30" />
            <div className="relative bg-gray-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12">
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Mail className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white">11. Contact Us</h2>
                  <p className="text-gray-400">We're here to help with any privacy concerns</p>
                </div>
              </div>

              <p className="text-gray-300 mb-8 text-lg">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>

              <div className="grid lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <Mail className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-sm text-gray-400 mb-2">Email</p>
                  <a href="mailto:privacy@gemrails.com" className="text-white font-semibold hover:text-emerald-400 transition-colors break-words">
                    privacy@gemrails.com
                  </a>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <Globe className="w-8 h-8 text-blue-400 mb-3" />
                  <p className="text-sm text-gray-400 mb-2">Address</p>
                  <p className="text-white font-semibold">
                    Flat 2b, Higher-life Building, opposite first-bank Onile-Aro, ojoo, ibadan
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <Shield className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-sm text-gray-400 mb-2">Data Protection Officer</p>
                  <a href="mailto:dpo@gemrails.com" className="text-white font-semibold hover:text-emerald-400 transition-colors break-words">
                    dpo@gemrails.com
                  </a>
                </motion.div>
              </div>
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
              <Link href="/privacy" className="text-emerald-400 font-medium">Privacy Policy</Link>
              <Link href="/anti-money" className="hover:text-emerald-400 transition-colors">AML Policy</Link>
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
