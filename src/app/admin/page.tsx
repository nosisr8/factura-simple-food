import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión de restaurantes, categorías y productos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <Link href="/admin/restaurants" className="underline underline-offset-4">
            Ir a Restaurantes
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

