import { PageHeader } from "@/components/organisms/page-header";
import { listCategoriesByRestaurant } from "@/modules/categories/application/list-categories-by-restaurant";

import { ProductForm } from "../product-form";

export default async function NewProductPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;
  const categories = await listCategoriesByRestaurant(restaurantId);

  return (
    <div className="space-y-6">
      <PageHeader title="Nuevo producto" />
      <ProductForm mode="create" restaurantId={restaurantId} categories={categories} />
    </div>
  );
}

