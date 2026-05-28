"use client"

import { z } from "zod"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import type { DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"

import FormShell from "./FormShell"
import { Button } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, toNumber } from "@/lib/formatters"
import { purchaseFormSchema, type PurchaseFormOutput } from "@/lib/schemas/purchase.schema"

type PurchaseFormOption = {
  id: number
  name: string
}

type PurchaseProductOption = PurchaseFormOption & {
  unitCost?: number | string
}

type PurchaseFormProps = {
  suppliers: PurchaseFormOption[]
  products: PurchaseProductOption[]
  defaultValues?: DefaultValues<PurchaseFormOutput>
  onSubmit?: (values: PurchaseFormOutput) => void | Promise<void>
  submitLabel?: string
  className?: string
  title?: string
  description?: string
}

const selectClassName =
  "h-9 w-full rounded-xl border border-input/80 bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"

function createEmptyItem() {
  return {
    productId: undefined,
    quantity: 1,
    costPerUnit: 0,
  }
}

export default function PurchaseForm({
  suppliers,
  products,
  defaultValues,
  onSubmit,
  submitLabel,
  className,
  title = "Registrar compra",
  description = "Captura la compra con sus productos e importes unitarios.",
}: PurchaseFormProps) {
  type PurchaseFormValues = z.input<typeof purchaseFormSchema>

  const form = useForm<PurchaseFormValues, unknown, PurchaseFormOutput>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      supplierId: undefined,
      invoiceNumber: "",
      purchaseDate: "",
      items: [createEmptyItem()],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems =
    useWatch<PurchaseFormValues>({
      control: form.control,
      name: "items",
    }) as PurchaseFormOutput["items"] | undefined
  const normalizedWatchedItems = watchedItems ?? []

  const totalCost = normalizedWatchedItems.reduce((sum, item) => {
    return sum + toNumber(item?.quantity) * toNumber(item?.costPerUnit)
  }, 0)

  return (
    <FormShell
      title={title}
      description={description}
      submitLabel={submitLabel ?? "Guardar compra"}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="purchase-supplier">Proveedor</FieldLabel>
          <FieldContent>
            <select
              id="purchase-supplier"
              className={selectClassName}
              {...form.register("supplierId")}
              defaultValue={form.getValues("supplierId")?.toString() ?? ""}
            >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <FieldError errors={[form.formState.errors.supplierId]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="purchase-invoice-number">Factura</FieldLabel>
          <FieldContent>
            <Input id="purchase-invoice-number" {...form.register("invoiceNumber")} />
            <FieldDescription>Campo opcional para referencia del proveedor.</FieldDescription>
            <FieldError errors={[form.formState.errors.invoiceNumber]} />
          </FieldContent>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="purchase-date">Fecha de compra</FieldLabel>
          <FieldContent>
            <Input id="purchase-date" type="date" {...form.register("purchaseDate")} />
            <FieldError errors={[form.formState.errors.purchaseDate]} />
          </FieldContent>
        </Field>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-foreground">Productos comprados</h3>
            <p className="text-sm text-muted-foreground">
              Registra cantidad, costo y subtotal por producto.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => append(createEmptyItem())}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar item
          </Button>
        </div>

        <FieldError errors={[form.formState.errors.items]} />

        {fields.map((field, index) => {
          const lineTotal =
            toNumber(normalizedWatchedItems[index]?.quantity) *
            toNumber(normalizedWatchedItems[index]?.costPerUnit)

          return (
            <div key={field.id} className="space-y-4 rounded-2xl border border-border/70 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Item #{index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Quitar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field className="md:col-span-3">
                  <FieldLabel>Producto</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field: productField }) => (
                        <select
                          className={selectClassName}
                          value={productField.value?.toString() ?? ""}
                          onChange={(event) => {
                            const selectedId = event.target.value ? Number(event.target.value) : undefined
                            productField.onChange(selectedId)

                            const selectedProduct = products.find((product) => product.id === selectedId)
                            if (selectedProduct) {
                              form.setValue(
                                `items.${index}.costPerUnit`,
                                toNumber(selectedProduct.unitCost),
                                { shouldDirty: true, shouldValidate: true },
                              )
                            }
                          }}
                        >
                          <option value="">Selecciona un producto</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <FieldError errors={[form.formState.errors.items?.[index]?.productId]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Cantidad</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      {...form.register(`items.${index}.quantity`)}
                    />
                    <FieldError errors={[form.formState.errors.items?.[index]?.quantity]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Costo unitario</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.costPerUnit`)}
                    />
                    <FieldError errors={[form.formState.errors.items?.[index]?.costPerUnit]} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Subtotal</FieldLabel>
                  <FieldContent>
                    <div className="flex h-9 items-center rounded-xl border border-border/70 bg-muted/20 px-3 text-sm text-foreground">
                      {formatCurrency(lineTotal)}
                    </div>
                  </FieldContent>
                </Field>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-end rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Total compra
          </p>
          <p className="text-xl font-semibold text-foreground">{formatCurrency(totalCost)}</p>
        </div>
      </div>
    </FormShell>
  )
}
