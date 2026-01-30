import { createCategorySchema } from "@/modules/categories/application/category-schema";
import { prismaCategoryRepository } from "@/modules/categories/infra/prisma-category-repository";

export async function createCategory(input: unknown) {
  const parsed = createCategorySchema.parse(input);
  return prismaCategoryRepository().create(parsed);
}

