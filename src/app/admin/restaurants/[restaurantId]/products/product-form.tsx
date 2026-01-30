"use client";

import { useActionState, useMemo, useState } from "react";

import { ImageUpload } from "@/components/molecules/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/modules/categories/domain/category";
import type { Product } from "@/modules/products/domain/product";

import {
  createProductAction,
  type ProductFormState,
  updateProductAction,
} from "./actions";

type Mode = "create" | "edit";

export function ProductForm(props: {
  mode: Mode;
  restaurantId: string;
  categories: Category[];
  product?: Product;
}) {
  const initial = props.product;

  const [imageUrl, setImageUrl] = useState<string>(initial?.imageUrl ?? "");

  const action = useMemo<
    (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>
  >(() => {
    if (props.mode === "edit") {
      const productId = props.product?.id;
      if (!productId) throw new Error("Falta product.id");
      return updateProductAction.bind(null, props.restaurantId, productId);
    }
    return createProductAction.bind(null, props.restaurantId);
  }, [props.mode, props.restaurantId, props.product?.id]);

  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, null);
  const fe = state?.fieldErrors ?? {};

  const ingredientsText = (initial?.ingredients ?? []).join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.mode === "create" ? "Nuevo producto" : "Editar producto"}</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={initial?.name ?? ""} required />
              {fe["name"] ? <p className="text-xs text-destructive">{fe["name"]}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={initial?.price ?? 0}
                required
              />
              {fe["price"] ? <p className="text-xs text-destructive">{fe["price"]}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
            />
            {fe["description"] ? (
              <p className="text-xs text-destructive">{fe["description"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="menuCategoryId">Categoría</Label>
            <select
              id="menuCategoryId"
              name="menuCategoryId"
              defaultValue={initial?.menuCategoryId ?? props.categories[0]?.id ?? ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              {props.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {props.categories.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No hay categorías. Creá una categoría primero.
              </p>
            ) : null}
            {fe["menuCategoryId"] ? (
              <p className="text-xs text-destructive">{fe["menuCategoryId"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredientes (separados por coma)</Label>
            <Input id="ingredients" name="ingredients" defaultValue={ingredientsText} />
            {fe["ingredients"] ? (
              <p className="text-xs text-destructive">{fe["ingredients"]}</p>
            ) : null}
          </div>

          <input type="hidden" name="imageUrl" value={imageUrl} />
          <ImageUpload
            label="Imagen del producto"
            folder="products"
            value={imageUrl}
            onChange={setImageUrl}
          />
          {fe["imageUrl"] ? <p className="text-xs text-destructive">{fe["imageUrl"]}</p> : null}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={pending || props.categories.length === 0}>
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

