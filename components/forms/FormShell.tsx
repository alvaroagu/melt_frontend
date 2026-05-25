"use client"

import type { FormEventHandler, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type FormShellProps = {
  title: string
  description?: string
  submitLabel?: string
  isSubmitting?: boolean
  className?: string
  children: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
}

export default function FormShell({
  title,
  description,
  submitLabel = "Guardar",
  isSubmitting = false,
  className,
  children,
  onSubmit,
}: FormShellProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="space-y-5">{children}</CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

