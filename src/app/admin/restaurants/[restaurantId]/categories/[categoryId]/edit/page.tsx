import { notFound } from "next/navigation";

import { PageHeader } from "@/components/organisms/page-header";
import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { getCategoryById } from "@/modules/categories/application/get-category-by-id";

import { CategoryForm } from "../../category-form";

export default async function EditCategoryPage(props: {
  params: Promise<{ restaurantId: string; categoryId: string }>;
}) {
  const { restaurantId, categoryId } = await props.params;
  await requirePermission("category:update");
  await requireRestaurantIdMatch(restaurantId);

  const category = await getCategoryById(categoryId);
  if (!category) notFound();
  if (category.restaurantId !== restaurantId) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Editar categoría" description={category.name} />
      <CategoryForm mode="edit" restaurantId={restaurantId} category={category} />
    </div>
  );
}

