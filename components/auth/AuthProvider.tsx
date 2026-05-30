"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { ApiError } from "@/lib/api/client"
import { authApi } from "@/lib/api/resources"
import type { AuthUser } from "@/lib/api/types"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthCredentials = {
  email: string
  password: string
}

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  login: (credentials: AuthCredentials) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshSession: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [user, setUser] = useState<AuthUser | null>(null)

  const refreshSession = useCallback(async () => {
    try {
      const currentUser = await authApi.me()
      setUser(currentUser)
      setStatus("authenticated")
      return currentUser
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          const session = await authApi.refresh()
          setUser(session.user)
          setStatus("authenticated")
          return session.user
        } catch {
          // Fall through to unauthenticated state below.
        }
      }

      setUser(null)
      setStatus("unauthenticated")
      return null
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshSession()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [refreshSession])

  const login = useCallback(async (credentials: AuthCredentials) => {
    const session = await authApi.login(credentials)
    setUser(session.user)
    setStatus("authenticated")
    return session.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setStatus("unauthenticated")
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, status, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
