"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, MessageCircle, Mail, Phone, QrCode, CreditCard, Shield, Clock } from "lucide-react"

const faqs = [
  { category: "Getting Started", icon: QrCode, questions: [
    { q: "How do I start accepting payments?", a: "Simply display your unique QR code at your checkout counter. Customers scan it with their phone, enter the amount, and pay with USDT or USDC. You receive Naira instantly!" },
    { q: "What is the minimum payment amount?", a: "The minimum payment amount is ₦5,000. This ensures efficient processing and settlement for both you and your customers." },
    { q: "How do I download my QR code?", a: "Go to the 'QR Code' section in your dashboard. You can download it as PNG, print it, or share the payment link directly." }
  ]},
  { category: "Payments & Settlement", icon: CreditCard, questions: [
    { q: "How fast do I receive my money?", a: "Settlements are instant! Once the customer's crypto payment is confirmed on the blockchain (usually 1-3 minutes), the Naira equivalent is sent to your bank account immediately." },
    { q: "What is the ₦100 merchant incentive?", a: "For every successful payment, you receive a ₦100 bonus on top of the original payment amount. This is our way of rewarding merchants for accepting crypto payments." },
    { q: "What cryptocurrencies do you support?", a: "We currently support USDT (Tether) and USDC (USD Coin) on TRC20, BSC, and ERC20 networks. These are stable coins pegged to the US Dollar." }
  ]},
  { category: "Security & Verification", icon: Shield, questions: [
    { q: "Is GemExRails safe to use?", a: "Yes! GemExRails is powered by GemEx, a licensed OTC trading platform. We use bank-grade security, and all merchants are verified for compliance." },
    { q: "How do I verify my business?", a: "During signup, you'll provide your business details and bank account. Our team verifies this information within 24 hours. You can start accepting payments once verified." }
  ]},
  { category: "Fees & Pricing", icon: Clock, questions: [
    { q: "What are the fees?", a: "There are no fees deducted from your settlement! Customers pay a small ₦1,500 processing fee, from which you receive ₦100 as an incentive. You always receive the full payment amount plus the bonus." },
    { q: "Are there any hidden charges?", a: "No hidden charges. What you see is what you get. The customer pays the processing fee, and you receive the full amount plus your ₦100 incentive." }
  ]}
]

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>("Getting Started")
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl md:text-3xl font-bold text-white">Help Center</h1><p className="text-gray-400 mt-1">Find answers to common questions</p></div>

      <div className="grid sm:grid-cols-3 gap-4">
        <motion.a href="mailto:support@gemrails.ng" whileHover={{ scale: 1.02 }} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 hover:border-emerald-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Mail className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-white font-medium">Email Support</p><p className="text-sm text-gray-500">support@gemrails.ng</p></div>
        </motion.a>
        <motion.a href="tel:+2348012345678" whileHover={{ scale: 1.02 }} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 hover:border-emerald-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-white font-medium">Phone Support</p><p className="text-sm text-gray-500">+234 801 234 5678</p></div>
        </motion.a>
        <motion.a href="https://wa.me/2348012345678" target="_blank" whileHover={{ scale: 1.02 }} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-3 hover:border-emerald-500/50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-white font-medium">WhatsApp</p><p className="text-sm text-gray-500">Chat with us</p></div>
        </motion.a>
      </div>

      <div className="space-y-4">
        {faqs.map((category) => {
          const Icon = category.icon
          const isOpen = openCategory === category.category
          return (
            <motion.div key={category.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <button onClick={() => setOpenCategory(isOpen ? null : category.category)} className="w-full p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Icon className="w-5 h-5 text-emerald-400" /></div><span className="text-white font-medium">{category.category}</span></div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="w-5 h-5 text-gray-500" /></motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-800">
                    {category.questions.map((item, idx) => {
                      const isQuestionOpen = openQuestion === `${category.category}-${idx}`
                      return (
                        <div key={idx} className="border-b border-gray-800 last:border-b-0">
                          <button onClick={() => setOpenQuestion(isQuestionOpen ? null : `${category.category}-${idx}`)} className="w-full p-4 flex items-start justify-between text-left hover:bg-gray-800/20 transition-colors">
                            <div className="flex items-start gap-3"><HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" /><span className="text-gray-300">{item.q}</span></div>
                            <motion.div animate={{ rotate: isQuestionOpen ? 180 : 0 }} className="flex-shrink-0 ml-2"><ChevronDown className="w-4 h-4 text-gray-500" /></motion.div>
                          </button>
                          <AnimatePresence>
                            {isQuestionOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4"><div className="pl-8 text-gray-400 text-sm leading-relaxed">{item.a}</div></motion.div>}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl text-center">
        <HelpCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Still need help?</h3>
        <p className="text-gray-400 mb-4">Our support team is available 24/7 to assist you.</p>
        <motion.a href="mailto:support@gemrails.ng" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="gemrails-button inline-flex items-center gap-2"><Mail className="w-5 h-5" />Contact Support</motion.a>
      </div>
    </motion.div>
  )
}
