import type { MenuCategory as PrismaMenuCategory } from "@prisma/client";

import { db } from "@/lib/prisma";
import type { Category } from "@/modules/categories/domain/category";
import type { CategoryRepository } from "@/modules/categories/infra/category-repository";

function toDomain(c: PrismaMenuCategory): Category {
  return {
    id: c.id,
    name: c.name,
    restaurantId: c.restaurantId,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export function prismaCategoryRepository(): CategoryRepository {
  return {
    async listByRestaurant(restaurantId, query) {
      const q = query?.trim();
      const rows = await db.menuCategory.findMany({
        where: {
          restaurantId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    },
    async getById(id) {
      const row = await db.menuCategory.findUnique({ where: { id } });
      return row ? toDomain(row) : null;
    },
    async create(input) {
      const row = await db.menuCategory.create({
        data: { name: input.name, restaurantId: input.restaurantId },
      });
      return toDomain(row);
    },
    async update(id, input) {
      const row = await db.menuCategory.update({
        where: { id },
        data: { ...(input.name !== undefined ? { name: input.name } : {}) },
      });
      return toDomain(row);
    },
    async delete(id) {
      await db.menuCategory.delete({ where: { id } });
    },
  };
}

