"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CatalogManager from "@/components/crud/CatalogManager"
import CustomerForm from "@/components/forms/CustomerForm"
import { customersApi } from "@/lib/api/resources"
import type { Customer } from "@/lib/api/types"
import { formatCurrency, toNumber } from "@/lib/formatters"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<Customer>> = [
  {
    key: "fullName",
    label: "Cliente",
    headerClassName: "font-semibold",
  },
  {
    key: "taxId",
    label: "RFC / NIT",
  },
  {
    key: "phone",
    label: "Teléfono",
    hideOnMobile: true,
    render: (_, row) => String(row.phone ?? "-"),
  },
  {
    key: "creditLimit",
    label: "Límite",
    hideOnMobile: true,
    render: (_, row) => formatCurrency(row.creditLimit),
  },
  {
    key: "currentDebt",
    label: "Deuda",
    render: (_, row) => formatCurrency(row.currentDebt),
  },
]

export default function CustomersPage() {
  const { data, isLoading, error, reload } = useResourceList(customersApi.list)

  return (
    <CatalogManager
      title="Clientes"
      description="Administra clientes y su estado de crédito desde un solo módulo."
      items={data}
      isLoading={isLoading}
      error={error}
      columns={columns}
      createButtonLabel="Nuevo cliente"
      createDialogTitle="Crear cliente"
      editDialogTitle={(customer) => `Editar cliente: ${customer.fullName}`}
      onRefresh={reload}
      getRowId={(customer) => customer.id}
      getDeleteMessage={(customer) => `el cliente "${customer.fullName}"`}
      onDelete={async (customer) => {
        try {
          await customersApi.remove(customer.id)
          toast.success("Cliente eliminado")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el cliente.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <CustomerForm
          submitLabel="Crear cliente"
          onSubmit={async (values) => {
            try {
              await customersApi.create(values)
              toast.success("Cliente creado")
              close()
              await reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error ? createError.message : "No se pudo crear el cliente.",
              )
            }
          }}
        />
      )}
      renderEditForm={(customer, close) => (
        <CustomerForm
          defaultValues={{
            taxId: customer.taxId,
            fullName: customer.fullName,
            phone: customer.phone ?? "",
            creditLimit: toNumber(customer.creditLimit),
            currentDebt: toNumber(customer.currentDebt),
          }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await customersApi.update(customer.id, values)
              toast.success("Cliente actualizado")
              close()
              await reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error
                  ? updateError.message
                  : "No se pudo actualizar el cliente.",
              )
            }
          }}
        />
      )}
    />
  )
}
