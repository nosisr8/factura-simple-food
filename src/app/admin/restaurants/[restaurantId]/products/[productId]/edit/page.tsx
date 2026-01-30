import { notFound } from "next/navigation";

import { PageHeader } from "@/components/organisms/page-header";
import { listCategoriesByRestaurant } from "@/modules/categories/application/list-categories-by-restaurant";
import { getProductById } from "@/modules/products/application/get-product-by-id";

import { ProductForm } from "../../product-form";

export default async function EditProductPage(props: {
  params: Promise<{ restaurantId: string; productId: string }>;
}) {
  const { restaurantId, productId } = await props.params;
  const [product, categories] = await Promise.all([
    getProductById(productId),
    listCategoriesByRestaurant(restaurantId),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Editar producto" description={product.name} />
      <ProductForm
        mode="edit"
        restaurantId={restaurantId}
        categories={categories}
        product={product}
      />
    </div>
  );
}

