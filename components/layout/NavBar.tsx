"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/ModeToggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/AuthProvider"
import { toast } from "sonner"

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

export default function NavBar({ className }: { className?: string }) {
  const router = useRouter()
  const { logout, user } = useAuth()

  if (!user) {
    return null
  }

  const displayName = user.name ?? user.email
  const initials = getInitials(displayName)
  const roleLabel = getRoleLabel(user.role)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      toast.error("No se pudo cerrar la sesión.")
    } finally {
      router.replace("/login")
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 h-12",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-end gap-2 px-4 py-2 sm:px-6 lg:px-8 h-12">
        {/* Minimal header: left intentionally empty to keep navbar icon-only */}
        

        <div className="flex items-center gap-2">
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full border-border/70 bg-background/80 shadow-sm"
              >
                <Avatar size="sm" className="size-7">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Abrir menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-1.5 py-1.5">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                {roleLabel ? (
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                ) : null}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/configuracion">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onSelect={() => void handleLogout()}>
                Cerrar sesión
                <LogOut className="ml-auto size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
