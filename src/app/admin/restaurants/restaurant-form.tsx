"use client";

import { useActionState, useMemo, useState } from "react";

import { ImageUpload } from "@/components/molecules/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Restaurant } from "@/modules/restaurants/domain/restaurant";

import {
  createRestaurantAction,
  type RestaurantFormState,
  updateRestaurantAction,
} from "./actions";

type Mode = "create" | "edit";

export function RestaurantForm(props: {
  mode: Mode;
  restaurant?: Restaurant;
}) {
  const initial = props.restaurant;

  const [avatarImageUrl, setAvatarImageUrl] = useState<string>(initial?.avatarImageUrl ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string>(initial?.coverImageUrl ?? "");

  const action = useMemo<
    (prevState: RestaurantFormState, formData: FormData) => Promise<RestaurantFormState>
  >(() => {
    if (props.mode === "edit") {
      const id = props.restaurant?.id;
      if (!id) throw new Error("Falta restaurant.id");
      return updateRestaurantAction.bind(null, id);
    }
    return createRestaurantAction;
  }, [props.mode, props.restaurant?.id]);

  const [state, formAction, pending] = useActionState<RestaurantFormState, FormData>(
    action,
    null
  );

  const fe = state?.fieldErrors ?? {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.mode === "create" ? "Nuevo restaurante" : "Editar restaurante"}</CardTitle>
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
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={initial?.slug ?? ""}
                placeholder="tios-food-garden"
                required
              />
              {fe["slug"] ? <p className="text-xs text-destructive">{fe["slug"]}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
              required
            />
            {fe["description"] ? (
              <p className="text-xs text-destructive">{fe["description"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappUrl">WhatsApp (URL, opcional)</Label>
            <Input
              id="whatsappUrl"
              name="whatsappUrl"
              defaultValue={initial?.whatsappUrl ?? ""}
              placeholder="https://wa.me/5959..."
            />
            {fe["whatsappUrl"] ? (
              <p className="text-xs text-destructive">{fe["whatsappUrl"]}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Modo</Label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="catalogOnly"
                defaultChecked={initial?.catalogOnly ?? false}
                className="h-4 w-4 rounded border border-input"
              />
              Solo catálogo (no mostrar carrito/pedidos)
            </label>
            {fe["catalogOnly"] ? (
              <p className="text-xs text-destructive">{fe["catalogOnly"]}</p>
            ) : null}
          </div>

          <input type="hidden" name="avatarImageUrl" value={avatarImageUrl} />
          <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload
              label="Avatar"
              folder="restaurants/avatars"
              value={avatarImageUrl}
              onChange={setAvatarImageUrl}
            />
            {fe["avatarImageUrl"] ? (
              <p className="text-xs text-destructive">{fe["avatarImageUrl"]}</p>
            ) : null}

            <ImageUpload
              label="Cover"
              folder="restaurants/covers"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
            />
            {fe["coverImageUrl"] ? (
              <p className="text-xs text-destructive">{fe["coverImageUrl"]}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

