"use client"

import { z } from "zod"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import type { DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"

import FormShell from "./FormShell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, toNumber } from "@/lib/formatters"
import { saleFormSchema, type SaleFormOutput } from "@/lib/schemas/sale.schema"

type SaleFormOption = {
  id: number
  name: string
}

type SaleProductOption = SaleFormOption & {
  unitPrice?: number | string
}

type SaleFormProps = {
  customers: SaleFormOption[]
  paymentMethods: SaleFormOption[]
  products: SaleProductOption[]
  flavors: SaleFormOption[]
  defaultValues?: DefaultValues<SaleFormOutput>
  onSubmit?: (values: SaleFormOutput) => void | Promise<void>
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
    priceAtSale: 0,
    flavorIds: [],
  }
}

export default function SaleForm({
  customers,
  paymentMethods,
  products,
  flavors,
  defaultValues,
  onSubmit,
  submitLabel,
  className,
  title = "Registrar venta",
  description = "Captura los productos vendidos y la información de cobro.",
}: SaleFormProps) {
  type SaleFormValues = z.input<typeof saleFormSchema>

  const form = useForm<SaleFormValues, unknown, SaleFormOutput>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      customerId: undefined,
      paymentMethodId: undefined,
      isCredit: false,
      saleDate: "",
      dueDate: "",
      items: [createEmptyItem()],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems =
    useWatch<SaleFormValues>({
      control: form.control,
      name: "items",
    }) as SaleFormOutput["items"] | undefined
  const isCredit = useWatch<SaleFormValues>({
    control: form.control,
    name: "isCredit",
  }) as SaleFormOutput["isCredit"] | undefined
  const normalizedWatchedItems = watchedItems ?? []

  const totalAmount = normalizedWatchedItems.reduce((sum, item) => {
    return sum + toNumber(item?.quantity) * toNumber(item?.priceAtSale)
  }, 0)

  return (
    <FormShell
      title={title}
      description={description}
      submitLabel={submitLabel ?? "Guardar venta"}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="sale-customer">Cliente</FieldLabel>
          <FieldContent>
            <select
              id="sale-customer"
              className={selectClassName}
              {...form.register("customerId")}
              defaultValue={form.getValues("customerId")?.toString() ?? ""}
            >
              <option value="">Venta sin cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <FieldDescription>Obligatorio solo para ventas a crédito.</FieldDescription>
            <FieldError errors={[form.formState.errors.customerId]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sale-payment-method">Método de pago</FieldLabel>
          <FieldContent>
            <select
              id="sale-payment-method"
              className={selectClassName}
              {...form.register("paymentMethodId")}
              defaultValue={form.getValues("paymentMethodId")?.toString() ?? ""}
            >
              <option value="">Selecciona un método</option>
              {paymentMethods.map((paymentMethod) => (
                <option key={paymentMethod.id} value={paymentMethod.id}>
                  {paymentMethod.name}
                </option>
              ))}
            </select>
            <FieldError errors={[form.formState.errors.paymentMethodId]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sale-date">Fecha de venta</FieldLabel>
          <FieldContent>
            <Input id="sale-date" type="date" {...form.register("saleDate")} />
            <FieldError errors={[form.formState.errors.saleDate]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border/60 px-3 py-2.5">
              <Controller
                control={form.control}
                name="isCredit"
                render={({ field }) => (
                  <Checkbox
                    id="sale-is-credit"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <div className="space-y-1">
                <FieldLabel htmlFor="sale-is-credit">Venta a crédito</FieldLabel>
                <FieldDescription>
                  Actívala si la venta debe generar una cuenta por cobrar.
                </FieldDescription>
              </div>
            </div>
            <FieldError errors={[form.formState.errors.isCredit]} />
          </FieldContent>
        </Field>

        {isCredit ? (
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="sale-due-date">Fecha de vencimiento</FieldLabel>
            <FieldContent>
              <Input id="sale-due-date" type="date" {...form.register("dueDate")} />
              <FieldDescription>Opcional, pero útil para seguimiento del crédito.</FieldDescription>
              <FieldError errors={[form.formState.errors.dueDate]} />
            </FieldContent>
          </Field>
        ) : null}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-foreground">Productos de la venta</h3>
            <p className="text-sm text-muted-foreground">
              Agrega uno o más productos y sus sabores cuando aplique.
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
            toNumber(normalizedWatchedItems[index]?.priceAtSale)

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
                                `items.${index}.priceAtSale`,
                                toNumber(selectedProduct.unitPrice),
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
                  <FieldLabel>Precio unitario</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.priceAtSale`)}
                    />
                    <FieldError errors={[form.formState.errors.items?.[index]?.priceAtSale]} />
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

              {flavors.length > 0 ? (
                <Field>
                  <FieldLabel>Sabores asociados</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={form.control}
                      name={`items.${index}.flavorIds`}
                      render={({ field: flavorField }) => {
                        const currentValue = flavorField.value ?? []

                        return (
                          <div className="grid gap-2 md:grid-cols-2">
                            {flavors.map((flavor) => {
                              const checked = currentValue.includes(flavor.id)

                              return (
                                <label
                                  key={flavor.id}
                                  className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                                >
                                  <Checkbox
                                    checked={checked}
                                    onCheckedChange={(nextValue) => {
                                      if (nextValue === true) {
                                        flavorField.onChange([...currentValue, flavor.id])
                                        return
                                      }

                                      flavorField.onChange(
                                        currentValue.filter((value) => value !== flavor.id),
                                      )
                                    }}
                                  />
                                  <span className="text-sm text-foreground">{flavor.name}</span>
                                </label>
                              )
                            })}
                          </div>
                        )
                      }}
                    />
                    <FieldError errors={[form.formState.errors.items?.[index]?.flavorIds]} />
                  </FieldContent>
                </Field>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-end rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Total</p>
          <p className="text-xl font-semibold text-foreground">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </FormShell>
  )
}
