"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createCustomerSchema, type CreateCustomerInput } from "@/lib/schemas/customer.schema"

type CustomerFormProps = {
  defaultValues?: DefaultValues<CreateCustomerInput>
  onSubmit?: (values: CreateCustomerInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: CustomerFormProps) {
  type CustomerFormValues = z.input<typeof createCustomerSchema>
  type CustomerFormOutput = z.output<typeof createCustomerSchema>

  const form = useForm<CustomerFormValues, unknown, CustomerFormOutput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      taxId: "",
      fullName: "",
      phone: "",
      creditLimit: 0,
      currentDebt: 0,
      ...defaultValues,
    },
  })

  return (
    <FormShell
      title="Crear cliente"
      description="Captura la información fiscal y el estado de crédito del cliente."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="customer-tax-id">RFC / NIT</FieldLabel>
        <FieldContent>
          <Input id="customer-tax-id" maxLength={20} {...form.register("taxId")} />
          <FieldDescription>Debe ser único dentro del sistema.</FieldDescription>
          <FieldError errors={[form.formState.errors.taxId]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="customer-full-name">Nombre completo</FieldLabel>
        <FieldContent>
          <Input
            id="customer-full-name"
            placeholder="Ej. Juan Pérez"
            {...form.register("fullName")}
          />
          <FieldError errors={[form.formState.errors.fullName]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="customer-phone">Teléfono</FieldLabel>
        <FieldContent>
          <Input id="customer-phone" maxLength={20} {...form.register("phone")} />
          <FieldDescription>Campo opcional.</FieldDescription>
          <FieldError errors={[form.formState.errors.phone]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="customer-credit-limit">Límite de crédito</FieldLabel>
        <FieldContent>
          <Input
            id="customer-credit-limit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("creditLimit")}
          />
          <FieldError errors={[form.formState.errors.creditLimit]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="customer-current-debt">Deuda actual</FieldLabel>
        <FieldContent>
          <Input
            id="customer-current-debt"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("currentDebt")}
          />
          <FieldError errors={[form.formState.errors.currentDebt]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
