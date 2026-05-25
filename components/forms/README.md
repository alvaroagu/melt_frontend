DialogForm — Uso

Este archivo muestra un ejemplo de uso del componente DialogForm con ProductForm.

Ejemplo (JSX):

```tsx
import DialogForm from "@/components/forms/DialogForm"
import ProductForm from "@/components/forms/ProductForm"
import { Button } from "@/components/ui/button"

export default function NewProductButton({ categories }) {
  return (
    <DialogForm
      Form={ProductForm}
      formProps={{ categories, onSubmit: async (values) => { /* manejar submit */ } }}
      trigger={<Button>Nuevo producto</Button>}
      title="Crear producto"
      description="Define la información base y el comportamiento de inventario del producto."
      closeOnSubmit={true}
    />
  )
}
```

Notas:
- Se recomienda controlar el diálogo desde un componente padre pasando `open` y `onOpenChange` cuando se necesite coordinación más fina.
- El ejemplo usa `closeOnSubmit: true` para cerrar el diálogo tras un submit exitoso.
