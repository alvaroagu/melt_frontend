"use client"

import type { Key, ReactNode } from "react"
import { useMemo, useState } from "react"
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react"

import DataTable, { type DataTableColumn } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type CatalogManagerProps<T extends object> = {
  title: string
  description: string
  items: T[]
  isLoading: boolean
  error: string | null
  columns: Array<DataTableColumn<T>>
  emptyState?: ReactNode
  createButtonLabel: string
  createDialogTitle: string
  editDialogTitle: (item: T) => string
  onRefresh: () => Promise<void> | void
  onDelete: (item: T) => Promise<void>
  getDeleteMessage?: (item: T) => string
  getRowId?: (row: T, index: number) => Key
  renderCreateForm: (close: () => void) => ReactNode
  renderEditForm: (item: T, close: () => void) => ReactNode
}

export function CatalogManager<T extends object>({
  title,
  description,
  items,
  isLoading,
  error,
  columns,
  emptyState,
  createButtonLabel,
  createDialogTitle,
  editDialogTitle,
  onRefresh,
  onDelete,
  getDeleteMessage,
  getRowId,
  renderCreateForm,
  renderEditForm,
}: CatalogManagerProps<T>) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const actions = useMemo(
    () => [
      {
        label: "Editar",
        icon: Pencil,
        onSelect: (item: T) => setEditingItem(item),
      },
      {
        label: "Eliminar",
        icon: Trash2,
        variant: "destructive" as const,
        disabled: isDeleting,
        onSelect: async (item: T) => {
          const deleteMessage =
            getDeleteMessage?.(item) ?? "este registro"

          if (!window.confirm(`¿Seguro que deseas eliminar ${deleteMessage}?`)) {
            return
          }

          setIsDeleting(true)

          try {
            await onDelete(item)
          } finally {
            setIsDeleting(false)
          }
        },
      },
    ],
    [getDeleteMessage, isDeleting, onDelete],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void onRefresh()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recargar
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {createButtonLabel}
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
          Cargando información...
        </div>
      ) : (
        <DataTable
          data={items}
          columns={columns}
          actions={actions}
          getRowId={getRowId}
          emptyState={emptyState}
        />
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{createDialogTitle}</DialogTitle>
          </DialogHeader>
          {renderCreateForm(() => setIsCreateOpen(false))}
        </DialogContent>
      </Dialog>

      <Dialog open={editingItem != null} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? editDialogTitle(editingItem) : "Editar"}</DialogTitle>
          </DialogHeader>
          {editingItem ? renderEditForm(editingItem, () => setEditingItem(null)) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CatalogManager
