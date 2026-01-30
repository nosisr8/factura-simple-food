import { PageHeader } from "@/components/organisms/page-header";

import { CategoryForm } from "../category-form";

export default async function NewCategoryPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;

  return (
    <div className="space-y-6">
      <PageHeader title="Nueva categoría" />
      <CategoryForm mode="create" restaurantId={restaurantId} />
    </div>
  );
}

