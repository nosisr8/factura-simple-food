import { notFound } from "next/navigation";

import { PageHeader } from "@/components/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requirePermission, requireRestaurantIdMatch } from "@/modules/admin/rbac";
import { listOpeningHoursByRestaurant } from "@/modules/opening-hours/application/list-opening-hours-by-restaurant";

import { saveOpeningHoursWeekAction } from "./actions";

const DAYS: Array<{ key: number; label: string }> = [
  { key: 0, label: "Domingo" },
  { key: 1, label: "Lunes" },
  { key: 2, label: "Martes" },
  { key: 3, label: "Miércoles" },
  { key: 4, label: "Jueves" },
  { key: 5, label: "Viernes" },
  { key: 6, label: "Sábado" },
];

export default async function RestaurantHoursPage(props: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await props.params;
  await requirePermission("restaurant:update");
  const { restaurant } = await requireRestaurantIdMatch(restaurantId);

  const existing = await listOpeningHoursByRestaurant(restaurantId);
  const byDay = new Map(existing.map((h) => [h.dayOfWeek, h]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Horarios"
        description={`Configurar horarios de apertura · ${restaurant.name}`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Semana</CardTitle>
        </CardHeader>

        <form action={saveOpeningHoursWeekAction.bind(null, restaurantId)}>
          <CardContent className="space-y-4">
            {DAYS.map((d) => {
              const row = byDay.get(d.key);
              const prefix = `d${d.key}`;
              return (
                <div
                  key={d.key}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-[140px]">
                    <p className="font-medium">{d.label}</p>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name={`${prefix}.isClosed`}
                        defaultChecked={row?.isClosed ?? false}
                        className="h-4 w-4 rounded border border-input"
                      />
                      Cerrado
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`${prefix}.opensAt`} className="text-xs">
                          Desde
                        </Label>
                        <Input
                          id={`${prefix}.opensAt`}
                          name={`${prefix}.opensAt`}
                          type="time"
                          defaultValue={row?.opensAt ?? "09:00"}
                          className="h-9 w-[140px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`${prefix}.closesAt`} className="text-xs">
                          Hasta
                        </Label>
                        <Input
                          id={`${prefix}.closesAt`}
                          name={`${prefix}.closesAt`}
                          type="time"
                          defaultValue={row?.closesAt ?? "18:00"}
                          className="h-9 w-[140px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Guardar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

