"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getAdminContext, requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { createRestaurant } from "@/modules/restaurants/application/create-restaurant";
import { deleteRestaurant } from "@/modules/restaurants/application/delete-restaurant";
import { updateRestaurant } from "@/modules/restaurants/application/update-restaurant";

type FieldErrors = Record<string, string | undefined>;
export type RestaurantFormState = { error?: string; fieldErrors?: FieldErrors } | null;

function toFieldErrors(err: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createRestaurantAction(
  _prev: RestaurantFormState,
  formData: FormData
): Promise<RestaurantFormState> {
  try {
    await requirePermission("restaurant:create");
    const ctx = await getAdminContext();
    // Un admin "scoped" por restaurant_slug no puede crear restaurantes.
    if (ctx.restaurantSlug) notFound();

    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
      catalogOnly: formData.get("catalogOnly") === "on",
      whatsappUrl: String(formData.get("whatsappUrl") ?? "") || null,
      facebookUrl: String(formData.get("facebookUrl") ?? "") || null,
      instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
      tiktokUrl: String(formData.get("tiktokUrl") ?? "") || null,
      locationUrl: String(formData.get("locationUrl") ?? "") || null,
    };
    await createRestaurant(payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo crear el restaurante." };
  }

  redirect("/admin/restaurants");
}

export async function updateRestaurantAction(
  restaurantId: string,
  _prev: RestaurantFormState,
  formData: FormData
): Promise<RestaurantFormState> {
  try {
    await requirePermission("restaurant:update");
    await requireRestaurantIdMatch(restaurantId);

    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
      catalogOnly: formData.get("catalogOnly") === "on",
      whatsappUrl: String(formData.get("whatsappUrl") ?? "") || null,
      facebookUrl: String(formData.get("facebookUrl") ?? "") || null,
      instagramUrl: String(formData.get("instagramUrl") ?? "") || null,
      tiktokUrl: String(formData.get("tiktokUrl") ?? "") || null,
      locationUrl: String(formData.get("locationUrl") ?? "") || null,
    };
    await updateRestaurant(restaurantId, payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo actualizar el restaurante." };
  }

  redirect("/admin/restaurants");
}

export async function deleteRestaurantAction(restaurantId: string) {
  await requirePermission("restaurant:delete");
  await requireRestaurantIdMatch(restaurantId);
  await deleteRestaurant(restaurantId);
  redirect("/admin/restaurants");
}

