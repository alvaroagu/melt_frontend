"use client"

import React, { useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useAuth } from "@/components/auth/AuthProvider"
import { navigationItems } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { useSidebar } from "./SidebarContext"
import SidebarItem from "./SidebarItem"

interface SidebarProps {
  className?: string
  children?: React.ReactNode
  defaultCollapsed?: boolean
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getRoleLabel(role?: string | null) {
  switch (role) {
    case "ADMIN":
      return "Administrador"
    case "USER":
      return "Usuario"
    default:
      return undefined
  }
}

export function Sidebar({ className = "" }: SidebarProps) {
  const { isCollapsed, setIsCollapsed, isOpen, setIsOpen } = useSidebar()
  const router = useRouter()
  const { logout, user } = useAuth()
  const displayName = user?.name ?? user?.email ?? "Usuario"
  const roleLabel = getRoleLabel(user?.role)
  const initials = getInitials(displayName)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setIsOpen])

  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      toast.error("No se pudo cerrar la sesión.")
    } finally {
      router.replace("/login")
    }
  }

  const handleNavigate = (href?: string) => {
    if (href) {
      router.push(href)
    }

    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 inline-flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-background/95 text-foreground shadow-sm backdrop-blur md:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "fixed top-12 left-0 z-40 flex h-[calc(100vh-3rem)] flex-col border-r border-border/70 bg-sidebar/95 text-sidebar-foreground shadow-[1px_0_0_0_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 md:static md:h-auto md:top-0 md:h-full",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20" : "w-80",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <span className="text-sm font-medium tracking-[0.2em]">M</span>
          </div>

          <button
            onClick={toggleCollapse}
            className="hidden md:inline-flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar"
                className="border-border/70 bg-background/80 pl-9"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                onNavigate={handleNavigate}
              />
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-border/70">
          <div className={cn("border-b border-border/70 bg-background/60", isCollapsed ? "px-2 py-3" : "p-3")}>
            {!isCollapsed ? (
              <div className="flex items-center rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted/70">
                  <span className="text-sm font-medium text-foreground">{initials}</span>
                </div>
                <div className="ml-2.5 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {roleLabel ?? "Sesión activa"}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2 border-border/70 uppercase tracking-[0.14em]">
                  Online
                </Badge>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted/70">
                    <span className="text-sm font-medium">{initials}</span>
                  </div>
                  <div className="absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-background bg-sidebar-primary" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <button
              onClick={() => void handleLogout()}
              className={cn(
                "group relative flex w-full items-center rounded-2xl border border-border/70 bg-background/80 text-left transition-colors hover:bg-muted/60",
                isCollapsed ? "justify-center p-2.5" : "gap-2.5 px-3 py-2.5"
              )}
              title={isCollapsed ? "Cerrar sesión" : undefined}
            >
              <div className="flex min-w-[24px] items-center justify-center">
                <LogOut className="h-4.5 w-4.5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
              </div>

              {!isCollapsed && <span className="text-sm text-foreground">Cerrar sesión</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-2 rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs text-foreground opacity-0 invisible whitespace-nowrap shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  Cerrar sesión
                  <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-l border-b border-border/70 bg-card" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
