"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { 
  ArrowLeft, FileText, Shield, Scale, AlertCircle, 
  CheckCircle, Building2, Globe, Lock, Mail, Eye, Download,
  Clock, Users, Zap, BookOpen, ChevronRight, Sparkles
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import domtoimage from "dom-to-image-more"

// Floating Legal Icons Animation
const FloatingLegalIcon = ({ icon: Icon, delay, duration, left, top }: any) => (
  <motion.div
    className="absolute opacity-10"
    style={{ left, top }}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 10, 0],
      opacity: [0.1, 0.2, 0.1]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Icon className="w-12 h-12 text-emerald-400" />
  </motion.div>
)

// Progress Bar Component
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (window.scrollY / scrollHeight) * 100
      setProgress(scrolled)
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-1 bg-gray-800 z-50"
      initial={{ scaleX: 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  )
}

// Enhanced Table of Contents Component
const TableOfContents = ({ sections, activeSection }: { sections: string[]; activeSection: string }) => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24 hidden lg:block"
    >
      <motion.div
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-2xl"
        animate={{
          boxShadow: isSticky 
            ? "0 20px 60px rgba(16, 185, 129, 0.15)" 
            : "0 10px 30px rgba(0, 0, 0, 0.3)"
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-sm font-bold text-white">Quick Navigation</h3>
            <p className="text-xs text-gray-500">Jump to section</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section, idx) => {
            const isActive = activeSection === `section-${idx + 1}`
            return (
              <motion.a
                key={idx}
                href={`#section-${idx + 1}`}
                className={`group block text-sm py-2.5 px-3 rounded-xl transition-all relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500"
                    layoutId="activeSection"
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`text-xs ${isActive ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {section}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </div>
              </motion.a>
            )
          })}
        </nav>

        {/* Reading Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-6 border-t border-gray-800 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>~15 min read</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Last updated: Mar 10, 2026</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Enhanced Section Component with animations
const Section = ({ 
  id, 
  number, 
  title, 
  children, 
  icon: Icon,
  highlight = false
}: { 
  id: string; 
  number: number; 
  title: string; 
  children: React.ReactNode;
  icon?: any;
  highlight?: boolean;
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.98])

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ opacity, scale }}
      className="mb-16 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`relative ${highlight ? 'p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20' : ''}`}
      >
        {/* Section Header */}
        <div className="flex items-start gap-4 mb-8">
          {Icon && (
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5">
                <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-500/30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          )}
          <div className="flex-1">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-bold">SECTION {number}</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="pl-0 lg:pl-18 text-gray-300 leading-relaxed space-y-4">
          {children}
        </div>
      </motion.div>
    </motion.section>
  )
}

