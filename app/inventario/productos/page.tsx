"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CatalogManager from "@/components/crud/CatalogManager"
import ProductForm from "@/components/forms/ProductForm"
import { categoriesApi, productsApi } from "@/lib/api/resources"
import type { Product } from "@/lib/api/types"
import { formatCurrency, toNumber } from "@/lib/formatters"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<Product>> = [
  {
    key: "name",
    label: "Producto",
    headerClassName: "font-semibold",
  },
  {
    key: "categoryId",
    label: "Categoría",
    render: (_, row) => row.category?.name ?? "Sin categoría",
  },
  {
    key: "unitPrice",
    label: "Precio",
    render: (_, row) => formatCurrency(row.unitPrice),
  },
  {
    key: "currentStock",
    label: "Stock",
    hideOnMobile: true,
  },
  {
    key: "trackInventory",
    label: "Inventario",
    hideOnMobile: true,
    render: (_, row) => (row.trackInventory ? "Sí" : "No"),
  },
]

export default function ProductsPage() {
  const products = useResourceList(productsApi.list)
  const categories = useResourceList(categoriesApi.list)

  const categoryOptions = categories.data.map((category) => ({
    id: category.id,
    name: category.name,
  }))

  return (
    <CatalogManager
      title="Productos"
      description="Administra productos con su categoría, precio y control de inventario."
      items={products.data}
      isLoading={products.isLoading || categories.isLoading}
      error={products.error ?? categories.error}
      columns={columns}
      createButtonLabel="Nuevo producto"
      createDialogTitle="Crear producto"
      editDialogTitle={(product) => `Editar producto: ${product.name}`}
      onRefresh={async () => {
        await Promise.all([products.reload(), categories.reload()])
      }}
      getRowId={(product) => product.id}
      getDeleteMessage={(product) => `el producto "${product.name}"`}
      onDelete={async (product) => {
        try {
          await productsApi.remove(product.id)
          toast.success("Producto eliminado")
          await products.reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar el producto.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <ProductForm
          categories={categoryOptions}
          submitLabel="Crear producto"
          onSubmit={async (values) => {
            try {
              await productsApi.create(values)
              toast.success("Producto creado")
              close()
              await products.reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error ? createError.message : "No se pudo crear el producto.",
              )
            }
          }}
        />
      )}
      renderEditForm={(product, close) => (
        <ProductForm
          categories={categoryOptions}
          defaultValues={{
            categoryId: product.categoryId,
            name: product.name,
            unitCost: toNumber(product.unitCost),
            unitPrice: toNumber(product.unitPrice),
            currentStock: product.currentStock,
            trackInventory: product.trackInventory,
          }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await productsApi.update(product.id, values)
              toast.success("Producto actualizado")
              close()
              await products.reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error ? updateError.message : "No se pudo actualizar el producto.",
              )
            }
          }}
        />
      )}
    />
  )
}
