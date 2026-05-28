"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CatalogManager from "@/components/crud/CatalogManager"
import FlavorForm from "@/components/forms/FlavorForm"
import { flavorsApi } from "@/lib/api/resources"
import type { Flavor } from "@/lib/api/types"
import { toNumber } from "@/lib/formatters"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<Flavor>> = [
  {
    key: "name",
    label: "Nombre",
    headerClassName: "font-semibold",
  },
  {
    key: "isAvailable",
    label: "Disponibilidad",
    render: (_, row) => (
      <span className="inline-flex rounded-full border px-2 py-1 text-xs font-medium">
        {row.isAvailable ? "Disponible" : "No disponible"}
      </span>
    ),
  },
  {
    key: "currentStockLiters",
    label: "Stock",
    hideOnMobile: true,
    render: (_, row) => `${toNumber(row.currentStockLiters).toFixed(2)} L`,
  },
]

export default function FlavorsPage() {
  const { data, isLoading, error, reload } = useResourceList(flavorsApi.list)

  return (
    <CatalogManager
      title="Sabores"
      description="Gestiona la disponibilidad y stock de sabores para ventas e inventario."
      items={data}
      isLoading={isLoading}
      error={error}
      columns={columns}
      createButtonLabel="Nuevo sabor"
      createDialogTitle="Crear sabor"
      editDialogTitle={(flavor) => `Editar sabor: ${flavor.name}`}
      onRefresh={reload}
      getRowId={(flavor) => flavor.id}
      getDeleteMessage={(flavor) => `el sabor "${flavor.name}"`}
      onDelete={async (flavor) => {
        try {
          await flavorsApi.remove(flavor.id)
          toast.success("Sabor eliminado")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el sabor.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <FlavorForm
          submitLabel="Crear sabor"
          onSubmit={async (values) => {
            try {
              await flavorsApi.create(values)
              toast.success("Sabor creado")
              close()
              await reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error ? createError.message : "No se pudo crear el sabor.",
              )
            }
          }}
        />
      )}
      renderEditForm={(flavor, close) => (
        <FlavorForm
          defaultValues={{
            name: flavor.name,
            isAvailable: flavor.isAvailable,
            currentStockLiters: toNumber(flavor.currentStockLiters),
          }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await flavorsApi.update(flavor.id, values)
              toast.success("Sabor actualizado")
              close()
              await reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error ? updateError.message : "No se pudo actualizar el sabor.",
              )
            }
          }}
        />
      )}
    />
  )
}
