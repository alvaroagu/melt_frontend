import ContentLayout from '@/components/layout/ContentLayout'
import CreateProductForm from '@/components/forms/CreateProductForm'

export default function Page() {
  return (
    <ContentLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Crear producto</h1>
        <CreateProductForm />
      </div>
    </ContentLayout>
  )
}
