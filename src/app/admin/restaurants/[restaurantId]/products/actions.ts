"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createProduct } from "@/modules/products/application/create-product";
import { deleteProduct } from "@/modules/products/application/delete-product";
import { updateProduct } from "@/modules/products/application/update-product";

type FieldErrors = Record<string, string | undefined>;
export type ProductFormState = { error?: string; fieldErrors?: FieldErrors } | null;

function toFieldErrors(err: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function parseIngredients(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProductAction(
  restaurantId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    const payload = {
      restaurantId,
      menuCategoryId: String(formData.get("menuCategoryId") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: String(formData.get("price") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      ingredients: parseIngredients(String(formData.get("ingredients") ?? "")),
    };
    await createProduct(payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo crear el producto." };
  }

  redirect(`/admin/restaurants/${restaurantId}/products`);
}

export async function updateProductAction(
  restaurantId: string,
  productId: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    const payload = {
      restaurantId,
      menuCategoryId: String(formData.get("menuCategoryId") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: String(formData.get("price") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      ingredients: parseIngredients(String(formData.get("ingredients") ?? "")),
    };
    await updateProduct(productId, payload);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { fieldErrors: toFieldErrors(e), error: "Revisá los campos." };
    }
    return { error: "No se pudo actualizar el producto." };
  }

  redirect(`/admin/restaurants/${restaurantId}/products`);
}

export async function deleteProductAction(restaurantId: string, productId: string) {
  await deleteProduct(productId);
  redirect(`/admin/restaurants/${restaurantId}/products`);
}

