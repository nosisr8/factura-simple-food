import { PageHeader } from "@/components/organisms/page-header";
import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";

import { RestaurantForm } from "../../restaurant-form";

export default async function EditRestaurantPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;
  await requirePermission("restaurant:update");
  const { restaurant } = await requireRestaurantIdMatch(restaurantId);

  return (
    <div className="space-y-6">
      <PageHeader title="Editar restaurante" description={`/${restaurant.slug}`} />
      <RestaurantForm mode="edit" restaurant={restaurant} />
    </div>
  );
}

