import { prismaCategoryRepository } from "@/modules/categories/infra/prisma-category-repository";

export async function getCategoryById(id: string) {
  return prismaCategoryRepository().getById(id);
}

