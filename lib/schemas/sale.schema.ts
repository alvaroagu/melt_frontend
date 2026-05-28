import { z } from "zod"

import { numberInput, optionalNumberInput } from "./shared"

const optionalDateInput = z.preprocess((value) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }

  return value
}, z.string().optional())

const saleItemFormSchema = z.object({
  productId: numberInput(
    z.number().int().positive({ message: "Selecciona un producto" })
  ),
  quantity: numberInput(
    z.number().int().min(1, { message: "La cantidad debe ser mayor o igual a 1" })
  ),
  priceAtSale: numberInput(
    z.number().min(0, { message: "El precio de venta debe ser mayor o igual a 0" })
  ),
  flavorIds: z.array(z.number().int().positive()).default([]),
})

export const saleFormSchema = z
  .object({
    customerId: optionalNumberInput(
      z.number().int().positive({ message: "Selecciona un cliente válido" })
    ),
    paymentMethodId: numberInput(
      z.number().int().positive({ message: "Selecciona un método de pago" })
    ),
    isCredit: z.boolean().default(false),
    saleDate: optionalDateInput,
    dueDate: optionalDateInput,
    items: z.array(saleItemFormSchema).min(1, {
      message: "Agrega al menos un producto a la venta",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.isCredit && !values.customerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customerId"],
        message: "Selecciona un cliente para registrar una venta a crédito",
      })
    }
  })

export type SaleFormValues = z.input<typeof saleFormSchema>
export type SaleFormOutput = z.output<typeof saleFormSchema>

export type CreateSaleInput = {
  customerId?: number
  paymentMethodId: number
  totalAmount: number
  isCredit?: boolean
  saleDate?: string
  dueDate?: string
  items: Array<{
    productId: number
    quantity: number
    priceAtSale: number
    subtotal: number
    flavorIds?: number[]
  }>
}
