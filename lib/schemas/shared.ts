import { z } from "zod"

const normalizeNumberInput = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim()

    if (!trimmed) {
      return undefined
    }

    return Number(trimmed)
  }

  return value
}

const normalizeOptionalString = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }

  return value
}

export function requiredText(label: string, maxLength?: number) {
  const schema = z.string().trim().min(1, { message: `${label} es requerido` })

  if (maxLength == null) {
    return schema
  }

  return schema.max(maxLength, {
    message: `${label} debe tener como máximo ${maxLength} caracteres`,
  })
}

export function optionalText(maxLength?: number) {
  const schema = maxLength == null ? z.string() : z.string().max(maxLength)

  return z.preprocess(normalizeOptionalString, schema.optional())
}

export function optionalEmail(maxLength?: number) {
  const schema = z
    .string()
    .email({ message: "El correo electrónico no tiene un formato válido" })

  const withLength =
    maxLength == null
      ? schema
      : schema.max(maxLength, {
          message: `El correo electrónico debe tener como máximo ${maxLength} caracteres`,
        })

  return z.preprocess(normalizeOptionalString, withLength.optional())
}

export function numberInput(schema: z.ZodNumber) {
  return z.preprocess(normalizeNumberInput, schema)
}

export function optionalNumberInput(schema: z.ZodNumber) {
  return z.preprocess((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim()
      return trimmed ? Number(trimmed) : undefined
    }

    return value == null ? undefined : value
  }, schema.optional())
}
