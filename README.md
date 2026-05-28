# Melt Frontend

Aplicación Next.js para operar las secciones de ventas, inventario, compras/proveedores y clientes.

## Requisitos

- Node.js 18+
- Backend `melt_backend` ejecutándose

## Variables de entorno

Crea un archivo `.env.local` si necesitas apuntar a una API distinta:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Si no se define, el frontend usa `http://localhost:3001` por defecto.

## Desarrollo

```bash
npm install
npm run dev
```

La aplicación se sirve por defecto en `http://localhost:3000`.

## Comandos útiles

```bash
npm run lint
npm run build
```

## Alcance actual

- Sidebar con navegación real por rutas del App Router
- CRUD con tablas y formularios para:
  - categorías
  - productos
  - sabores
  - métodos de pago
  - clientes
  - proveedores
- Flujos dedicados para ventas y compras
- Páginas placeholder para secciones fuera de esta fase (`/cuentas`, `/configuracion`)
