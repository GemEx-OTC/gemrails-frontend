"use client"

import React, { createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { useProfile, useLogout } from "@/lib/hooks/use-auth"
import { setTokens, clearTokens } from "@/lib/api/client"
import type { User } from "@/lib/api/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, refreshToken: string, user: User, redirectPath?: string) => void
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user, isLoading, refetch } = useProfile()
  const logoutMutation = useLogout()

  const login = (token: string, refreshToken: string, userData: User, redirectPath?: string) => {
    setTokens(token, refreshToken)
    queryClient.setQueryData(['profile'], userData)
    
    if (redirectPath) {
      router.push(redirectPath)
    } else if (userData.role === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  const refreshUser = () => {
    refetch()
  }

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Re-export User type for convenience
export type { User }
