"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { usePathname } from "next/navigation"

import type { NavigationItem } from "@/lib/navigation"
import { cn } from "@/lib/utils"

type Props = {
  item: NavigationItem
  isCollapsed: boolean
  onNavigate: (href?: string) => void
}

const isPathActive = (pathname: string, href?: string) => {
  if (!href) {
    return false
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SidebarItem({ item, isCollapsed, onNavigate }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [hoverOpen, setHoverOpen] = useState(false)
  const liRef = useRef<HTMLLIElement | null>(null)

  const hasChildren = !!item.children && item.children.length > 0
  const isActive =
    isPathActive(pathname, item.href) ||
    (hasChildren && item.children!.some((child) => isPathActive(pathname, child.href)))
  const isExpanded = hasChildren && (open || isActive)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(e.target as Node)) {
        setHoverOpen(false)
      }
    }
    if (hoverOpen) {
      document.addEventListener("mousedown", onClickOutside)
    }
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [hoverOpen])

  const handleMainClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev)
    }

    onNavigate(item.href)
  }

  const handleChildClick = (childHref?: string) => {
    onNavigate(childHref)
    setOpen(false)
    setHoverOpen(false)
  }

  const Icon = item.icon

  return (
    <li ref={liRef} className="relative">
      <button
        onClick={handleMainClick}
        onMouseEnter={() => isCollapsed && hasChildren && setHoverOpen(true)}
        onMouseLeave={() => isCollapsed && hasChildren && setHoverOpen(false)}
        className={cn(
          "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-200",
          isActive
            ? "bg-foreground text-background shadow-sm"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isCollapsed ? "justify-center px-2" : ""
        )}
        title={isCollapsed ? item.name : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-controls={hasChildren ? `${item.id}-submenu` : undefined}
      >
        <div className="flex min-w-[24px] items-center justify-center">
          {Icon ? (
            <Icon
              className={cn(
                "h-4.5 w-4.5 flex-shrink-0",
                isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
          ) : (
            <div className="h-4.5 w-4.5" />
          )}
        </div>

        {!isCollapsed && (
          <div className="flex w-full items-center justify-between gap-2">
            <span className={cn("text-sm", isActive ? "font-medium tracking-[-0.01em]" : "font-normal")}>
              {item.name}
            </span>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full border px-1.5 py-0.5 text-[11px] font-medium tracking-[0.14em]",
                    isActive
                      ? "border-background/20 bg-background/15 text-background"
                      : "border-border/70 bg-background/60 text-muted-foreground"
                  )}
                >
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-current/60" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-current/60" />
                )
              )}
            </div>
          </div>
        )}

        {isCollapsed && item.badge && (
          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border border-border/70 bg-background">
            <span className="text-[10px] font-medium text-foreground">
              {parseInt(item.badge) > 9 ? '9+' : item.badge}
            </span>
          </div>
        )}

        {isCollapsed && !hasChildren && (
          <div className="absolute left-full ml-2 rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs text-foreground opacity-0 invisible whitespace-nowrap shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
            {item.name}
            {item.badge && (
              <span className="ml-1.5 rounded-full bg-muted px-1 py-0.5 text-[10px]">
                {item.badge}
              </span>
            )}
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-l border-b border-border/70 bg-card" />
          </div>
        )}
      </button>

      {!isCollapsed && hasChildren && (
        <ul
          id={`${item.id}-submenu`}
          className={cn("mt-1 space-y-1 pl-8 pr-2", isExpanded ? "block" : "hidden")}
          role="menu"
          aria-label={`${item.name} submenu`}
        >
          {item.children!.map((child) => {
            const childActive = isPathActive(pathname, child.href)
            const ChildIcon = child.icon
            return (
              <li key={child.id}>
                <button
                  onClick={() => handleChildClick(child.href)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-sm transition-colors duration-150",
                    childActive
                      ? "bg-foreground text-background font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex min-w-[20px] items-center justify-center">
                    {ChildIcon ? (
                      <ChildIcon
                        className={cn(
                          "h-3.5 w-3.5",
                          childActive ? "text-background" : "text-muted-foreground"
                        )}
                      />
                    ) : (
                      <div className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="truncate">{child.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {isCollapsed && hasChildren && hoverOpen && (
        <div
          className="absolute left-full top-0 z-50 ml-2 w-56 rounded-2xl border border-border/70 bg-card/98 p-2 shadow-2xl backdrop-blur"
          onMouseEnter={() => setHoverOpen(true)}
          onMouseLeave={() => setHoverOpen(false)}
        >
          <div className="mb-2 border-b border-border/70 px-2 py-1 text-xs font-medium tracking-[0.14em] text-muted-foreground">
            {item.name}
          </div>
          <ul className="space-y-1">
            {item.children!.map((child) => {
              const childActive = isPathActive(pathname, child.href)
              const ChildIcon = child.icon
              return (
                <li key={child.id}>
                  <button
                    onClick={() => handleChildClick(child.href)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-150",
                      childActive
                        ? "bg-foreground text-background font-medium"
                        : "text-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <div className="flex min-w-[20px] items-center justify-center">
                      {ChildIcon ? (
                        <ChildIcon
                          className={cn(
                            "h-3.5 w-3.5",
                            childActive ? "text-background" : "text-muted-foreground"
                          )}
                        />
                      ) : (
                        <div className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <span className="truncate">{child.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1.5 -translate-y-1/2 rotate-45 border-l border-b border-border/70 bg-card" />
        </div>
      )}
    </li>
  )
}
