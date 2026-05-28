"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import PurchaseForm from "@/components/forms/PurchaseForm"
import { Button } from "@/components/ui/button"
import { productsApi, purchasesApi, suppliersApi } from "@/lib/api/resources"
import type { Product, Purchase, Supplier } from "@/lib/api/types"
import { toNumber } from "@/lib/formatters"
import type { CreatePurchaseInput, PurchaseFormOutput } from "@/lib/schemas/purchase.schema"
import { useRouter } from "next/navigation"

type PurchaseEditorProps = {
  purchaseId?: number
}

function buildPurchasePayload(values: PurchaseFormOutput): CreatePurchaseInput {
  const items = values.items.map((item) => {
    const subtotal = toNumber(item.quantity) * toNumber(item.costPerUnit)

    return {
      productId: item.productId,
      quantity: item.quantity,
      costPerUnit: item.costPerUnit,
      subtotal,
    }
  })

  return {
    supplierId: values.supplierId,
    totalCost: items.reduce((sum, item) => sum + item.subtotal, 0),
    items,
    ...(values.invoiceNumber ? { invoiceNumber: values.invoiceNumber } : {}),
    ...(values.purchaseDate ? { purchaseDate: values.purchaseDate } : {}),
  }
}

function mapPurchaseToDefaultValues(purchase: Purchase): PurchaseFormOutput {
  return {
    supplierId: purchase.supplierId,
    invoiceNumber: purchase.invoiceNumber ?? undefined,
    purchaseDate: purchase.purchaseDate ? purchase.purchaseDate.slice(0, 10) : undefined,
    items: purchase.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      costPerUnit: toNumber(item.costPerUnit),
    })),
  }
}

export default function PurchaseEditor({ purchaseId }: PurchaseEditorProps) {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (purchaseId != null && Number.isNaN(purchaseId)) {
        setError("El identificador de la compra no es válido.")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const [nextSuppliers, nextProducts, nextPurchase] = await Promise.all([
          suppliersApi.list(),
          productsApi.list(),
          purchaseId != null ? purchasesApi.getById(purchaseId) : Promise.resolve(null),
        ])

        if (!isMounted) {
          return
        }

        setSuppliers(nextSuppliers)
        setProducts(nextProducts)
        setPurchase(nextPurchase)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la compra.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [purchaseId])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {purchaseId == null ? "Nueva compra" : "Editar compra"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Registra compras y sincroniza sus ítems con el backend.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/compras_proveedores">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a compras
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-border/70 bg-card/95 px-4 py-10 text-center text-sm text-muted-foreground">
          Cargando formulario...
        </div>
      ) : (
        <PurchaseForm
          suppliers={suppliers.map((supplier) => ({
            id: supplier.id,
            name: supplier.companyName,
          }))}
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            unitCost: product.unitCost,
          }))}
          defaultValues={purchase ? mapPurchaseToDefaultValues(purchase) : undefined}
          submitLabel={purchaseId == null ? "Crear compra" : "Guardar cambios"}
          title={purchaseId == null ? "Registrar compra" : "Actualizar compra"}
          description={
            purchaseId == null
              ? "Completa la compra con sus productos y costos unitarios."
              : "Edita la compra seleccionada y actualiza sus ítems asociados."
          }
          onSubmit={async (values) => {
            try {
              const payload = buildPurchasePayload(values)

              if (purchaseId == null) {
                await purchasesApi.create(payload)
                toast.success("Compra creada")
              } else {
                await purchasesApi.update(purchaseId, payload)
                toast.success("Compra actualizada")
              }

              router.push("/compras_proveedores")
            } catch (submitError) {
              toast.error(
                submitError instanceof Error
                  ? submitError.message
                  : "No se pudo guardar la compra.",
              )
            }
          }}
        />
      )}
    </div>
  )
}
