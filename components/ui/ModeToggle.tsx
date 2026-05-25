"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
type ModeToggleProps = {
  className?: string
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const currentTheme = theme === "system" ? resolvedTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-pressed={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full border-border/70 bg-background/80 shadow-sm transition-colors hover:bg-muted/60",
        className
      )}
    >
      <Sun className="h-[1.05rem] w-[1.05rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.05rem] w-[1.05rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
