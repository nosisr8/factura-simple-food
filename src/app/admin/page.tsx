import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantFromMetadataOrNull, requirePermission } from "@/modules/admin/rbac";

export default async function AdminHomePage() {
  await requirePermission("restaurant:read");
  const { restaurant } = await getRestaurantFromMetadataOrNull();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Panel de administración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión de restaurante, categorías y productos.
        </p>
        {restaurant ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Restaurante asignado: <span className="font-medium">{restaurant.name}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-destructive">
            Falta asignar un restaurante para administrar.
          </p>
        )}
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