// Enhanced Alert Box Component
const AlertBox = ({ 
  type = "info", 
  title, 
  children 
}: { 
  type?: "info" | "warning" | "critical" | "success";
  title: string;
  children: React.ReactNode;
}) => {
  const configs = {
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: AlertCircle,
      iconColor: "text-blue-400",
      titleColor: "text-blue-400"
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: AlertCircle,
      iconColor: "text-yellow-400",
      titleColor: "text-yellow-400"
    },
    critical: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: Shield,
      iconColor: "text-red-400",
      titleColor: "text-red-400"
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: CheckCircle,
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-400"
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, x: 5 }}
      className={`${config.bg} ${config.border} border-2 rounded-2xl p-5 flex gap-4 relative overflow-hidden`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(16,185,129,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      </motion.div>
      <div className="flex-1 relative z-10">
        <p className={`font-bold ${config.titleColor} mb-2 text-sm uppercase tracking-wide`}>{title}</p>
        <div className="text-gray-300 text-sm space-y-2">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

// Definition Card Component
const DefinitionCard = ({ term, definition, delay = 0 }: { term: string; definition: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 hover:border-emerald-500/50 transition-all cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 rounded-xl transition-all" />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-2">
        <p className="font-bold text-emerald-400 text-lg">{term}</p>
        <motion.div
          className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </motion.div>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{definition}</p>
    </div>
  </motion.div>
)

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("section-1")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const sections = [
    "Overview",
    "Merchant–Customer Relationship",
    "Terms of Use",
    "General Use of the Platform",
    "Definitions",
    "Gemrails Services",
    "Account Use and Termination",
    "Dispute Resolution",
    "General Provisions",
    "Appendix A: Service Jurisdiction",
    "Appendix B: Electronic Signature Consent"
  ]

  // Download PDF function - Simple and reliable approach
  const handleDownloadPDF = () => {
    if (isGeneratingPDF) return
    
    setIsGeneratingPDF(true)
    
    try {
      // Create a new window with just the terms content
      const printWindow = window.open('', '_blank')
      
      if (!printWindow) {
        alert('Please allow pop-ups to download the PDF')
        setIsGeneratingPDF(false)
        return
      }
      
      // Get the terms content
      const termsContent = contentRef.current?.innerHTML || ''
      
      // Create a clean HTML document for printing
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GemRails Terms of Use</title>
            <style>
              @page {
                margin: 2cm;
                size: A4;
              }
              
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #000;
                background: #fff;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              
              h1, h2, h3 {
                color: #000;
                page-break-after: avoid;
              }
              
              h1 {
                font-size: 28px;
                margin-bottom: 10px;
                border-bottom: 3px solid #10b981;
                padding-bottom: 10px;
              }
              
              h2 {
                font-size: 20px;
                margin-top: 30px;
                margin-bottom: 15px;
                color: #10b981;
              }
              
              h3 {
                font-size: 16px;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              
              p {
                margin-bottom: 12px;
                text-align: justify;
              }
              
              ul, ol {
                margin-bottom: 12px;
                padding-left: 25px;
              }
              
              li {
                margin-bottom: 6px;
              }
              
              section {
                page-break-inside: avoid;
                margin-bottom: 25px;
              }
              
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #10b981;
                color: white;
                border-radius: 8px;
              }
              
              .header h1 {
                color: white;
                border: none;
                margin: 0;
              }
              
              .meta {
                text-align: center;
                margin-bottom: 30px;
                color: #666;
                font-size: 14px;
              }
              
              .section-number {
                color: #10b981;
                font-weight: bold;
              }
              
              .alert {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 15px 0;
              }
              
              .contact-box {
                background: #f0fdf4;
                border: 2px solid #10b981;
                padding: 20px;
                margin-top: 30px;
                border-radius: 8px;
              }
              
              @media print {
                body {
                  padding: 0;
                }
                
                .no-print {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>TERMS OF USE</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">GemRails Ltd.</p>
            </div>
            
            <div class="meta">
              <p><strong>Effective Date:</strong> March 10, 2026</p>
              <p><strong>Company:</strong> Gemrails Ltd.</p>
            </div>
            
            <section>
              <h2><span class="section-number">1.</span> Overview</h2>
              <p>Gemrails is a digital checkout infrastructure platform that enables businesses to accept, process, and settle payments using supported digital assets, including stablecoins.</p>
              <p>The Gemrails platform may include application programming interfaces (APIs), merchant dashboards, payment routing systems, blockchain transaction monitoring tools, and settlement infrastructure that facilitate the movement of digital assets between merchants and their customers.</p>
              <p>These Terms of Use ("Terms") govern access to and use of the Gemrails platform and services by merchants and authorized users.</p>
              <div class="alert">
                <strong>Important Notice:</strong> By accessing or using the Gemrails platform, integrating Gemrails APIs, or creating a merchant account, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Gemrails platform.
              </div>
            </section>
            
            <section>
              <h2><span class="section-number">2.</span> Merchant–Customer Relationship (Critical Clause)</h2>
              <p>Gemrails provides payment infrastructure services exclusively to approved merchants. Gemrails does not establish a direct contractual relationship with end users who make payments through merchants using the Gemrails platform.</p>
              <p><strong>End users making payments to merchants through Gemrails are customers of the merchant and not customers of Gemrails.</strong></p>
              <p><strong>Merchants are solely responsible for:</strong></p>
              <ul>
                <li>Customer onboarding and identification</li>
                <li>Compliance with applicable KYC and AML obligations</li>
                <li>Customer disputes and refunds</li>
                <li>The legality of goods and services offered to customers</li>
                <li>Any obligations owed to their customers</li>
              </ul>
            </section>
            
            <section>
              <h2><span class="section-number">3.</span> Terms of Use</h2>
              <p>These Terms govern the use of the Gemrails platform and related services provided by Gemrails Technologies Ltd.</p>
              <p><strong>By using the platform, merchants represent and warrant that:</strong></p>
              <ul>
                <li>They are legally registered businesses or organizations</li>
                <li>They have the authority to enter into this agreement</li>
                <li>The information provided during onboarding is accurate and complete</li>
                <li>Their use of the Gemrails platform complies with applicable laws and regulations</li>
              </ul>
            </section>
            
            <section>
              <h2><span class="section-number">4.</span> General Use of the Platform</h2>
              <p>Merchants may use the Gemrails platform solely for lawful business purposes and in accordance with these Terms.</p>
              <p><strong>Merchants agree not to use the platform for activities that may involve:</strong></p>
              <ul>
                <li>Fraudulent or deceptive conduct</li>
                <li>Money laundering or terrorist financing</li>
                <li>Transactions involving sanctioned entities or jurisdictions</li>
                <li>Sale or distribution of illegal goods or services</li>
                <li>Any activity that violates applicable financial regulations</li>
              </ul>
            </section>
            
            <section>
              <h2><span class="section-number">5.</span> Definitions</h2>
              <p>For the purposes of these Terms:</p>
              <p><strong>"Gemrails"</strong> refers to Gemrails Technologies Ltd., its affiliates, subsidiaries, and the technology platform it operates.</p>
              <p><strong>"Platform"</strong> refers to the APIs, dashboards, payment infrastructure, settlement systems, and other technology services provided by Gemrails.</p>
              <p><strong>"Merchant"</strong> refers to any business or organization that accesses or integrates the Gemrails platform to accept or process digital asset payments.</p>
              <p><strong>"Digital Assets"</strong> refers to blockchain-based tokens, including stablecoins and other supported cryptocurrencies processed through the platform.</p>
              <p><strong>"Settlement"</strong> refers to the transfer or conversion of digital assets into fiat currency or other supported assets through Gemrails or its liquidity partners.</p>
            </section>
            
            <div class="contact-box">
              <h2 style="margin-top: 0;">Contact Information</h2>
              <p>For questions, compliance matters, or legal inquiries relating to these Terms:</p>
              <p><strong>Gemrails Ltd.</strong><br>
              Email: compliance@gemrails.com<br>
              Address: Flat 2b, Higher-life Building, opposite first-bank Onile-Aro, ojoo, ibadan</p>
            </div>
            
            <script>
              // Auto-print when page loads
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
              
              // Close window after printing or canceling
              window.onafterprint = function() {
                window.close();
              }
            </script>
          </body>
        </html>
      `)
      
      printWindow.document.close()
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Error: ' + (error as Error).message)
    } finally {
      setTimeout(() => setIsGeneratingPDF(false), 1000)
    }
  }

  // Email copy function
  const handleEmailCopy = () => {
    const subject = encodeURIComponent("GemRails Terms of Use")
    const body = encodeURIComponent("Please find the GemRails Terms of Use at: " + window.location.href)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((_, idx) => 
        document.getElementById(`section-${idx + 1}`)
      )
      
      const currentSection = sectionElements.findIndex(el => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 200 && rect.bottom >= 200
      })

      if (currentSection !== -1) {
        setActiveSection(`section-${currentSection + 1}`)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0d10] relative">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-content {
            background: white !important;
            border: none !important;
            padding: 20px !important;
          }
          
          .print-content * {
            color: black !important;
          }
          
          .print-content h1, .print-content h2, .print-content h3 {
            color: black !important;
            page-break-after: avoid;
          }
          
          .print-content section {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }
          
          @page {
            margin: 2cm;
          }
        }
      `}</style>

      {/* Reading Progress Bar */}
      <div className="no-print">
        <ReadingProgress />
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none no-print">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ bottom: "10%", right: "5%" }}
        />

        {/* Floating Legal Icons */}
        <FloatingLegalIcon icon={Scale} delay={0} duration={8} left="10%" top="20%" />
        <FloatingLegalIcon icon={Shield} delay={2} duration={10} left="85%" top="30%" />
        <FloatingLegalIcon icon={FileText} delay={4} duration={9} left="15%" top="70%" />
        <FloatingLegalIcon icon={Lock} delay={6} duration={11} left="80%" top="60%" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/80 backdrop-blur-lg border-b border-gray-800/50 no-print">
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
            
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-8"
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
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Scale className="w-5 h-5" />
              </motion.div>
              Legal Document
            </motion.div>

            {/* Main Title with Gradient Animation */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="bg-gradient-to-r from-white via-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Terms of Use
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Gemrails Terms of Use
            </motion.p>

            {/* Info Cards */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Effective: March 10, 2026</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Gemrails Ltd.</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">For Merchants</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4 no-print"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmailCopy}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-white font-semibold hover:border-emerald-500 hover:bg-emerald-500/5 transition-all"
              >
                <Mail className="w-4 h-4" />
                Email Copy
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1 no-print">
              <TableOfContents sections={sections} activeSection={activeSection} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div ref={contentRef} className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-8 sm:p-12 print-content">
                
                {/* Section 1: Overview */}
                <Section id="section-1" number={1} title="Overview" icon={FileText}>
                  <p>
                    Gemrails is a digital checkout infrastructure platform that enables businesses to accept, process, and settle payments using supported digital assets, including stablecoins.
                  </p>
                  <p>
                    The Gemrails platform may include application programming interfaces (APIs), merchant dashboards, payment routing systems, blockchain transaction monitoring tools, and settlement infrastructure that facilitate the movement of digital assets between merchants and their customers.
                  </p>
                  <p>
                    These Terms of Use ("Terms") govern access to and use of the Gemrails platform and services by merchants and authorized users.
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-emerald-400 mb-1">Important Notice</p>
                      <p className="text-gray-300">
                        By accessing or using the Gemrails platform, integrating Gemrails APIs, or creating a merchant account, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Gemrails platform.
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Section 2: Merchant–Customer Relationship */}
                <Section id="section-2" number={2} title="Merchant–Customer Relationship (Critical Clause)" icon={Building2}>
                  <p>
                    Gemrails provides payment infrastructure services exclusively to approved merchants. Gemrails does not establish a direct contractual relationship with end users who make payments through merchants using the Gemrails platform.
                  </p>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-400 mb-2">Critical Clause</p>
                      <p className="text-gray-300 mb-2">
                        End users making payments to merchants through Gemrails are customers of the merchant and not customers of Gemrails.
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-white">Merchants are solely responsible for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Customer onboarding and identification</li>
                    <li>Compliance with applicable KYC and AML obligations</li>
                    <li>Customer disputes and refunds</li>
                    <li>The legality of goods and services offered to customers</li>
                    <li>Any obligations owed to their customers</li>
                  </ul>
                  <p>
                    Gemrails shall not be responsible for verifying the identity of end users transacting with merchants unless otherwise required by applicable law.
                  </p>
                </Section>

                {/* Section 3: Terms of Use */}
                <Section id="section-3" number={3} title="Terms of Use" icon={CheckCircle}>
                  <p>
                    These Terms govern the use of the Gemrails platform and related services provided by Gemrails Technologies Ltd.
                  </p>
                  <p className="font-semibold text-white">By using the platform, merchants represent and warrant that:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>They are legally registered businesses or organizations</li>
                    <li>They have the authority to enter into this agreement</li>
                    <li>The information provided during onboarding is accurate and complete</li>
                    <li>Their use of the Gemrails platform complies with applicable laws and regulations</li>
                  </ul>
                  <p>
                    Gemrails reserves the right to approve, reject, suspend, or terminate merchant access to the platform at its sole discretion, including where use of the platform may present regulatory, legal, financial, or reputational risks.
                  </p>
                </Section>

                {/* Section 4: General Use of the Platform */}
                <Section id="section-4" number={4} title="General Use of the Platform" icon={Shield}>
                  <p>
                    Merchants may use the Gemrails platform solely for lawful business purposes and in accordance with these Terms.
                  </p>
                  <p className="font-semibold text-white">Merchants agree not to use the platform for activities that may involve:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fraudulent or deceptive conduct</li>
                    <li>Money laundering or terrorist financing</li>
                    <li>Transactions involving sanctioned entities or jurisdictions</li>
                    <li>Sale or distribution of illegal goods or services</li>
                    <li>Any activity that violates applicable financial regulations</li>
                  </ul>
                  <p>
                    Gemrails may monitor platform activity and blockchain transactions using internal risk monitoring systems and third-party analytics tools.
                  </p>
                  <p>
                    Where potentially suspicious activity is detected, Gemrails reserves the right to suspend services, delay settlements, request additional information, or take other actions necessary to comply with legal or regulatory obligations.
                  </p>
                </Section>

                {/* Section 5: Definitions */}
                <Section id="section-5" number={5} title="Definitions" icon={FileText}>
                  <p>For the purposes of these Terms:</p>
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Gemrails"</p>
                      <p className="text-sm">refers to Gemrails Technologies Ltd., its affiliates, subsidiaries, and the technology platform it operates.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Platform"</p>
                      <p className="text-sm">refers to the APIs, dashboards, payment infrastructure, settlement systems, and other technology services provided by Gemrails.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Merchant"</p>
                      <p className="text-sm">refers to any business or organization that accesses or integrates the Gemrails platform to accept or process digital asset payments.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Customer"</p>
                      <p className="text-sm">refers to the end user making a payment to a merchant through the Gemrails infrastructure.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Digital Assets"</p>
                      <p className="text-sm">refers to blockchain-based tokens, including stablecoins and other supported cryptocurrencies processed through the platform.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Stablecoins"</p>
                      <p className="text-sm">refers to digital assets designed to maintain a stable value by being pegged to or backed by fiat currency or other assets.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"Settlement"</p>
                      <p className="text-sm">refers to the transfer or conversion of digital assets into fiat currency or other supported assets through Gemrails or its liquidity partners.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="font-semibold text-emerald-400 mb-1">"T+0 Settlement"</p>
                      <p className="text-sm">refers to same-day settlement of transactions, where payment processing and settlement occur within the same business day following confirmation of the transaction on the blockchain.</p>
                    </div>
                  </div>
                </Section>

                {/* Section 6: Gemrails Services */}
                <Section id="section-6" number={6} title="Gemrails Services" icon={Building2}>
                  <p>
                    Gemrails provides digital asset payment infrastructure designed to enable businesses to accept and process blockchain-based payments efficiently and securely.
                  </p>
                  <p className="font-semibold text-white">Gemrails services may include, but are not limited to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Infrastructure that enables merchants to accept payments in supported digital assets, including stablecoins</li>
                    <li>Payment routing and transaction processing through blockchain networks</li>
                    <li>Merchant dashboards and tools for monitoring transactions and payment activity</li>
                    <li>Application Programming Interfaces (APIs) for integration</li>
                    <li>Transaction monitoring and risk screening using blockchain analytics tools</li>
                    <li>Settlement services through liquidity partners or supported settlement rails</li>
                    <li>Infrastructure that supports same-day settlement (T+0 Settlement) where applicable</li>
                  </ul>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">
                      Gemrails operates as a technology infrastructure provider and does not function as a bank, deposit-taking institution, or licensed financial institution unless otherwise explicitly stated.
                    </p>
                  </div>
                </Section>

                {/* Section 7: Account Use and Termination */}
                <Section id="section-7" number={7} title="Account Use and Termination" icon={Lock}>
                  <h3 className="text-lg font-semibold text-white mb-3">Account Registration</h3>
                  <p>
                    To access certain features of the Gemrails platform, merchants may be required to create and maintain a merchant account. During the onboarding process, merchants agree to provide accurate, current, and complete information.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Account Security</h3>
                  <p>
                    Merchants are responsible for maintaining the confidentiality and security of their account credentials, including login details, API keys, and any other authentication mechanisms.
                  </p>
                  <p>
                    Merchants agree to promptly notify Gemrails of any unauthorized access, suspected compromise, or security breach involving their account.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Acceptable Account Use</h3>
                  <p className="font-semibold text-white">Merchants agree not to use the platform for activities involving:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fraudulent or deceptive conduct</li>
                    <li>Money laundering or terrorist financing</li>
                    <li>Transactions involving sanctioned individuals or jurisdictions</li>
                    <li>The sale or distribution of illegal goods or services</li>
                    <li>Any activity that violates applicable financial, commercial, or regulatory laws</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Suspension and Termination</h3>
                  <p>
                    Gemrails reserves the right to suspend or terminate merchant accounts where suspicious activity is detected, Terms are violated, or regulatory obligations require such action.
                  </p>
                  <p>
                    Termination of an account does not relieve merchants of any obligations incurred prior to termination, including outstanding fees or compliance obligations.
                  </p>
                </Section>

                {/* Section 8: Dispute Resolution */}
                <Section id="section-8" number={8} title="Dispute Resolution" icon={Scale}>
                  <h3 className="text-lg font-semibold text-white mb-3">Merchant Responsibility for Customer Disputes</h3>
                  <p>
                    Merchants are solely responsible for managing and resolving any disputes arising between merchants and their customers in connection with goods or services purchased using the Gemrails infrastructure.
                  </p>
                  <p>
                    Gemrails is not a party to transactions between merchants and their customers and does not assume responsibility for product delivery, refunds, chargebacks, or customer complaints.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Good Faith Resolution</h3>
                  <p>
                    In the event of any dispute between a merchant and Gemrails, both parties agree to first attempt to resolve the matter through good faith negotiations.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Governing Law and Jurisdiction</h3>
                  <p>
                    These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.
                  </p>
                  <p>
                    If a dispute cannot be resolved through good faith negotiations, the dispute shall be subject to the exclusive jurisdiction of the courts located in Lagos State, Nigeria.
                  </p>
                </Section>

                {/* Section 9: General Provisions */}
                <Section id="section-9" number={9} title="General Provisions" icon={FileText}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Amendments</h3>
                      <p>
                        Gemrails reserves the right to modify or update these Terms at any time. Continued use of the platform after updates constitutes acceptance of the revised Terms.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Force Majeure</h3>
                      <p>
                        Gemrails shall not be liable for delays or failures resulting from events beyond its reasonable control, including natural disasters, government actions, network outages, or cyberattacks.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Independent Parties</h3>
                      <p>
                        Nothing in these Terms creates any partnership, joint venture, employment, or agency relationship between Gemrails and any merchant.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Severability</h3>
                      <p>
                        If any provision is determined to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Entire Agreement</h3>
                      <p>
                        These Terms constitute the entire agreement between Gemrails and merchants regarding the use of the platform.
                      </p>
                    </div>
                  </div>
                </Section>

                {/* Section 10: Appendix A */}
                <Section id="section-10" number={10} title="Appendix A: Service Jurisdiction" icon={Globe}>
                  <h3 className="text-lg font-semibold text-white mb-3">Geographic Scope of Services</h3>
                  <p>
                    Gemrails provides digital asset payment infrastructure services to businesses operating within Africa.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Initial Operating Jurisdiction</h3>
                  <p>
                    Gemrails currently launches and operates its services primarily within the Federal Republic of Nigeria. Services are provided in accordance with applicable Nigerian laws and regulations.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Expansion Across Africa</h3>
                  <p>
                    Gemrails intends to expand services to additional African jurisdictions over time, subject to regulatory approval, banking partnerships, and operational readiness.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Compliance with Local Laws</h3>
                  <p>
                    Merchants are responsible for ensuring their use of the services complies with all applicable laws in the jurisdictions where they operate.
                  </p>
                </Section>

                {/* Section 11: Appendix B */}
                <Section id="section-11" number={11} title="Appendix B: Electronic Signature Consent" icon={FileText}>
                  <h3 className="text-lg font-semibold text-white mb-3">Consent to Electronic Communications</h3>
                  <p>
                    By creating a merchant account or agreeing to these Terms, you consent to receive agreements, disclosures, and notices from Gemrails electronically through the platform, email, or website postings.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Electronic Signatures</h3>
                  <p>
                    Electronic signatures provided through the Gemrails platform have the same legal effect as handwritten signatures. By clicking "accept" or "agree," you acknowledge this constitutes a legally binding electronic signature.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Record Retention</h3>
                  <p>
                    Merchants are responsible for retaining copies of electronic communications and agreements. Gemrails may also maintain records in accordance with applicable laws.
                  </p>
                </Section>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 p-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    Contact Information
                  </h3>
                  <p className="text-gray-300 mb-4">
                    For questions, compliance matters, or legal inquiries relating to these Terms:
                  </p>
                  <div className="space-y-2 text-gray-400">
                    <p><span className="text-emerald-400 font-semibold">Company:</span> Gemrails Ltd.</p>
                    <p><span className="text-emerald-400 font-semibold">Email:</span> compliance@gemrails.com</p>
                    <p><span className="text-emerald-400 font-semibold">Address:</span> Flat 2b, Higher-life Building, opposite first-bank Onile-Aro, ojoo, ibadan</p>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8 mt-16 no-print">
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
