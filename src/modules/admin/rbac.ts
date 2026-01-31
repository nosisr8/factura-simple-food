import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { cache } from "react";
import { notFound } from "next/navigation";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";

export type RestaurantPermission =
  | "restaurant:read"
  | "restaurant:update"
  | "restaurant:delete"
  | "category:create"
  | "category:read"
  | "category:update"
  | "category:delete"
  | "product:create"
  | "product:read"
  | "product:update"
  | "product:delete"
  | (string & {});

type AdminMetadataShape = Partial<{
  role: string;
  administrador: string;
  restaurant_slug: string;
  restaurant_permissions: string[];
}>;

function asAdminMetadataShape(value: unknown): AdminMetadataShape {
  if (!value || typeof value !== "object") return {};
  return value as AdminMetadataShape;
}

export type AdminContext = {
  userId: string;
  role?: string;
  administrador?: string;
  restaurantSlug?: string;
  permissions: Set<string>;
};

export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const { userId } = await auth();
  if (!userId) {
    // Igual el middleware ya protege, pero mantenemos defensa en profundidad.
    throw new Error("Admin RBAC: userId ausente (no autenticado).");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Asumimos que lo guardás en publicMetadata, pero si lo estás usando en otro
  // lugar, podemos extender esto a privateMetadata / unsafeMetadata.
  const md = asAdminMetadataShape(user.publicMetadata);

  const perms = new Set<string>((md.restaurant_permissions ?? []).filter(Boolean));

  return {
    userId,
    role: md.role,
    administrador: md.administrador,
    restaurantSlug: md.restaurant_slug,
    permissions: perms,
  };
});

export async function requirePermission(permission: RestaurantPermission | RestaurantPermission[]) {
  const ctx = await getAdminContext();
  const required = Array.isArray(permission) ? permission : [permission];
  const ok = required.every((p) => ctx.permissions.has(p));
  if (!ok) {
    // No filtramos información: tratamos como 404.
    notFound();
  }
  return ctx;
}

export async function requireRestaurantFromMetadata() {
  const ctx = await getAdminContext();
  if (!ctx.restaurantSlug) {
    notFound();
  }

  const restaurant = await getRestaurantBySlug(ctx.restaurantSlug);
  if (!restaurant) {
    notFound();
  }

  return { ctx, restaurant };
}

export async function getRestaurantFromMetadataOrNull() {
  type RestaurantFromSlug = Awaited<ReturnType<typeof getRestaurantBySlug>>;

  const ctx = await getAdminContext();
  if (!ctx.restaurantSlug) {
    return { ctx, restaurant: null as RestaurantFromSlug };
  }

  const restaurant = await getRestaurantBySlug(ctx.restaurantSlug);
  if (!restaurant) {
    return { ctx, restaurant: null as RestaurantFromSlug };
  }

  return { ctx, restaurant };
}

/**
 * Para admins "scoped" por restaurant_slug: valida que el restaurantId de la URL
 * coincida con el restaurant asignado en metadata.
 */
export async function requireRestaurantIdMatch(restaurantId: string) {
  const { ctx, restaurant } = await requireRestaurantFromMetadata();
  if (restaurant.id !== restaurantId) {
    notFound();
  }
  return { ctx, restaurant };
}

