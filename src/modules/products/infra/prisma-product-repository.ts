import type { Product as PrismaProduct } from "@prisma/client";

import { db } from "@/lib/prisma";
import type { Product } from "@/modules/products/domain/product";
import type { ProductRepository } from "@/modules/products/infra/product-repository";

function toDomain(p: PrismaProduct & { menuCategory?: { name: string } }): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    ingredients: p.ingredients,
    restaurantId: p.restaurantId,
    menuCategoryId: p.menuCategoryId,
    menuCategoryName: p.menuCategory?.name,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function prismaProductRepository(): ProductRepository {
  return {
    async listByRestaurant(restaurantId, query, categoryId) {
      const q = query?.trim();
      const cat = categoryId?.trim();
      const rows = await db.product.findMany({
        where: {
          restaurantId,
          ...(cat ? { menuCategoryId: cat } : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { menuCategory: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: { menuCategory: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(toDomain);
    },
    async getById(id) {
      const row = await db.product.findUnique({
        where: { id },
        include: { menuCategory: { select: { name: true } } },
      });
      return row ? toDomain(row) : null;
    },
    async create(input) {
      const row = await db.product.create({
        data: {
          restaurantId: input.restaurantId,
          menuCategoryId: input.menuCategoryId,
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
          ingredients: input.ingredients,
        },
        include: { menuCategory: { select: { name: true } } },
      });
      return toDomain(row);
    },
    async update(id, input) {
      const row = await db.product.update({
        where: { id },
        data: {
          ...(input.restaurantId !== undefined ? { restaurantId: input.restaurantId } : {}),
          ...(input.menuCategoryId !== undefined ? { menuCategoryId: input.menuCategoryId } : {}),
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
          ...(input.price !== undefined ? { price: input.price } : {}),
          ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
          ...(input.ingredients !== undefined ? { ingredients: input.ingredients } : {}),
        },
        include: { menuCategory: { select: { name: true } } },
      });
      return toDomain(row);
    },
    async delete(id) {
      await db.product.delete({ where: { id } });
    },
  };
}

