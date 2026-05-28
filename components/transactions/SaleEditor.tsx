"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import SaleForm from "@/components/forms/SaleForm"
import { Button } from "@/components/ui/button"
import { salesApi, customersApi, flavorsApi, paymentMethodsApi, productsApi } from "@/lib/api/resources"
import type { Customer, Flavor, PaymentMethod, Product, Sale } from "@/lib/api/types"
import { toNumber } from "@/lib/formatters"
import type { CreateSaleInput, SaleFormOutput } from "@/lib/schemas/sale.schema"
import { useRouter } from "next/navigation"

type SaleEditorProps = {
  saleId?: number
}

function buildSalePayload(values: SaleFormOutput): CreateSaleInput {
  const items = values.items.map((item) => {
    const subtotal = toNumber(item.quantity) * toNumber(item.priceAtSale)

    return {
      productId: item.productId,
      quantity: item.quantity,
      priceAtSale: item.priceAtSale,
      subtotal,
      ...(item.flavorIds.length ? { flavorIds: item.flavorIds } : {}),
    }
  })

  return {
    paymentMethodId: values.paymentMethodId,
    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
    isCredit: values.isCredit,
    items,
    ...(values.customerId ? { customerId: values.customerId } : {}),
    ...(values.saleDate ? { saleDate: values.saleDate } : {}),
    ...(values.dueDate ? { dueDate: values.dueDate } : {}),
  }
}

function mapSaleToDefaultValues(sale: Sale): SaleFormOutput {
  return {
    customerId: sale.customerId ?? undefined,
    paymentMethodId: sale.paymentMethodId,
    isCredit: sale.isCredit,
    saleDate: sale.saleDate ? sale.saleDate.slice(0, 10) : undefined,
    dueDate: sale.accountsReceivable[0]?.dueDate
      ? sale.accountsReceivable[0].dueDate.slice(0, 10)
      : undefined,
    items: sale.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      priceAtSale: toNumber(item.priceAtSale),
      flavorIds: item.saleItemFlavors.map((saleItemFlavor) => saleItemFlavor.flavorId),
    })),
  }
}

export default function SaleEditor({ saleId }: SaleEditorProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [sale, setSale] = useState<Sale | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (saleId != null && Number.isNaN(saleId)) {
        setError("El identificador de la venta no es válido.")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const [nextCustomers, nextPaymentMethods, nextProducts, nextFlavors, nextSale] =
          await Promise.all([
            customersApi.list(),
            paymentMethodsApi.list(),
            productsApi.list(),
            flavorsApi.list(),
            saleId != null ? salesApi.getById(saleId) : Promise.resolve(null),
          ])

        if (!isMounted) {
          return
        }

        setCustomers(nextCustomers)
        setPaymentMethods(nextPaymentMethods)
        setProducts(nextProducts)
        setFlavors(nextFlavors)
        setSale(nextSale)
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar la venta.")
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
  }, [saleId])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {saleId == null ? "Nueva venta" : "Editar venta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Registra ventas con productos, sabores, pagos y crédito cuando aplique.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/ventas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ventas
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
        <SaleForm
          customers={customers.map((customer) => ({
            id: customer.id,
            name: customer.fullName,
          }))}
          paymentMethods={paymentMethods}
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            unitPrice: product.unitPrice,
          }))}
          flavors={flavors.map((flavor) => ({
            id: flavor.id,
            name: flavor.name,
          }))}
          defaultValues={sale ? mapSaleToDefaultValues(sale) : undefined}
          submitLabel={saleId == null ? "Crear venta" : "Guardar cambios"}
          title={saleId == null ? "Registrar venta" : "Actualizar venta"}
          description={
            saleId == null
              ? "Completa los datos de la venta para guardarla en el historial."
              : "Edita la venta seleccionada y sincroniza los cambios con el backend."
          }
          onSubmit={async (values) => {
            try {
              const payload = buildSalePayload(values)

              if (saleId == null) {
                await salesApi.create(payload)
                toast.success("Venta creada")
              } else {
                await salesApi.update(saleId, payload)
                toast.success("Venta actualizada")
              }

              router.push("/ventas")
            } catch (submitError) {
              toast.error(
                submitError instanceof Error ? submitError.message : "No se pudo guardar la venta.",
              )
            }
          }}
        />
      )}
    </div>
  )
}
