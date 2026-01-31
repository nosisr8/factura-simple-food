import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/helpers/format-currency";
import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { listCategoriesByRestaurant } from "@/modules/categories/application/list-categories-by-restaurant";
import { listProductsByRestaurant } from "@/modules/products/application/list-products-by-restaurant";

import { deleteProductAction } from "./actions";

export default async function ProductsPage(props: {
  params: Promise<{ restaurantId: string }>;
  searchParams?: Promise<{ q?: string; categoryId?: string }>;
}) {
  const { restaurantId } = await props.params;
  const sp = await props.searchParams;
  const q = (sp?.q ?? "").trim();
  const categoryId = (sp?.categoryId ?? "").trim();

  await requirePermission("product:read");
  const { ctx, restaurant } = await requireRestaurantIdMatch(restaurantId);

  const [categories, products] = await Promise.all([
    listCategoriesByRestaurant(restaurantId),
    listProductsByRestaurant(restaurantId, {
      q: q || undefined,
      categoryId: categoryId || undefined,
    }),
  ]);
  const basePath = `/admin/restaurants/${restaurantId}/products`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description={`Restaurante: ${restaurant.name}`}
        actions={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <form action={basePath} method="get" className="flex items-end gap-2">
              <div className="space-y-1">
                <Label htmlFor="q" className="text-xs">
                  Buscar
                </Label>
                <Input
                  id="q"
                  name="q"
                  placeholder="Nombre, descripción..."
                  defaultValue={q}
                  className="h-9 w-[220px]"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="categoryId" className="text-xs">
                  Categoría
                </Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={categoryId}
                  className="flex h-9 w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="outline" size="sm">
                Filtrar
              </Button>

              {q || categoryId ? (
                <Button asChild variant="ghost" size="sm">
                  <Link href={basePath}>Limpiar</Link>
                </Button>
              ) : null}
            </form>
            {ctx.permissions.has("product:create") ? (
              <Button asChild>
                <Link href={`/admin/restaurants/${restaurantId}/products/new`}>Nuevo</Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="space-y-3">
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No hay productos.
            </CardContent>
          </Card>
        ) : null}

        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.menuCategoryName ? `${p.menuCategoryName} · ` : ""}
                    {formatCurrency(p.price)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ctx.permissions.has("product:update") ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/restaurants/${restaurantId}/products/${p.id}/edit`}>
                      Editar
                    </Link>
                  </Button>
                ) : null}
                {ctx.permissions.has("product:delete") ? (
                  <form action={deleteProductAction.bind(null, restaurantId, p.id)}>
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

