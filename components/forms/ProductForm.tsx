"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createProductSchema, type CreateProductInput } from "@/lib/schemas/product.schema"

export type ProductCategoryOption = {
  id: number
  name: string
}

type ProductFormProps = {
  categories?: ProductCategoryOption[]
  defaultValues?: DefaultValues<CreateProductInput>
  onSubmit?: (values: CreateProductInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function ProductForm({
  categories = [],
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: ProductFormProps) {
  type ProductFormValues = z.input<typeof createProductSchema>
  type ProductFormOutput = z.output<typeof createProductSchema>

  const form = useForm<ProductFormValues, unknown, ProductFormOutput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      categoryId: undefined,
      name: "",
      unitCost: 0,
      unitPrice: 0,
      currentStock: 0,
      trackInventory: true,
      ...defaultValues,
    },
  })

  const hasCategories = categories.length > 0

  return (
    <FormShell
      title="Crear producto"
      description="Define la información base y el comportamiento de inventario del producto."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="product-name">Nombre</FieldLabel>
        <FieldContent>
          <Input id="product-name" placeholder="Ej. Refresco" {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-category">Categoría</FieldLabel>
        <FieldContent>
          {hasCategories ? (
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Combobox
                  value={field.value != null ? String(field.value) : null}
                  onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                >
                  <ComboboxInput id="product-category" placeholder="Busca una categoría" />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxEmpty>No hay coincidencias.</ComboboxEmpty>
                      {categories.map((category) => (
                        <ComboboxItem
                          key={category.id}
                          value={String(category.id)}
                          onClick={() => field.onChange(category.id)}
                        >
                          {category.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
          ) : (
            <Input
              id="product-category"
              type="number"
              min="1"
              placeholder="ID de categoría"
              {...form.register("categoryId")}
            />
          )}
          <FieldDescription>
            {hasCategories
              ? "Selecciona una categoría disponible."
              : "Mientras conectamos datos, ingresa el ID de la categoría."}
          </FieldDescription>
          <FieldError errors={[form.formState.errors.categoryId]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-unit-cost">Costo unitario</FieldLabel>
        <FieldContent>
          <Input
            id="product-unit-cost"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("unitCost")}
          />
          <FieldError errors={[form.formState.errors.unitCost]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-unit-price">Precio unitario</FieldLabel>
        <FieldContent>
          <Input
            id="product-unit-price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("unitPrice")}
          />
          <FieldError errors={[form.formState.errors.unitPrice]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="product-current-stock">Stock actual</FieldLabel>
        <FieldContent>
          <Input
            id="product-current-stock"
            type="number"
            step="1"
            min="0"
            placeholder="0"
            {...form.register("currentStock")}
          />
          <FieldError errors={[form.formState.errors.currentStock]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <Controller
              control={form.control}
              name="trackInventory"
              render={({ field }) => (
                <Checkbox
                  id="product-track-inventory"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <div className="space-y-1">
              <FieldLabel htmlFor="product-track-inventory">Controlar inventario</FieldLabel>
              <FieldDescription>
                Desactívalo para productos que no deban descontar stock.
              </FieldDescription>
            </div>
          </div>
          <FieldError errors={[form.formState.errors.trackInventory]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
