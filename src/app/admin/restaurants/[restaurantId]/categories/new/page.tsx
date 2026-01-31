import { PageHeader } from "@/components/organisms/page-header";
import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";

import { CategoryForm } from "../category-form";

export default async function NewCategoryPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;
  await requirePermission("category:create");
  await requireRestaurantIdMatch(restaurantId);

  return (
    <div className="space-y-6">
      <PageHeader title="Nueva categoría" />
      <CategoryForm mode="create" restaurantId={restaurantId} />
    </div>
  );
}

