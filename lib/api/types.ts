export type DecimalValue = number | string

export type Category = {
  id: number
  name: string
  createdAt: string
}

export type Flavor = {
  id: number
  name: string
  isAvailable: boolean
  currentStockLiters: DecimalValue
}

export type PaymentMethod = {
  id: number
  name: string
}

export type Customer = {
  id: number
  taxId: string
  fullName: string
  phone?: string | null
  creditLimit: DecimalValue
  currentDebt: DecimalValue
  createdAt: string
}

export type Supplier = {
  id: number
  taxId: string
  companyName: string
  phone?: string | null
  email?: string | null
}

export type Product = {
  id: number
  categoryId: number
  name: string
  unitCost: DecimalValue
  unitPrice: DecimalValue
  currentStock: number
  trackInventory: boolean
  category?: Category
}

export type SaleItemFlavor = {
  id: number
  flavorId: number
  flavor: Flavor
}

export type SaleItem = {
  id: number
  saleId: number
  productId: number
  quantity: number
  priceAtSale: DecimalValue
  subtotal: DecimalValue
  product: Product
  saleItemFlavors: SaleItemFlavor[]
}

export type AccountsReceivable = {
  id: number
  saleId: number
  customerId: number
  originalAmount: DecimalValue
  remainingBalance: DecimalValue
  status: string
  dueDate?: string | null
}

export type Sale = {
  id: number
  customerId?: number | null
  paymentMethodId: number
  totalAmount: DecimalValue
  isCredit: boolean
  saleDate: string
  customer?: Customer | null
  paymentMethod: PaymentMethod
  items: SaleItem[]
  accountsReceivable: AccountsReceivable[]
}

export type PurchaseItem = {
  id: number
  purchaseId: number
  productId: number
  quantity: number
  costPerUnit: DecimalValue
  subtotal: DecimalValue
  product: Product
}

export type Purchase = {
  id: number
  supplierId: number
  invoiceNumber?: string | null
  totalCost: DecimalValue
  purchaseDate: string
  supplier: Supplier
  items: PurchaseItem[]
}

export type SelectOption = {
  id: number
  name: string
}
