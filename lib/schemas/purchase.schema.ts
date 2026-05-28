import { z } from "zod"

import { numberInput, optionalText } from "./shared"

const optionalDateInput = z.preprocess((value) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }

  return value
}, z.string().optional())

const purchaseItemFormSchema = z.object({
  productId: numberInput(
    z.number().int().positive({ message: "Selecciona un producto" })
  ),
  quantity: numberInput(
    z.number().int().min(1, { message: "La cantidad debe ser mayor o igual a 1" })
  ),
  costPerUnit: numberInput(
    z.number().min(0, { message: "El costo unitario debe ser mayor o igual a 0" })
  ),
})

export const purchaseFormSchema = z.object({
  supplierId: numberInput(
    z.number().int().positive({ message: "Selecciona un proveedor" })
  ),
  invoiceNumber: optionalText(50),
  purchaseDate: optionalDateInput,
  items: z.array(purchaseItemFormSchema).min(1, {
    message: "Agrega al menos un producto a la compra",
  }),
})

export type PurchaseFormValues = z.input<typeof purchaseFormSchema>
export type PurchaseFormOutput = z.output<typeof purchaseFormSchema>

export type CreatePurchaseInput = {
  supplierId: number
  invoiceNumber?: string
  totalCost: number
  purchaseDate?: string
  items: Array<{
    productId: number
    quantity: number
    costPerUnit: number
    subtotal: number
  }>
}
