"use client"

import Link from "next/link"
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import DataTable, { type DataTableAction, type DataTableColumn } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { purchasesApi } from "@/lib/api/resources"
import type { Purchase } from "@/lib/api/types"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { useResourceList } from "@/hooks/useResourceList"
import { useRouter } from "next/navigation"

const columns: Array<DataTableColumn<Purchase>> = [
  {
    key: "id",
    label: "Folio",
    headerClassName: "font-semibold",
    render: (_, row) => `#${row.id}`,
  },
  {
    key: "supplierId",
    label: "Proveedor",
    render: (_, row) => row.supplier.companyName,
  },
  {
    key: "invoiceNumber",
    label: "Factura",
    hideOnMobile: true,
    render: (_, row) => String(row.invoiceNumber ?? "-"),
  },
  {
    key: "totalCost",
    label: "Total",
    render: (_, row) => formatCurrency(row.totalCost),
  },
  {
    key: "purchaseDate",
    label: "Fecha",
    hideOnMobile: true,
    render: (_, row) => formatDate(row.purchaseDate),
  },
]

export default function PurchasesPage() {
  const router = useRouter()
  const { data, isLoading, error, reload } = useResourceList(purchasesApi.list)

  const actions: Array<DataTableAction<Purchase>> = [
    {
      label: "Editar",
      icon: Pencil,
      onSelect: (purchase) => router.push(`/compras_proveedores/${purchase.id}/editar`),
    },
    {
      label: "Eliminar",
      icon: Trash2,
      variant: "destructive",
      onSelect: async (purchase) => {
        if (!window.confirm(`¿Seguro que deseas eliminar la compra #${purchase.id}?`)) {
          return
        }

        try {
          await purchasesApi.remove(purchase.id)
          toast.success("Compra eliminada")
          await reload()
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la compra.",
          )
        }
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Compras / Proveedores
          </h1>
          <p className="text-sm text-muted-foreground">
            Revisa el historial de compras y crea nuevas capturas enlazadas al catálogo.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar
          </Button>
          <Button asChild>
            <Link href="/compras_proveedores/nueva">
              <Plus className="mr-2 h-4 w-4" />
              Registrar compra
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
          Cargando compras...
        </div>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          getRowId={(purchase) => purchase.id}
          emptyState="No hay compras registradas todavía."
        />
      )}
    </div>
  )
}
