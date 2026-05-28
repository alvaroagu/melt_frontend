import type { DecimalValue } from "@/lib/api/types"

export function toNumber(value: DecimalValue | null | undefined) {
  if (value == null || value === "") {
    return 0
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCurrency(value: DecimalValue | null | undefined) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(toNumber(value))
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}
