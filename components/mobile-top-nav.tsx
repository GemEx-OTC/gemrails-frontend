"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User, LogOut, LayoutDashboard, QrCode, History, Settings, HelpCircle, Bell, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useNotification } from "@/context/notification-context"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "QR Code", href: "/dashboard/qr-code", icon: QrCode },
  { name: "Transactions", href: "/dashboard/transactions", icon: History },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function MobileTopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { unreadCount } = useNotification()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    router.push("/auth/login")
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-[100] bg-[#0a0d10]/95 backdrop-blur-xl border-b border-gray-800 safe-area-top"
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/logo/logo_icon.png" alt="GemRails" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold text-white">GemRails</span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Notifications quick access */}
            <Link href="/dashboard/notifications">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500 rounded-full px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Menu toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-[280px] max-w-[85vw] z-[150] bg-[#0a0d10] border-l border-gray-800 flex flex-col safe-area-inset"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <span className="text-lg font-semibold text-white">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-gray-800 bg-gray-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{user?.businessName}</p>
                    <p className="text-sm text-gray-400 truncate">{`Merchant #${user?.merchantId}`}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto py-2">
                {menuItems.map((item, index) => {
                  const isActive = item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href || pathname.startsWith(item.href + "/")
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={item.href}>
                        <div
                          className={`mx-2 my-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="flex-1 font-medium">{item.name}</span>
                          {item.name === "Notifications" && unreadCount > 0 && (
                            <span className="min-w-[20px] h-5 flex items-center justify-center text-xs font-bold text-white bg-emerald-500 rounded-full px-1.5">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                          <ChevronRight className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-gray-600"}`} />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-800 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>

                <div className="text-xs text-gray-600 text-center">
                  <p>GemRails v1.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
