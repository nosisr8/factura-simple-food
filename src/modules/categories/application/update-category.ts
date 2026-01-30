import { updateCategorySchema } from "@/modules/categories/application/category-schema";
import { prismaCategoryRepository } from "@/modules/categories/infra/prisma-category-repository";

export async function updateCategory(id: string, input: unknown) {
  const parsed = updateCategorySchema.parse(input);
  return prismaCategoryRepository().update(id, parsed);
}

