import { PageHeader } from "@/components/organisms/page-header";
import { notFound } from "next/navigation";

import { getAdminContext, requirePermission } from "@/modules/admin/rbac";

import { RestaurantForm } from "../restaurant-form";

export default async function NewRestaurantPage() {
  await requirePermission("restaurant:create");
  const ctx = await getAdminContext();
  if (ctx.restaurantSlug) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Nuevo restaurante" description="Creá un nuevo restaurante." />
      <RestaurantForm mode="create" />
    </div>
  );
}

