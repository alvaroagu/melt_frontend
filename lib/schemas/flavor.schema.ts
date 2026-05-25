import { z } from "zod"

import { numberInput, requiredText } from "./shared"

export const createFlavorSchema = z.object({
  name: requiredText("El nombre", 50),
  isAvailable: z.boolean().default(true),
  currentStockLiters: numberInput(
    z.number().min(0, { message: "El stock actual debe ser mayor o igual a 0" })
  ),
})

export type CreateFlavorInput = z.infer<typeof createFlavorSchema>

