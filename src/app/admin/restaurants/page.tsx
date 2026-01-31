import Image from "next/image";
import Link from "next/link";

import { AdminSearch } from "@/components/molecules/admin-search";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRestaurantFromMetadataOrNull, requirePermission } from "@/modules/admin/rbac";

import { deleteRestaurantAction } from "./actions";

export default async function AdminRestaurantsPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = await props.searchParams;
  const q = (sp?.q ?? "").trim();

  const [assignment, ctx] = await Promise.all([
    getRestaurantFromMetadataOrNull(),
    requirePermission("restaurant:read"),
  ]);

  if (!assignment.restaurant) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Restaurantes"
          description="Falta asignar un restaurante para administrar."
        />
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Tu usuario no esta configurado. Contacta con el administrador.
          </CardContent>
        </Card>
      </div>
    );
  }

  const restaurant = assignment.restaurant;

  const restaurants = [restaurant].filter((r) => {
    if (!q) return true;
    const query = q.toLowerCase();
    return r.name.toLowerCase().includes(query) || r.slug.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurantes"
        description="Crear, editar y eliminar restaurantes."
        actions={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <AdminSearch
              action="/admin/restaurants"
              q={q}
              placeholder="Buscar por nombre o slug..."
            />
            {ctx.permissions.has("restaurant:create") ? (
              <Button asChild>
                <Link href="/admin/restaurants/new">Nuevo</Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="space-y-3">
        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No hay restaurantes cargados.
            </CardContent>
          </Card>
        ) : null}

        {restaurants.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={r.avatarImageUrl}
                    alt={r.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-muted-foreground">/{r.slug}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ctx.permissions.has("restaurant:update") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/restaurants/${r.id}/edit`}>Editar</Link>
                  </Button>
                ) : null}

                {ctx.permissions.has("category:read") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/restaurants/${r.id}/categories`}>Categorías</Link>
                  </Button>
                ) : null}

                {ctx.permissions.has("product:read") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/restaurants/${r.id}/products`}>Productos</Link>
                  </Button>
                ) : null}

                {ctx.permissions.has("restaurant:update") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/restaurants/${r.id}/hours`}>Horarios</Link>
                  </Button>
                ) : null}

                {ctx.permissions.has("restaurant:delete") ? (
                  <form action={deleteRestaurantAction.bind(null, r.id)}>
                    <Button type="submit" variant="destructive" size="sm">
                      Eliminar
                    </Button>
                  </form>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

