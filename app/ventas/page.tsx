"use client"

import Link from "next/link"
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import DataTable, { type DataTableAction, type DataTableColumn } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { salesApi } from "@/lib/api/resources"
import type { Sale } from "@/lib/api/types"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { useResourceList } from "@/hooks/useResourceList"
import { useRouter } from "next/navigation"

const columns: Array<DataTableColumn<Sale>> = [
  {
    key: "id",
    label: "Folio",
    headerClassName: "font-semibold",
    render: (_, row) => `#${row.id}`,
  },
  {
    key: "customerId",
    label: "Cliente",
    render: (_, row) => row.customer?.fullName ?? "Consumidor final",
  },
  {
    key: "paymentMethodId",
    label: "Pago",
    hideOnMobile: true,
    render: (_, row) => row.paymentMethod.name,
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (_, row) => formatCurrency(row.totalAmount),
  },
  {
    key: "saleDate",
    label: "Fecha",
    hideOnMobile: true,
    render: (_, row) => formatDate(row.saleDate),
  },
  {
    key: "isCredit",
    label: "Tipo",
    render: (_, row) => (row.isCredit ? "Crédito" : "Contado"),
  },
]

export default function SalesPage() {
  const router = useRouter()
  const { data, isLoading, error, reload } = useResourceList(salesApi.list)

  const actions: Array<DataTableAction<Sale>> = [
    {
      label: "Editar",
      icon: Pencil,
      onSelect: (sale) => router.push(`/ventas/${sale.id}/editar`),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      variant: "destructive",
      onSelect: async (sale) => {
        if (!window.confirm(`¿Seguro que deseas eliminar la venta #${sale.id}?`)) {
          return
        }

        try {
          await salesApi.remove(sale.id)
          toast.success("Venta eliminada")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la venta.",
          )
        }
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Ventas</h1>
          <p className="text-sm text-muted-foreground">
            Consulta el historial de ventas y navega a la captura completa.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar
          </Button>
          <Button asChild>
            <Link href="/ventas/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Nueva venta
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-border/70 bg-card/95 px-4 py-10 text-center text-sm text-muted-foreground">
          Cargando ventas...
        </div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          getRowId={(sale) => sale.id}
          emptyState="No hay ventas registradas todavía."
        />
      )}
    </div>
  )
}
