"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  createPaymentMethodSchema,
  type CreatePaymentMethodInput,
} from "@/lib/schemas/payment-method.schema"

type PaymentMethodFormProps = {
  defaultValues?: DefaultValues<CreatePaymentMethodInput>
  onSubmit?: (values: CreatePaymentMethodInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function PaymentMethodForm({
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: PaymentMethodFormProps) {
  type PaymentMethodFormValues = z.input<typeof createPaymentMethodSchema>
  type PaymentMethodFormOutput = z.output<typeof createPaymentMethodSchema>

  const form = useForm<PaymentMethodFormValues, unknown, PaymentMethodFormOutput>({
    resolver: zodResolver(createPaymentMethodSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  })

  return (
    <FormShell
      title="Crear método de pago"
      description="Registra métodos de pago para ventas y cobros."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="payment-method-name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="payment-method-name"
            placeholder="Ej. Efectivo"
            {...form.register("name")}
          />
          <FieldDescription>Debe ser corto y fácil de identificar.</FieldDescription>
          <FieldError errors={[form.formState.errors.name]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
