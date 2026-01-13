"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { LayoutDashboard, QrCode, History, Settings, Bell } from "lucide-react"

import { useNotification } from "@/context/notification-context"

interface BottomNavProps {
  currentPath: string
}

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "QR Code", href: "/dashboard/qr-code", icon: QrCode },
  { name: "Alerts", href: "/dashboard/notifications", icon: Bell },
  { name: "History", href: "/dashboard/transactions", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function BottomNav({ currentPath }: BottomNavProps) {
  const { unreadCount } = useNotification()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0d10]/95 backdrop-blur-xl border-t border-gray-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? currentPath === "/dashboard"
            : currentPath === item.href || currentPath.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="flex-1 min-w-0">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all relative ${
                  isActive 
                    ? "text-emerald-400" 
                    : "text-gray-500 active:text-gray-300"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <div className="relative">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isActive ? "scale-110" : ""}`} />
                  {item.name === "Alerts" && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500 rounded-full px-1 shadow-lg shadow-emerald-500/30">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium mt-1 truncate ${isActive ? "text-emerald-400" : ""}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
