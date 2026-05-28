"use client"

import { useParams } from "next/navigation"

import PurchaseEditor from "@/components/transactions/PurchaseEditor"

export default function EditPurchasePage() {
  const params = useParams<{ id: string }>()
  const purchaseId = Number(params.id)

  return <PurchaseEditor purchaseId={purchaseId} />
}
