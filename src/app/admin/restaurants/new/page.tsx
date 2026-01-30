import { PageHeader } from "@/components/organisms/page-header";

import { RestaurantForm } from "../restaurant-form";

export default function NewRestaurantPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Nuevo restaurante" description="Creá un nuevo restaurante." />
      <RestaurantForm mode="create" />
    </div>
  );
}

