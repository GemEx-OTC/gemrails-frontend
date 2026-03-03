"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { MobileTopNav } from "@/components/mobile-top-nav"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { NotificationProvider } from "@/context/notification-context"
import { OnboardingModal } from "@/components/onboarding-modal"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0d10]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <NotificationProvider>
      <div className="flex h-screen bg-[#0a0d10] text-white print:block print:h-auto print:bg-transparent">
        <div className="print:hidden">
          <Sidebar currentPath={pathname} />
        </div>

        {/* Mobile Top Navigation */}
        <div className="print:hidden">
          <MobileTopNav />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
          <main className="flex-1 overflow-y-auto pt-[60px] md:pt-0 pb-20 md:pb-0 print:pt-0 print:pb-0 print:overflow-visible">
            <div className="p-4 md:p-8 print:p-0">{children}</div>
          </main>
        </div>
        <div className="print:hidden">
          <BottomNav currentPath={pathname} />
        </div>
        <OnboardingModal />
      </div>
    </NotificationProvider>
  )
}
