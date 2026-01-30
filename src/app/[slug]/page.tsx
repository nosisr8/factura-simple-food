import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ConsumptionMethodOption from "./components/consumption-method-option";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return notFound();
  }

  return (
    <main className="relative min-h-screen">
      <Image
        src={restaurant.coverImageUrl}
        alt={restaurant.name}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border bg-white/10 backdrop-blur">
            <Image
              src={restaurant.avatarImageUrl}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="text-white">
            <p className="text-sm/5 text-white/80">Menú</p>
            <h1 className="text-xl font-semibold leading-tight">{restaurant.name}</h1>
          </div>
        </div>

        <div className="mt-auto rounded-3xl border bg-background/90 p-5 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold">¿Qué querés hacer?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {restaurant.catalogOnly
              ? "Explorá el catálogo de productos."
              : "Elegí cómo preferís disfrutar tu comida."}
          </p>

          {restaurant.catalogOnly ? (
            <div className="mt-5">
              <ConsumptionMethodOption
                slug={slug}
                // El menú en modo catálogo ignora consumptionMethod.
                option="TAKEAWAY"
                buttonText="Ver catálogo"
                imageAlt="Ver catálogo"
                imageUrl="/catalogo.png"
              />
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <ConsumptionMethodOption
                slug={slug}
                option="DINE_IN"
                buttonText="Para comer acá"
                imageAlt="Comer acá"
                imageUrl="/dine_in.png"
              />
              <ConsumptionMethodOption
                slug={slug}
                option="TAKEAWAY"
                buttonText="Para llevar"
                imageAlt="Para llevar"
                imageUrl="/takeaway.png"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RestaurantPage;
