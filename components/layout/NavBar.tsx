"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

type NavBarUser = {
  name: string
  role?: string
  initials?: string
  avatarUrl?: string
}

type NavBarProps = {
  className?: string
  user?: NavBarUser
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export default function NavBar({
  className,
  user = {
    name: "Usuario Melt",
    role: "Administrador",
    initials: "UM",
  },
}: NavBarProps) {
  const initials = user.initials ?? getInitials(user.name)

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
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Abrir menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-1.5 py-1.5">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                {user.role ? (
                  <p className="text-xs text-muted-foreground">{user.role}</p>
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

              <DropdownMenuItem variant="destructive">
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
