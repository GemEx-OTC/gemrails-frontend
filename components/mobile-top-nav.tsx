"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, User, LogOut, Bell } from "lucide-react"

interface MobileTopNavProps {
  unreadCount?: number
}

export function MobileTopNav({ unreadCount = 3 }: MobileTopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    router.push("/auth/login")
  }

  const handleNotificationsClick = () => {
    router.push("/dashboard/notifications")
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0d10]/95 backdrop-blur-xl border-b border-gray-800"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <span className="text-lg font-bold text-white">GemRails</span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500 rounded-full px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Menu toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden fixed top-[60px] left-4 right-4 z-50 bg-[#12161c] border border-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-800 bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">Demo Restaurant</p>
                    <p className="text-sm text-gray-400">Verified Merchant</p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <div className="p-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
