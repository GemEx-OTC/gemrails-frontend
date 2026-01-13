"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/dashboard")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0d10]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  )
}
