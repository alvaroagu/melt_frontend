"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createSupplierSchema, type CreateSupplierInput } from "@/lib/schemas/supplier.schema"

type SupplierFormProps = {
  defaultValues?: DefaultValues<CreateSupplierInput>
  onSubmit?: (values: CreateSupplierInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function SupplierForm({
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: SupplierFormProps) {
  type SupplierFormValues = z.input<typeof createSupplierSchema>
  type SupplierFormOutput = z.output<typeof createSupplierSchema>

  const form = useForm<SupplierFormValues, unknown, SupplierFormOutput>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      taxId: "",
      companyName: "",
      phone: "",
      email: "",
      ...defaultValues,
    },
  })

  return (
    <FormShell
      title="Crear proveedor"
      description="Registra proveedores con sus datos de contacto."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="supplier-tax-id">RFC / NIT</FieldLabel>
        <FieldContent>
          <Input id="supplier-tax-id" maxLength={20} {...form.register("taxId")} />
          <FieldError errors={[form.formState.errors.taxId]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="supplier-company-name">Razón social</FieldLabel>
        <FieldContent>
          <Input
            id="supplier-company-name"
            placeholder="Ej. Alimentos del Norte"
            {...form.register("companyName")}
          />
          <FieldError errors={[form.formState.errors.companyName]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="supplier-phone">Teléfono</FieldLabel>
        <FieldContent>
          <Input id="supplier-phone" maxLength={20} {...form.register("phone")} />
          <FieldDescription>Campo opcional.</FieldDescription>
          <FieldError errors={[form.formState.errors.phone]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="supplier-email">Correo electrónico</FieldLabel>
        <FieldContent>
          <Input
            id="supplier-email"
            type="email"
            maxLength={100}
            placeholder="proveedor@correo.com"
            {...form.register("email")}
          />
          <FieldDescription>Campo opcional.</FieldDescription>
          <FieldError errors={[form.formState.errors.email]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
