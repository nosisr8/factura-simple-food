"use client";

import { useActionState, useMemo, useState } from "react";

import { ImageUpload } from "@/components/molecules/image-upload";
import { ImagesUpload } from "@/components/molecules/images-upload";
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
  const [storyIsActive, setStoryIsActive] = useState<boolean>(initial?.storyIsActive ?? false);
  const [storyImageUrls, setStoryImageUrls] = useState<string[]>(initial?.storyImageUrls ?? []);

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
  const storyImagesError =
    fe["storyImageUrls"] ??
    Object.entries(fe).find(([k]) => k === "storyImageUrls" || k.startsWith("storyImageUrls."))?.[1];

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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook (URL, opcional)</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={initial?.facebookUrl ?? ""}
                placeholder="https://facebook.com/..."
              />
              {fe["facebookUrl"] ? (
                <p className="text-xs text-destructive">{fe["facebookUrl"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram (URL, opcional)</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={initial?.instagramUrl ?? ""}
                placeholder="https://instagram.com/..."
              />
              {fe["instagramUrl"] ? (
                <p className="text-xs text-destructive">{fe["instagramUrl"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktokUrl">TikTok (URL, opcional)</Label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={initial?.tiktokUrl ?? ""}
                placeholder="https://tiktok.com/@..."
              />
              {fe["tiktokUrl"] ? (
                <p className="text-xs text-destructive">{fe["tiktokUrl"]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationUrl">Ubicación (URL, opcional)</Label>
              <Input
                id="locationUrl"
                name="locationUrl"
                defaultValue={initial?.locationUrl ?? ""}
                placeholder="https://maps.google.com/..."
              />
              {fe["locationUrl"] ? (
                <p className="text-xs text-destructive">{fe["locationUrl"]}</p>
              ) : null}
            </div>
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
          <input type="hidden" name="storyImageUrls" value={JSON.stringify(storyImageUrls)} />

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

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Estados (tipo Instagram)</p>
                <p className="text-xs text-muted-foreground">
                  Se muestran en la página del restaurante y avanzan automáticamente cada 15 segundos.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="storyIsActive"
                  checked={storyIsActive}
                  onChange={(e) => setStoryIsActive(e.currentTarget.checked)}
                  className="h-4 w-4 rounded border border-input"
                />
                Activo
              </label>
            </div>

            <ImagesUpload
              label="Imágenes de estados"
              folder="restaurants/stories"
              value={storyImageUrls}
              onChange={setStoryImageUrls}
              max={20}
            />
            {storyImagesError ? (
              <p className="text-xs text-destructive">{storyImagesError}</p>
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

