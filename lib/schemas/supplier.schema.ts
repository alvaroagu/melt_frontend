import { z } from "zod"

import { optionalEmail, optionalText, requiredText } from "./shared"

export const createSupplierSchema = z.object({
  taxId: requiredText("El RFC o NIT", 20),
  companyName: requiredText("La razón social", 150),
  phone: optionalText(20),
  email: optionalEmail(100),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>

