import type { CreateCategoryInput } from "@/lib/schemas/category.schema"
import type { CreateCustomerInput } from "@/lib/schemas/customer.schema"
import type { CreateFlavorInput } from "@/lib/schemas/flavor.schema"
import type { CreatePaymentMethodInput } from "@/lib/schemas/payment-method.schema"
import type { CreateProductInput } from "@/lib/schemas/product.schema"
import type { CreatePurchaseInput } from "@/lib/schemas/purchase.schema"
import type { CreateSaleInput } from "@/lib/schemas/sale.schema"
import type { CreateSupplierInput } from "@/lib/schemas/supplier.schema"

import { apiDelete, apiGet, apiPatch, apiPost } from "./client"
import type {
  AuthSessionResponse,
  AuthUser,
  Category,
  Customer,
  Flavor,
  PaymentMethod,
  Product,
  LogoutResponse,
  Purchase,
  Sale,
  Supplier,
} from "./types"

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiPost<AuthSessionResponse>("/auth/login", data),
  refresh: () => apiPost<AuthSessionResponse>("/auth/refresh"),
  logout: () => apiPost<LogoutResponse>("/auth/logout"),
  me: () => apiGet<AuthUser>("/auth/me"),
}

export const categoriesApi = {
  list: () => apiGet<Category[]>("/categories"),
  create: (data: CreateCategoryInput) => apiPost<Category>("/categories", data),
  update: (id: number, data: CreateCategoryInput) => apiPatch<Category>(`/categories/${id}`, data),
  remove: (id: number) => apiDelete(`/categories/${id}`),
}

export const flavorsApi = {
  list: () => apiGet<Flavor[]>("/flavors"),
  create: (data: CreateFlavorInput) => apiPost<Flavor>("/flavors", data),
  update: (id: number, data: CreateFlavorInput) => apiPatch<Flavor>(`/flavors/${id}`, data),
  remove: (id: number) => apiDelete(`/flavors/${id}`),
}

export const paymentMethodsApi = {
  list: () => apiGet<PaymentMethod[]>("/payment-methods"),
  create: (data: CreatePaymentMethodInput) =>
    apiPost<PaymentMethod>("/payment-methods", data),
  update: (id: number, data: CreatePaymentMethodInput) =>
    apiPatch<PaymentMethod>(`/payment-methods/${id}`, data),
  remove: (id: number) => apiDelete(`/payment-methods/${id}`),
}

export const customersApi = {
  list: () => apiGet<Customer[]>("/customers"),
  create: (data: CreateCustomerInput) => apiPost<Customer>("/customers", data),
  update: (id: number, data: CreateCustomerInput) => apiPatch<Customer>(`/customers/${id}`, data),
  remove: (id: number) => apiDelete(`/customers/${id}`),
}

export const suppliersApi = {
  list: () => apiGet<Supplier[]>("/suppliers"),
  create: (data: CreateSupplierInput) => apiPost<Supplier>("/suppliers", data),
  update: (id: number, data: CreateSupplierInput) => apiPatch<Supplier>(`/suppliers/${id}`, data),
  remove: (id: number) => apiDelete(`/suppliers/${id}`),
}

export const productsApi = {
  list: () => apiGet<Product[]>("/products"),
  create: (data: CreateProductInput) => apiPost<Product>("/products", data),
  update: (id: number, data: CreateProductInput) => apiPatch<Product>(`/products/${id}`, data),
  remove: (id: number) => apiDelete(`/products/${id}`),
}

export const salesApi = {
  list: () => apiGet<Sale[]>("/sales"),
  getById: (id: number) => apiGet<Sale>(`/sales/${id}`),
  create: (data: CreateSaleInput) => apiPost<Sale>("/sales", data),
  update: (id: number, data: CreateSaleInput) => apiPatch<Sale>(`/sales/${id}`, data),
  remove: (id: number) => apiDelete(`/sales/${id}`),
}

export const purchasesApi = {
  list: () => apiGet<Purchase[]>("/purchases"),
  getById: (id: number) => apiGet<Purchase>(`/purchases/${id}`),
  create: (data: CreatePurchaseInput) => apiPost<Purchase>("/purchases", data),
  update: (id: number, data: CreatePurchaseInput) =>
    apiPatch<Purchase>(`/purchases/${id}`, data),
  remove: (id: number) => apiDelete(`/purchases/${id}`),
}
