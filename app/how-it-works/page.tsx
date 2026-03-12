"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeft, Building2, QrCode, Smartphone, Zap, ArrowRight,
  CheckCircle, Clock, Shield, TrendingUp, Banknote, Globe,
  Users, Sparkles, DollarSign
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#0a0d10] overflow-hidden">
      {/* Animated Background */}
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
              animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
              Simple & Fast
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              How It <motion.span 
                className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Works
              </motion.span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Start accepting stablecoin payments in 4 simple steps. No technical knowledge required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section - ADD YOUR VIDEO HERE */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-4 overflow-hidden">
              {/* Replace the src with your video path and poster with your image path */}
              <video 
                className="w-full rounded-2xl max-h-[500px] object-contain"
                controls
                poster="/video-poster.jpeg"
              >
                <source src="/videos/how-it-works.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-gray-400 mt-6"
          >
            Watch how easy it is to get started with GemRails
          </motion.p>
        </div>
      </section>

      {/* Steps Section - Enhanced */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              4 Simple Steps to <span className="text-emerald-400">Get Started</span>
            </h2>
            <p className="text-gray-400 text-lg">From registration to receiving payments in minutes</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 group-hover:border-emerald-500/50 transition-all">
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white">
                  1
                </div>
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <div className="text-emerald-400 text-sm font-bold mb-2">STEP 1</div>
                <h3 className="text-xl font-bold text-white mb-3">Register</h3>
                <p className="text-gray-400 text-sm mb-4">Sign up and verify your business in minutes</p>
                <ul className="space-y-2">
                  {["Quick online form", "Upload documents", "Get verified fast"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 group-hover:border-teal-500/50 transition-all">
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                  2
                </div>
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-0.5 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <div className="text-teal-400 text-sm font-bold mb-2">STEP 2</div>
                <h3 className="text-xl font-bold text-white mb-3">Get QR Code</h3>
                <p className="text-gray-400 text-sm mb-4">Receive your unique payment QR code</p>
                <ul className="space-y-2">
                  {["Instant generation", "Download & print", "Share digitally"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-teal-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 group-hover:border-cyan-500/50 transition-all">
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white">
                  3
                </div>
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <div className="text-cyan-400 text-sm font-bold mb-2">STEP 3</div>
                <h3 className="text-xl font-bold text-white mb-3">Customer Pays</h3>
                <p className="text-gray-400 text-sm mb-4">Customer scans and pays with Stablecoins</p>
                <ul className="space-y-2">
                  {["Scan QR code", "Pay with USDT/USDC", "Instant confirmation"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-cyan-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 group-hover:border-blue-500/50 transition-all">
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white">
                  4
                </div>
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <div className="text-blue-400 text-sm font-bold mb-2">STEP 4</div>
                <h3 className="text-xl font-bold text-white mb-3">Instant Settlement</h3>
                <p className="text-gray-400 text-sm mb-4">Receive Naira + ₦100 bonus instantly</p>
                <ul className="space-y-2">
                  {["Auto conversion", "Bank in seconds", "₦100 bonus"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose <span className="text-emerald-400">GemRails</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "Instant Settlement", desc: "Get your money in seconds, not days" },
              { icon: Banknote, title: "Earn Bonuses", desc: "₦100 bonus on every transaction" },
              { icon: Shield, title: "Bank-Grade Security", desc: "Military-grade encryption" },
              { icon: TrendingUp, title: "Real-Time Analytics", desc: "Track all transactions live" },
              { icon: Globe, title: "Accept Global Payments", desc: "Customers pay from anywhere" },
              { icon: Users, title: "No Chargebacks", desc: "Say goodbye to chargeback fraud" }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center py-16 px-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl overflow-hidden"
          >
            {/* Animated particles */}
            {[...Array(15)].map((_, i) => (
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
                  delay: i * 0.2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: 0
                }}
              />
            ))}
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Accepting Stablecoins?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of Nigerian businesses already using GemRails
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  Get Started Now
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

      <footer className="border-t border-gray-800 py-8 px-4">
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
