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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0d10] border-t border-gray-800 px-2 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? currentPath === "/dashboard"
            : currentPath === item.href || currentPath.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${isActive ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-1" />
                  {item.name === "Alerts" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold text-white bg-emerald-500 rounded-full px-0.5">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
