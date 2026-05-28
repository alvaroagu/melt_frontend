import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "Ventas",
    description: "Consulta el historial de ventas, registra nuevas operaciones y gestiona métodos de pago.",
    href: "/ventas",
    cta: "Ir a ventas",
  },
  {
    title: "Inventario",
    description: "Administra productos, categorías y sabores desde tablas conectadas a la API.",
    href: "/inventario/productos",
    cta: "Ver inventario",
  },
  {
    title: "Compras / Proveedores",
    description: "Registra compras y mantén el catálogo de proveedores centralizado.",
    href: "/compras_proveedores",
    cta: "Ver compras",
  },
  {
    title: "Clientes",
    description: "Consulta clientes y opera su CRUD desde formularios modales.",
    href: "/clientes",
    cta: "Ver clientes",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Panel principal
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Usa el menú lateral para navegar por los módulos conectados al backend de Melt.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.href}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
              <CardAction>
                <Button asChild size="sm">
                  <Link href={section.href}>{section.cta}</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta primera fase cubre CRUD reales, tablas reutilizables y formularios integrados con la API.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
