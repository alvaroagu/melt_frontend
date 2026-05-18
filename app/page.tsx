import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Bienvenido
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edita la página y comienza a construir tu interfaz.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
          Contenido
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
          Contenido
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
          Contenido
        </div>
      </section>
    </div>
  );
}
