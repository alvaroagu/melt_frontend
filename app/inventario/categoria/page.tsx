"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CategoryForm from "@/components/forms/CategoryForm"
import CatalogManager from "@/components/crud/CatalogManager"
import { categoriesApi } from "@/lib/api/resources"
import type { Category } from "@/lib/api/types"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<Category>> = [
  {
    key: "name",
    label: "Nombre",
    headerClassName: "font-semibold",
  },
  {
    key: "createdAt",
    label: "Creada",
    hideOnMobile: true,
    render: (_, row) => new Intl.DateTimeFormat("es-MX").format(new Date(row.createdAt)),
  },
]

export default function CategoriesPage() {
  const { data, isLoading, error, reload } = useResourceList(categoriesApi.list)

  return (
    <CatalogManager
      title="Categorías"
      description="Administra las categorías que organizan los productos del inventario."
      items={data}
      isLoading={isLoading}
      error={error}
      columns={columns}
      createButtonLabel="Nueva categoría"
      createDialogTitle="Crear categoría"
      editDialogTitle={(category) => `Editar categoría: ${category.name}`}
      onRefresh={reload}
      getRowId={(category) => category.id}
      getDeleteMessage={(category) => `la categoría "${category.name}"`}
      onDelete={async (category) => {
        try {
          await categoriesApi.remove(category.id)
          toast.success("Categoría eliminada")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la categoría.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <CategoryForm
          submitLabel="Crear categoría"
          onSubmit={async (values) => {
            try {
              await categoriesApi.create(values)
              toast.success("Categoría creada")
              close()
              await reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error ? createError.message : "No se pudo crear la categoría.",
              )
            }
          }}
        />
      )}
      renderEditForm={(category, close) => (
        <CategoryForm
          defaultValues={{ name: category.name }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await categoriesApi.update(category.id, values)
              toast.success("Categoría actualizada")
              close()
              await reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error
                  ? updateError.message
                  : "No se pudo actualizar la categoría.",
              )
            }
          }}
        />
      )}
    />
  )
}
