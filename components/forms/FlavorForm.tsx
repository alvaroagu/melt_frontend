"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createFlavorSchema, type CreateFlavorInput } from "@/lib/schemas/flavor.schema"

type FlavorFormProps = {
  defaultValues?: DefaultValues<CreateFlavorInput>
  onSubmit?: (values: CreateFlavorInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function FlavorForm({
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: FlavorFormProps) {
  type FlavorFormValues = z.input<typeof createFlavorSchema>
  type FlavorFormOutput = z.output<typeof createFlavorSchema>

  const form = useForm<FlavorFormValues, unknown, FlavorFormOutput>({
    resolver: zodResolver(createFlavorSchema),
    defaultValues: {
      name: "",
      isAvailable: true,
      currentStockLiters: 0,
      ...defaultValues,
    },
  })

  return (
    <FormShell
      title="Crear sabor"
      description="Administra los sabores disponibles y su stock actual."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="flavor-name">Nombre</FieldLabel>
        <FieldContent>
          <Input id="flavor-name" placeholder="Ej. Fresa" {...form.register("name")} />
          <FieldDescription>Se mostrará en ventas y controles de inventario.</FieldDescription>
          <FieldError errors={[form.formState.errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldContent className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border/60 px-3 py-2.5">
            <Controller
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <Checkbox
                  id="flavor-is-available"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <div className="space-y-1">
              <FieldLabel htmlFor="flavor-is-available">Disponible</FieldLabel>
              <FieldDescription>Desmarca este sabor si no debe venderse.</FieldDescription>
            </div>
          </div>
          <FieldError errors={[form.formState.errors.isAvailable]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="flavor-current-stock-liters">Stock actual (litros)</FieldLabel>
        <FieldContent>
          <Input
            id="flavor-current-stock-liters"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("currentStockLiters")}
          />
          <FieldDescription>Usa valores decimales cuando aplique.</FieldDescription>
          <FieldError errors={[form.formState.errors.currentStockLiters]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
