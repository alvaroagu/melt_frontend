"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable, { DataTableColumn, DataTableAction } from "@/components/DataTable";
import ContentLayout from "@/components/layout/ContentLayout";

// 2. Defines la estructura exacta de tus registros
interface EmpresaData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  company: string;
}

export default function Page() {
  // 3. Tus filas de datos reales
  const data: EmpresaData[] = [
    { id: 1, name: "Alvaro", email: "alvaro@example.com", role: "Admin", status: "Activo", company: "Melt" },
    { id: 2, name: "María", email: "maria@example.com", role: "Editor", status: "Pendiente", company: "Melt" },
  ];

  // 4. Configuración de columnas usando el tipo genérico de tu componente
  const columns: DataTableColumn<EmpresaData>[] = [
    {
      key: "name",
      label: "Nombre",
      headerClassName: "font-semibold"
    },
    {
      key: "email",
      label: "Correo",
      hideOnMobile: true
    },
    {
      key: "role",
      label: "Rol"
    },
    {
      key: "status",
      label: "Estado",
      // El render infiere automáticamente el tipo del valor y de la fila (row)
      render: (value) => (
        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
          {String(value)}
        </span>
      ),
    },
    {
      key: "company",
      label: "Empresa",
      hideOnMobile: true
    },
  ];

  // 5. Configuración del menú desplegable de acciones
  const actions: DataTableAction<EmpresaData>[] = [
    {
      label: "Ver detalles",
      icon: Eye,
      onSelect: (row) => console.log("Visualizando:", row.name)
    },
    {
      label: "Editar usuario",
      icon: Pencil,
      onSelect: (row) => console.log("Editando ID:", row.id)
    },
    {
      label: "Eliminar",
      icon: Trash2,
      variant: "destructive", // Aplica los estilos destructivos automáticos de shadcn
      onSelect: (row) => console.log("Eliminando registro de:", row.email),
    },
  ];

  return (
    <ContentLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal de la Empresa</h1>
          <p className="text-sm text-slate-500">Administra los accesos y roles asignados.</p>
        </div>

        {/* 6. Invocación limpia pasando las propiedades */}
        <DataTable
          data={data}
          columns={columns}
          actions={actions}
          getRowId={(row) => row.id} // Clave única para evitar problemas de renderizado de React
          emptyState="No se encontraron miembros en este equipo."
        />
      </div>
    </ContentLayout>
  );
}
