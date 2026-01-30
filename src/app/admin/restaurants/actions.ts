"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

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
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
      catalogOnly: formData.get("catalogOnly") === "on",
      whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
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
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
      avatarImageUrl: String(formData.get("avatarImageUrl") ?? ""),
      coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
      catalogOnly: formData.get("catalogOnly") === "on",
      whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
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
  await deleteRestaurant(restaurantId);
  redirect("/admin/restaurants");
}

