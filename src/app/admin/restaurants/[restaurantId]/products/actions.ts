"use server";

import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { createProduct } from "@/modules/products/application/create-product";
import { deleteProduct } from "@/modules/products/application/delete-product";
import { getProductById } from "@/modules/products/application/get-product-by-id";
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
    await requirePermission("product:create");
    await requireRestaurantIdMatch(restaurantId);

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
    await requirePermission("product:update");
    await requireRestaurantIdMatch(restaurantId);
    const existing = await getProductById(productId);
    if (!existing || existing.restaurantId !== restaurantId) notFound();

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
  await requirePermission("product:delete");
  await requireRestaurantIdMatch(restaurantId);
  const existing = await getProductById(productId);
  if (!existing || existing.restaurantId !== restaurantId) notFound();

  await deleteProduct(productId);
  redirect(`/admin/restaurants/${restaurantId}/products`);
}

