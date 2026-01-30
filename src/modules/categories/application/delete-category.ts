import { prismaCategoryRepository } from "@/modules/categories/infra/prisma-category-repository";

export async function deleteCategory(id: string) {
  await prismaCategoryRepository().delete(id);
}

