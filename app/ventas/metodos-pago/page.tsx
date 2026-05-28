"use client"

import { toast } from "sonner"

import type { DataTableColumn } from "@/components/DataTable"
import CatalogManager from "@/components/crud/CatalogManager"
import PaymentMethodForm from "@/components/forms/PaymentMethodForm"
import { paymentMethodsApi } from "@/lib/api/resources"
import type { PaymentMethod } from "@/lib/api/types"
import { useResourceList } from "@/hooks/useResourceList"

const columns: Array<DataTableColumn<PaymentMethod>> = [
  {
    key: "name",
    label: "Nombre",
    headerClassName: "font-semibold",
  },
]

export default function PaymentMethodsPage() {
  const { data, isLoading, error, reload } = useResourceList(paymentMethodsApi.list)

  return (
    <CatalogManager
      title="Métodos de pago"
      description="Mantén actualizado el catálogo de métodos usados en ventas y cobros."
      items={data}
      isLoading={isLoading}
      error={error}
      columns={columns}
      createButtonLabel="Nuevo método"
      createDialogTitle="Crear método de pago"
      editDialogTitle={(paymentMethod) => `Editar método: ${paymentMethod.name}`}
      onRefresh={reload}
      getRowId={(paymentMethod) => paymentMethod.id}
      getDeleteMessage={(paymentMethod) => `el método "${paymentMethod.name}"`}
      onDelete={async (paymentMethod) => {
        try {
          await paymentMethodsApi.remove(paymentMethod.id)
          toast.success("Método de pago eliminado")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error
              ? deleteError.message
              : "No se pudo eliminar el método de pago.",
          )
        }
      }}
      renderCreateForm={(close) => (
        <PaymentMethodForm
          submitLabel="Crear método"
          onSubmit={async (values) => {
            try {
              await paymentMethodsApi.create(values)
              toast.success("Método de pago creado")
              close()
              await reload()
            } catch (createError) {
              toast.error(
                createError instanceof Error
                  ? createError.message
                  : "No se pudo crear el método de pago.",
              )
            }
          }}
        />
      )}
      renderEditForm={(paymentMethod, close) => (
        <PaymentMethodForm
          defaultValues={{ name: paymentMethod.name }}
          submitLabel="Guardar cambios"
          onSubmit={async (values) => {
            try {
              await paymentMethodsApi.update(paymentMethod.id, values)
              toast.success("Método de pago actualizado")
              close()
              await reload()
            } catch (updateError) {
              toast.error(
                updateError instanceof Error
                  ? updateError.message
                  : "No se pudo actualizar el método de pago.",
              )
            }
          }}
        />
      )}
    />
  )
}
