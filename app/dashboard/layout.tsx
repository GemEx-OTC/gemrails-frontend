"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { MobileTopNav } from "@/components/mobile-top-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-[#0a0d10] text-white">
      <Sidebar currentPath={pathname} />
      
      {/* Mobile Top Navigation */}
      <MobileTopNav />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content area - add top padding for mobile header */}
        <main className="flex-1 overflow-y-auto pt-[60px] md:pt-0 pb-20 md:pb-0">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
      <BottomNav currentPath={pathname} />
    </div>
  )
}
