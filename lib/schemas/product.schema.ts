import { z } from "zod"

import { numberInput, requiredText } from "./shared"

export const createProductSchema = z.object({
  categoryId: numberInput(
    z.number().int().positive({ message: "La categoría es requerida" })
  ),
  name: requiredText("El nombre", 100),
  unitCost: numberInput(
    z.number().min(0, { message: "El costo unitario debe ser mayor o igual a 0" })
  ),
  unitPrice: numberInput(
    z.number().min(0, { message: "El precio unitario debe ser mayor o igual a 0" })
  ),
  currentStock: numberInput(
    z.number().int().min(0, { message: "El stock debe ser un entero mayor o igual a 0" })
  ),
  trackInventory: z.boolean().default(true),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
