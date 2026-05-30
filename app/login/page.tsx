"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Ingresa un correo válido.").max(100),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values)
      toast.success("Sesión iniciada.")
      router.replace("/dashboard")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo iniciar sesión."
      form.setError("root", { message })
      toast.error(message)
    }
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Melt
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Accede al panel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa tus credenciales iniciales para entrar al backend y al frontend protegidos.
          </p>
        </div>

        <Card className="border-border/70 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>
              La sesión se mantiene con cookies HTTP-only y se renueva automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="alvaro@melt.local"
                    className="pl-10"
                    aria-invalid={!!form.formState.errors.email}
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-10 pr-11"
                    aria-invalid={!!form.formState.errors.password}
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {form.formState.errors.password ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              {form.formState.errors.root ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                <LogIn className={cn("size-4", form.formState.isSubmitting && "animate-pulse")} />
                {form.formState.isSubmitting ? "Ingresando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
