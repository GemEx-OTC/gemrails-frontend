"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { AlertCircle, ArrowRight, X } from "lucide-react"

interface OnboardingBannerProps {
  isProfileComplete?: boolean
  isBankAdded?: boolean
  userRole?: string
}

export function OnboardingBanner({
  isProfileComplete = false,
  isBankAdded = false,
  userRole = "merchant",
}: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  // Don't show if everything is complete or dismissed or if user is a moderator
  if ((isProfileComplete && isBankAdded) || dismissed || userRole === "branch_mod") {
    return null
  }

  const getMessage = () => {
    if (!isProfileComplete && !isBankAdded) {
      return {
        title: "Complete your profile to start accepting payments",
        description:
          "Add your business details and bank account to receive payments.",
        cta: "Complete Setup",
        href: "/dashboard/onboarding",
      }
    }
    if (!isProfileComplete) {
      return {
        title: "Complete your business profile",
        description: "Add your business details to get verified.",
        cta: "Add Details",
        href: "/dashboard/onboarding",
      }
    }
    return {
      title: "Add your bank account",
      description: "Add a settlement account to receive Naira payments.",
      cta: "Add Bank",
      href: "/dashboard/settings",
    }
  }

  const message = getMessage()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold">{message.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{message.description}</p>
            <Link href={message.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-amber-900 bg-amber-400 hover:bg-amber-300 transition-colors text-sm"
              >
                {message.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-gray-500 hover:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
