"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"

interface SetupGuideWidgetProps {
  userRole?: string
  accountType?: string
  phoneVerified?: boolean
  bankAdded?: boolean
  cacVerified?: boolean
  tier?: number
}

export function SetupGuideWidget({
  userRole = "merchant",
  accountType = "merchant",
  phoneVerified = false,
  bankAdded = false,
  cacVerified = false,
  tier = 0,
}: SetupGuideWidgetProps) {
  // Hide for moderators
  if (userRole === "branch_mod") return null;

  // Calculate progress
  let totalSteps = accountType === 'enterprise' ? 2 : 3;
  let completedSteps = 0;
  if (phoneVerified) completedSteps++;
  if (accountType !== 'enterprise' && bankAdded) completedSteps++;
  if (cacVerified) completedSteps++;

  const progress = Math.round((completedSteps / totalSteps) * 100);

  if (progress === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-5 md:p-6 bg-[#0a0d10] border border-gray-800 rounded-3xl relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none">
        <ShieldCheck className="w-48 h-48 text-emerald-500 transform rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-bold tracking-tight text-lg">Verification Progress</h3>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
              Tier {tier}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Unlock your full account limits and features by completing the remaining steps.
          </p>
          
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-linear-to-r from-emerald-500 to-teal-400"
              />
            </div>
            <span className="text-xs font-bold font-mono text-emerald-400">{progress}%</span>
          </div>
        </div>

        <div className="flex-none">
          <Link href="/dashboard/verification">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
            >
              Resume Setup
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
