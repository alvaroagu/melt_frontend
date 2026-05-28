"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CatalogManager from "@/components/crud/CatalogManager"
import SupplierForm from "@/components/forms/SupplierForm"
import { suppliersApi } from "@/lib/api/resources"
import type { Supplier } from "@/lib/api/types"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<Supplier>> = [
  {
    key: "companyName",
    label: "Razón social",
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
    key: "email",
    label: "Correo",
    hideOnMobile: true,
    render: (_, row) => String(row.email ?? "-"),
  },
]

export default function SuppliersPage() {
  const { data, isLoading, error, reload } = useResourceList(suppliersApi.list)

  return (
    <CatalogManager
      title="Proveedores"
      description="Gestiona el catálogo de proveedores para registrar compras y seguimiento."
      items={data}
      isLoading={isLoading}
      error={error}
      columns={columns}
      createButtonLabel="Nuevo proveedor"
      createDialogTitle="Crear proveedor"
      editDialogTitle={(supplier) => `Editar proveedor: ${supplier.companyName}`}
      onRefresh={reload}
      getRowId={(supplier) => supplier.id}
      getDeleteMessage={(supplier) => `el proveedor "${supplier.companyName}"`}
      onDelete={async (supplier) => {
        try {
          await suppliersApi.remove(supplier.id)
          toast.success("Proveedor eliminado")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el proveedor.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <SupplierForm
          submitLabel="Crear proveedor"
          onSubmit={async (values) => {
            try {
              await suppliersApi.create(values)
              toast.success("Proveedor creado")
              close()
              await reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error ? createError.message : "No se pudo crear el proveedor.",
              )
            }
          }}
        />
      )}
      renderEditForm={(supplier, close) => (
        <SupplierForm
          defaultValues={{
            taxId: supplier.taxId,
            companyName: supplier.companyName,
            phone: supplier.phone ?? "",
            email: supplier.email ?? "",
          }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await suppliersApi.update(supplier.id, values)
              toast.success("Proveedor actualizado")
              close()
              await reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error
                  ? updateError.message
                  : "No se pudo actualizar el proveedor.",
              )
            }
          }}
        />
      )}
    />
  )
}
