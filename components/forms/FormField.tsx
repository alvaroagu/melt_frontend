import React from 'react'
import { Label } from '@/components/ui/label'

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label?: React.ReactNode
  htmlFor?: string
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
