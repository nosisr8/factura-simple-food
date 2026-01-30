import Link from "next/link";

import { AdminSearch } from "@/components/molecules/admin-search";
import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listCategoriesByRestaurant } from "@/modules/categories/application/list-categories-by-restaurant";
import { getRestaurantById } from "@/modules/restaurants/application/get-restaurant-by-id";

import { deleteCategoryAction, setCategoryOrderAction } from "./actions";

export default async function CategoriesPage(props: {
  params: Promise<{ restaurantId: string }>;
  searchParams?: Promise<{ q?: string }>;
}) {
  const { restaurantId } = await props.params;
  const sp = await props.searchParams;
  const q = (sp?.q ?? "").trim();

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Restaurante no encontrado.
        </CardContent>
      </Card>
    );
  }

  const categories = await listCategoriesByRestaurant(restaurantId, q || undefined);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías"
        description={`Restaurante: ${restaurant.name}`}
        actions={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <AdminSearch
              action={`/admin/restaurants/${restaurantId}/categories`}
              q={q}
              placeholder="Buscar categoría..."
            />
            <Button asChild>
              <Link href={`/admin/restaurants/${restaurantId}/categories/new`}>Nueva</Link>
            </Button>
          </div>
        }
      />

      <div className="space-y-3">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No hay categorías.
            </CardContent>
          </Card>
        ) : null}

        {categories.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">Orden: {c.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <form
                  action={setCategoryOrderAction.bind(null, restaurantId, c.id)}
                  className="hidden items-end gap-2 sm:flex"
                >
                  <div className="space-y-1">
                    <Label htmlFor={`order-${c.id}`} className="text-xs">
                      Orden
                    </Label>
                    <Input
                      id={`order-${c.id}`}
                      name="order"
                      type="number"
                      defaultValue={c.order}
                      className="h-9 w-[90px]"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">
                    Guardar
                  </Button>
                </form>

                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/admin/restaurants/${restaurantId}/categories/${c.id}/edit`}
                  >
                    Editar
                  </Link>
                </Button>
                <form action={deleteCategoryAction.bind(null, restaurantId, c.id)}>
                  <Button type="submit" variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

