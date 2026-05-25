"use client"

import { z } from "zod"
import type { DefaultValues } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import FormShell from "./FormShell"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createCategorySchema, type CreateCategoryInput } from "@/lib/schemas/category.schema"

type CategoryFormProps = {
  defaultValues?: DefaultValues<CreateCategoryInput>
  onSubmit?: (values: CreateCategoryInput) => void | Promise<void>
  submitLabel?: string
  className?: string
}

export default function CategoryForm({
  defaultValues,
  onSubmit,
  submitLabel,
  className,
}: CategoryFormProps) {
  type CategoryFormValues = z.input<typeof createCategorySchema>
  type CategoryFormOutput = z.output<typeof createCategorySchema>

  const form = useForm<CategoryFormValues, unknown, CategoryFormOutput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  })

  return (
    <FormShell
      title="Crear categoría"
      description="Registra una categoría para clasificar productos."
      submitLabel={submitLabel}
      isSubmitting={form.formState.isSubmitting}
      className={className}
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit?.(values)
      })}
    >
      <Field>
        <FieldLabel htmlFor="category-name">Nombre</FieldLabel>
        <FieldContent>
          <Input id="category-name" placeholder="Ej. Bebidas" {...form.register("name")} />
          <FieldDescription>Usa un nombre corto y reconocible.</FieldDescription>
          <FieldError errors={[form.formState.errors.name]} />
        </FieldContent>
      </Field>
    </FormShell>
  )
}
