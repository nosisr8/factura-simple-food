"use client";

import { useActionState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/modules/categories/domain/category";

import {
  type CategoryFormState,
  createCategoryAction,
  updateCategoryAction,
} from "./actions";

type Mode = "create" | "edit";

export function CategoryForm(props: {
  mode: Mode;
  restaurantId: string;
  category?: Category;
}) {
  const initial = props.category;

  const action = useMemo<
    (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>
  >(() => {
    if (props.mode === "edit") {
      const categoryId = props.category?.id;
      if (!categoryId) throw new Error("Falta category.id");
      return updateCategoryAction.bind(null, props.restaurantId, categoryId);
    }
    return createCategoryAction.bind(null, props.restaurantId);
  }, [props.mode, props.restaurantId, props.category?.id]);

  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(action, null);
  const fe = state?.fieldErrors ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.mode === "create" ? "Nueva categoría" : "Editar categoría"}</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={initial?.name ?? ""} required />
            {fe["name"] ? <p className="text-xs text-destructive">{fe["name"]}</p> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

