import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ComingSoonPageProps = {
  title: string
  description: string
}

export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta sección queda fuera de la primera fase del plan actual. La navegación ya está preparada
            para que pueda integrarse en una iteración posterior.
          </p>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <Link href="/dashboard">Volver al dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
