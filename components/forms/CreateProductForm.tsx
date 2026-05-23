"use client"

import React, { useState } from 'react'
import { z } from 'zod'
import { createProductSchema, type CreateProductInput } from '@/lib/schemas/product.schema'
import FormField from './FormField'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreateProductForm() {
  const [values, setValues] = useState({
    categoryId: '',
    name: '',
    unitCost: '0',
    unitPrice: '0',
    currentStock: '0',
    trackInventory: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    const payload = {
      categoryId: Number(values.categoryId),
      name: values.name,
      unitCost: Number(values.unitCost),
      unitPrice: Number(values.unitPrice),
      currentStock: Number(values.currentStock),
      trackInventory: Boolean(values.trackInventory),
    }

    try {
      const parsed = createProductSchema.parse(payload)
      // TODO: call server action / API to persist parsed data
      console.log('Validated product', parsed)
      alert('Producto validado (demo): ' + parsed.name)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const map: Record<string, string> = {}
        err.errors.forEach((e) => {
          const key = (e.path && e.path[0]) || 'form'
          map[String(key)] = e.message
        })
        setErrors(map)
      } else {
        setErrors({ form: 'Error inesperado' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-md p-4 shadow-sm">
      <FormField label="Nombre" htmlFor="name" error={errors.name}>
        <Input id="name" name="name" value={values.name} onChange={handleChange} />
      </FormField>

      <FormField label="Categoría (id)" htmlFor="categoryId" error={errors.categoryId}>
        <Input id="categoryId" name="categoryId" value={values.categoryId} onChange={handleChange} />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Costo unitario" htmlFor="unitCost" error={errors.unitCost}>
          <Input id="unitCost" name="unitCost" type="number" step="0.01" value={values.unitCost} onChange={handleChange} />
        </FormField>

        <FormField label="Precio unitario" htmlFor="unitPrice" error={errors.unitPrice}>
          <Input id="unitPrice" name="unitPrice" type="number" step="0.01" value={values.unitPrice} onChange={handleChange} />
        </FormField>

        <FormField label="Stock" htmlFor="currentStock" error={errors.currentStock}>
          <Input id="currentStock" name="currentStock" type="number" step="1" value={values.currentStock} onChange={handleChange} />
        </FormField>
      </div>

      <div className="flex items-center justify-end mt-4">
        <Button type="submit" disabled={submitting}>{submitting ? 'Guardando...' : 'Crear producto'}</Button>
      </div>
    </form>
  )
}
