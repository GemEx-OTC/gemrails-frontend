"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { BUSINESS_CATEGORIES, TIER_LIMITS } from "@/lib/constants"

interface SetupGuideWidgetProps {
  userRole?: string
  accountType?: string
  phoneVerified?: boolean
  emailVerified?: boolean
  bankAdded?: boolean
  cacVerified?: boolean
  tier?: number
  settledVolume?: number
  tierLimit?: number
}

export function SetupGuideWidget({
  userRole = "merchant",
  accountType = "merchant",
  phoneVerified = false,
  emailVerified = true,
  bankAdded = false,
  cacVerified = false,
  tier = 0,
  settledVolume = 0,
  tierLimit = 0,
}: SetupGuideWidgetProps) {
  const finalTierLimit = tierLimit || TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || 200000;
  // Hide for moderators
  if (userRole === "branch_mod") return null;

  const steps = [
    { id: 'email', label: 'Email Verified', completed: emailVerified },
    { id: 'phone', label: 'Phone Number', completed: phoneVerified },
    ...(accountType !== 'enterprise' ? [{ id: 'bank', label: 'Bank Account', completed: bankAdded }] : []),
    { id: 'cac', label: 'CAC Document', completed: cacVerified },
  ];

  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.completed).length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  if (progress === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 md:p-8 bg-[#0a0d10]/80 backdrop-blur-md border border-gray-800 rounded-[2rem] relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none">
        <ShieldCheck className="w-48 h-48 text-emerald-500 transform rotate-12" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white tracking-tight">Onboarding Progress</h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                Tier {tier}
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Complete these simple steps to remove limits and unlock the full potential of your GemRails account.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 group">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black font-mono text-emerald-400 tracking-tighter">{progress}%</span>
              <Link href="/dashboard/verification">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-emerald-500 text-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all font-bold"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mr-14">Remaining to 100%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          />
        </div>

        {/* Steps Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`p-4 rounded-2xl border transition-all duration-500 ${
                step.completed 
                  ? "bg-emerald-500/5 border-emerald-500/20" 
                  : "bg-gray-900/40 border-gray-800 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.completed 
                    ? "bg-emerald-500 border-emerald-500 text-black" 
                    : "border-gray-700"
                }`}>
                  {step.completed && <ShieldCheck className="w-4 h-4" />}
                </div>
                <div>
                  <p className={`text-xs font-bold leading-none ${step.completed ? "text-white" : "text-gray-500"}`}>
                    {step.label}
                  </p>
                  {step.completed ? (
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Completed</span>
                  ) : (
                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
