import { z } from "zod"

import { requiredText } from "./shared"

export const createPaymentMethodSchema = z.object({
  name: requiredText("El nombre", 50),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>

