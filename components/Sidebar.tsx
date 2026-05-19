"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from 'lucide-react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import type { NavItem } from "@/lib/navigation"

type SidebarProps = {
  menu: NavItem[]
}

export default function Sidebar({ menu }: SidebarProps) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => setOpenMap((s) => ({ ...s, [id]: !s[id] }))

  const renderItem = (item: NavItem, depth = 0) => {
    const hasChildren = !!(item.children && item.children.length)
    return (
      <div key={item.id} className="mb-1">
        {hasChildren ? (
          <>
            <button
              onClick={() => toggle(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
                depth === 0 ? "" : "pl-6"
              )}
            >
              {item.icon && (
                <ChevronDown name={item.icon} className="size-4" />
              )}
              <span className="truncate">{item.label}</span>
              <ChevronDown
                name="chevron-down"
                className={cn(
                  "ml-auto transition-transform",
                  openMap[item.id] ? "rotate-180" : ""
                )}
              />
            </button>
            <div className={cn("mt-1 ml-2", !openMap[item.id] && "hidden")}>
              {item.children!.map((child) => renderItem(child, depth + 1))}
            </div>
          </>
        ) : (
          <Link
            href={item.href ?? "#"}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
              depth === 0 ? "" : "pl-6"
            )}
          >
            {item.icon && (
              <ChevronDown name={item.icon} className="size-4" />
            )}
            <span className="truncate">{item.label}</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="m-3">
              <ChevronDown name="menu" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="mt-4">
              {menu.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>

            <div className="mt-4">
              <SheetClose asChild>
                <Button variant="ghost">Cerrar</Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:py-6 lg:pl-4 lg:pr-2 lg:h-screen">
        <nav className="flex-1 overflow-y-auto px-2">{menu.map((item) => renderItem(item))}</nav>
      </aside>
    </>
  )
}
