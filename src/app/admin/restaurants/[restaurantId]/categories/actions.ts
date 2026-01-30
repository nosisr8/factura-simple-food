"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createCategory } from "@/modules/categories/application/create-category";
import { deleteCategory } from "@/modules/categories/application/delete-category";
import { updateCategory } from "@/modules/categories/application/update-category";

type FieldErrors = Record<string, string | undefined>;
export type CategoryFormState = { error?: string; fieldErrors?: FieldErrors } | null;

function toFieldErrors(err: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function createCategoryAction(
  restaurantId: string,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    const payload = {
      restaurantId,
      name: String(formData.get("name") ?? ""),
      order: String(formData.get("order") ?? ""),
    };
    await createCategory(payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo crear la categoría." };
  }

  redirect(`/admin/restaurants/${restaurantId}/categories`);
}

export async function updateCategoryAction(
  restaurantId: string,
  categoryId: string,
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    const payload = {
      name: String(formData.get("name") ?? ""),
      order: String(formData.get("order") ?? ""),
    };
    await updateCategory(categoryId, payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo actualizar la categoría." };
  }

  redirect(`/admin/restaurants/${restaurantId}/categories`);
}

export async function deleteCategoryAction(restaurantId: string, categoryId: string) {
  await deleteCategory(categoryId);
  redirect(`/admin/restaurants/${restaurantId}/categories`);
}

export async function setCategoryOrderAction(
  restaurantId: string,
  categoryId: string,
  formData: FormData
) {
  await updateCategory(categoryId, { order: String(formData.get("order") ?? "") });
  redirect(`/admin/restaurants/${restaurantId}/categories`);
}

