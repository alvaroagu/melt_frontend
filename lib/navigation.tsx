import type { ComponentType } from "react"
import {
  BanknoteArrowUp,
  Boxes,
  HandCoins,
  LayoutDashboardIcon,
  Settings,
  ShoppingCart,
  User,
  WalletCards,
} from "lucide-react"

export interface NavigationItem {
  id: string
  name: string
  icon?: ComponentType<{ className?: string }>
  href?: string
  badge?: string
  children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
  },
  {
    id: "sales",
    name: "Ventas",
    icon: BanknoteArrowUp,
    href: "/ventas",
    children: [
      { id: "sales-history", name: "Historial de ventas", href: "/ventas" },
      { id: "sales-new", name: "Nueva venta", href: "/ventas/nueva" },
      { id: "sales-payment-methods", name: "Métodos de pago", href: "/ventas/metodos-pago" },
    ],
  },
  {
    id: "documents",
    name: "Cuentas por cobrar",
    icon: HandCoins,
    href: "/cuentas",
    children: [
      { id: "credits-pending", name: "Créditos pendientes", href: "/cuentas/facturas" },
      { id: "payment-history", name: "Historial de pagos", href: "/cuentas/balance" },
    ],
  },
  {
    id: "inventory",
    name: "Inventario",
    icon: Boxes,
    href: "/inventario/productos",
    children: [
      { id: "inventory-products", name: "Productos", href: "/inventario/productos" },
      { id: "inventory-categories", name: "Categorías", href: "/inventario/categoria" },
      { id: "inventory-flavors", name: "Sabores", href: "/inventario/sabores" },
    ],
  },
  {
    id: "purchases",
    name: "Compras / Proveedores",
    icon: ShoppingCart,
    href: "/compras_proveedores",
    children: [
      { id: "purchase-history", name: "Historial de compras", href: "/compras_proveedores" },
      { id: "purchase-new", name: "Registrar compra", href: "/compras_proveedores/nueva" },
      { id: "vendors", name: "Proveedores", href: "/compras_proveedores/proveedores" },
    ],
  },
  {
    id: "clientes",
    name: "Clientes",
    icon: User,
    href: "/clientes",
  },
  {
    id: "settings",
    name: "Configuración",
    icon: Settings,
    href: "/configuracion",
    children: [
      { id: "settings-general", name: "General", href: "/configuracion" },
      { id: "settings-payment", name: "Cobros", href: "/configuracion/cobros" },
      { id: "settings-wallet", name: "Catálogos", href: "/configuracion/catalogos", icon: WalletCards },
    ],
  },
]
