"use client"

import { useParams } from "next/navigation"

import SaleEditor from "@/components/transactions/SaleEditor"

export default function EditSalePage() {
  const params = useParams<{ id: string }>()
  const saleId = Number(params.id)

  return <SaleEditor saleId={saleId} />
}
