import type { Restaurant as PrismaRestaurant } from "@prisma/client";

import { db } from "@/lib/prisma";
import type { Restaurant } from "@/modules/restaurants/domain/restaurant";
import type { RestaurantRepository } from "@/modules/restaurants/infra/restaurant-repository";

function toDomain(r: PrismaRestaurant): Restaurant {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    avatarImageUrl: r.avatarImageUrl,
    coverImageUrl: r.coverImageUrl,
    catalogOnly: r.catalogOnly,
    whatsappUrl: r.whatsappUrl ?? null,
    facebookUrl: r.facebookUrl ?? null,
    instagramUrl: r.instagramUrl ?? null,
    tiktokUrl: r.tiktokUrl ?? null,
    locationUrl: r.locationUrl ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function prismaRestaurantRepository(): RestaurantRepository {
  return {
    async list(query) {
      const q = query?.trim();
      const rows = await db.restaurant.findMany({
        where: q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { slug: { contains: q, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    },
    async getById(id) {
      const row = await db.restaurant.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    },
    async create(input) {
      const row = await db.restaurant.create({
        data: {
          name: input.name,
          slug: input.slug,
          description: input.description,
          avatarImageUrl: input.avatarImageUrl,
          coverImageUrl: input.coverImageUrl,
          catalogOnly: input.catalogOnly ?? false,
          whatsappUrl: input.whatsappUrl ?? null,
          facebookUrl: input.facebookUrl ?? null,
          instagramUrl: input.instagramUrl ?? null,
          tiktokUrl: input.tiktokUrl ?? null,
          locationUrl: input.locationUrl ?? null,
        },
      });
      return toDomain(row);
    },
    async update(id, input) {
      const row = await db.restaurant.update({
        where: { id },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.slug !== undefined ? { slug: input.slug } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.avatarImageUrl !== undefined
            ? { avatarImageUrl: input.avatarImageUrl }
            : {}),
          ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
          ...(input.catalogOnly !== undefined ? { catalogOnly: input.catalogOnly } : {}),
          ...(input.whatsappUrl !== undefined ? { whatsappUrl: input.whatsappUrl } : {}),
          ...(input.facebookUrl !== undefined ? { facebookUrl: input.facebookUrl } : {}),
          ...(input.instagramUrl !== undefined ? { instagramUrl: input.instagramUrl } : {}),
          ...(input.tiktokUrl !== undefined ? { tiktokUrl: input.tiktokUrl } : {}),
          ...(input.locationUrl !== undefined ? { locationUrl: input.locationUrl } : {}),
        },
      });
      return toDomain(row);
    },
    async delete(id) {
      await db.restaurant.delete({ where: { id } });
    },
  };
}

