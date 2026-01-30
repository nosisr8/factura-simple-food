import { notFound } from "next/navigation";

import { PageHeader } from "@/components/organisms/page-header";
import { getRestaurantById } from "@/modules/restaurants/application/get-restaurant-by-id";

import { RestaurantForm } from "../../restaurant-form";

export default async function EditRestaurantPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Editar restaurante" description={`/${restaurant.slug}`} />
      <RestaurantForm mode="edit" restaurant={restaurant} />
    </div>
  );
}

