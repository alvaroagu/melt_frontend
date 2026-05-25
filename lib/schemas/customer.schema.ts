import { z } from "zod"

import { numberInput, optionalText, requiredText } from "./shared"

export const createCustomerSchema = z.object({
  taxId: requiredText("El RFC o NIT", 20),
  fullName: requiredText("El nombre completo", 100),
  phone: optionalText(20),
  creditLimit: numberInput(
    z.number().min(0, { message: "El límite de crédito debe ser mayor o igual a 0" })
  ),
  currentDebt: numberInput(
    z.number().min(0, { message: "La deuda actual debe ser mayor o igual a 0" })
  ),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>

