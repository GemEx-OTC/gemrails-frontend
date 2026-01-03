"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

export interface User {
    id: string
    email: string
    emailVerified?: boolean
    role?: string
    businessName?: string
    businessCategory?: string
    businessAddress?: string
    businessLogo?: string
    contactName?: string
    phone?: string
    rcNumber?: string
    merchantStatus?: "pending" | "active" | "suspended" | string
    merchantId?: string
    bankAccount?: {
        bankCode: string
        bankName: string
        accountNumber: string
        accountName: string
        isVerified: boolean
    }
    settings?: {
        emailNotifications: boolean
        smsNotifications: boolean
    }
    createdAt?: string
    updatedAt?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (token: string, refreshToken: string, user: User, redirectPath?: string) => void
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response: any = await apiClient.getProfile()
                    const profile = response.data || response
                    setUser(profile as User)
                } catch (error) {
                    console.error("Failed to fetch profile", error)
                    localStorage.removeItem("token")
                    localStorage.removeItem("refreshToken")
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = (token: string, refreshToken: string, userData: User, redirectPath?: string) => {
        localStorage.setItem("token", token)
        localStorage.setItem("refreshToken", refreshToken)
        setUser(userData)
        if (redirectPath) {
            router.push(redirectPath)
        } else if (userData.role === "admin") {
            router.push("/admin/dashboard")
        } else {
            router.push("/dashboard")
        }
    }

    const logout = async () => {
        try {
            await apiClient.logout()
        } catch (error) {
            console.error("Logout failed", error)
        }
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        setUser(null)
        router.push("/auth/login")
    }

    const refreshUser = async () => {
        try {
            const response: any = await apiClient.getProfile()
            const profile = response.data || response
            setUser(profile as User)
        } catch (error) {
            console.error("Failed to refresh user", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
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
