
const BASE_URL = "https://api.gemexrails.com/api/v1"

interface ApiError {
    message: string
    status: number
}

async function fetchHelper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const headers: Record<string, string> = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers as Record<string, string>,
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        // Handle 401 Unauthorized - Attempt Refresh Token
        if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh-token")) {
            try {
                const refreshToken = localStorage.getItem("refreshToken")

                if (!refreshToken) {
                    throw new Error("No refresh token available")
                }

                // Call refresh token endpoint
                const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                })

                if (!refreshResponse.ok) {
                    throw new Error("Refresh token expired or invalid")
                }

                const refreshData = await refreshResponse.json()
                const newAccessToken = refreshData.data?.accessToken
                const newRefreshToken = refreshData.data?.refreshToken

                if (newAccessToken) {
                    localStorage.setItem("token", newAccessToken)
                    if (newRefreshToken) {
                        localStorage.setItem("refreshToken", newRefreshToken)
                    }

                    // Retry original request with new token
                    const newHeaders = {
                        ...headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    }

                    return fetchHelper(endpoint, { ...options, headers: newHeaders })
                }
            } catch (refreshError) {
                // Clear tokens and let the error propagate to trigger logout in UI/Context if needed
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token")
                    localStorage.removeItem("refreshToken")
                    window.location.href = "/auth/login" // Force redirect
                }
            }
        }

        let errorMessage = data.message || "An error occurred"
        let errorCode = data.error?.code

        // Prioritize message from data.error if available
        if (data.error?.message) {
            errorMessage = data.error.message
        }

        if (data.error && data.error.name === "ZodError" && data.error.message) {
            try {
                const zodErrors = JSON.parse(data.error.message)
                if (Array.isArray(zodErrors) && zodErrors.length > 0) {
                    errorMessage = zodErrors[0].message
                }
            } catch (e) {
                errorMessage = data.error.message
            }
        }

        if (data.error?.code) {
            errorCode = data.error.code
        }

        const error = new Error(errorMessage) as any
        error.status = response.status
        error.code = errorCode
        throw error
    }

    return data
}

export const apiClient = {
    // Auth
    refreshToken: (refreshToken: string) => fetchHelper("/auth/refresh-token", { method: "POST", body: JSON.stringify({ refreshToken }) }),
    register: (data: any) => fetchHelper("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    verifyEmail: (data: { email: string; otp: string }) => fetchHelper("/auth/verify-email", { method: "POST", body: JSON.stringify(data) }),
    resendOtp: (email: string) => fetchHelper("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) }),
    login: (data: any) => fetchHelper("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    adminLogin: (data: any) => fetchHelper("/auth/admin/login", { method: "POST", body: JSON.stringify(data) }),
    logout: () => fetchHelper("/auth/logout", { method: "POST" }),
    getProfile: () => fetchHelper("/auth/profile"),

    // Profile & Settings
    updateProfile: (data: any) => fetchHelper("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
    updateBankAccount: (data: any) => fetchHelper("/auth/bank-account", { method: "PUT", body: JSON.stringify(data) }),
    updateSettings: (data: any) => fetchHelper("/auth/settings", { method: "PUT", body: JSON.stringify(data) }),
    uploadLogo: (data: FormData) => fetchHelper("/auth/upload-logo", { method: "POST", body: data }),
    deleteLogo: () => fetchHelper("/auth/logo", { method: "DELETE" }),
    changePassword: (data: any) => fetchHelper("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),

    // Forgot Password
    forgotPassword: (email: string) => fetchHelper("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (data: any) => fetchHelper("/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),

    // Dashboard
    getDashboard: () => fetchHelper("/dashboard"),
    getTransactions: (params?: any) => {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.append("page", params.page.toString())
        if (params?.limit) searchParams.append("limit", params.limit.toString())
        if (params?.status && params.status !== "all") searchParams.append("status", params.status)
        if (params?.search) searchParams.append("search", params.search)

        const queryString = searchParams.toString()
        return fetchHelper(`/dashboard/transactions${queryString ? `?${queryString}` : ""}`)
    },
    getTransaction: (id: string) => fetchHelper(`/dashboard/transactions/${id}`),
}
