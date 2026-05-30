"use client"

import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"

import DashboardLayout from "./DashboardLayout"
import NavBar from "./NavBar"

const PUBLIC_PATHS = ["/login"]

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card/90 px-4 py-3 shadow-sm">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm">Cargando sesión...</span>
      </div>
    </div>
  )
}

export default function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const { status } = useAuth()

  const isPublicPath = PUBLIC_PATHS.includes(pathname)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "authenticated" && pathname === "/login") {
      router.replace("/dashboard")
      return
    }

    if (status === "unauthenticated" && !isPublicPath) {
      router.replace("/login")
    }
  }, [isPublicPath, pathname, router, status])

  if (isPublicPath) {
    return children
  }

  if (status !== "authenticated") {
    return <FullScreenLoader />
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <NavBar />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  )
}
