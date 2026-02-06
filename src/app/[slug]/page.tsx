import Image from "next/image";
import { notFound } from "next/navigation";
import { FacebookIcon, InstagramIcon, MapPinIcon } from "lucide-react";

import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

import ConsumptionMethodOption from "./components/consumption-method-option";
import { RestaurantStories } from "./components/stories";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

type RestaurantWithSocialLinks = {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  storyIsActive: boolean;
  storyImageUrls: string[];
  catalogOnly: boolean;
  timezone: string;
  whatsappUrl: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  locationUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = (await db.restaurant.findUnique({
    where: { slug },
  })) as RestaurantWithSocialLinks | null;
  if (!restaurant) {
    return notFound();
  }

  const hasSocialLinks = Boolean(
    restaurant.whatsappUrl ||
      restaurant.facebookUrl ||
      restaurant.instagramUrl ||
      restaurant.tiktokUrl ||
      restaurant.locationUrl
  );

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
            {hasSocialLinks ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {restaurant.whatsappUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  >
                    <a
                      href={restaurant.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                    >
                      <svg
                        viewBox="0 0 32 32"
                        className="h-5 w-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M19.11 17.29c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.67.14-.2.29-.77.95-.95 1.14-.17.2-.35.22-.64.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.35.43-.52.14-.17.2-.29.29-.48.1-.2.05-.36-.02-.5-.07-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.5.07-.77.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.14.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.62.69.22 1.32.19 1.81.12.55-.08 1.72-.7 1.96-1.38.24-.67.24-1.24.17-1.38-.07-.14-.27-.22-.56-.36z" />
                        <path d="M16.02 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.25.59 4.45 1.71 6.38L3.2 28.8l6.58-1.72c1.86 1.01 3.95 1.54 6.25 1.54h.01c7.06 0 12.8-5.74 12.8-12.8S23.08 3.2 16.02 3.2zm0 23.22h-.01c-2.08 0-4-.56-5.67-1.61l-.41-.25-3.9 1.02 1.04-3.8-.27-.39a10.63 10.63 0 0 1-1.72-5.77c0-5.88 4.78-10.66 10.66-10.66 5.88 0 10.66 4.78 10.66 10.66 0 5.88-4.78 10.66-10.66 10.66z" />
                      </svg>
                    </a>
                  </Button>
                ) : null}

                {restaurant.facebookUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  >
                    <a href={restaurant.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <FacebookIcon className="h-5 w-5" />
                    </a>
                  </Button>
                ) : null}

                {restaurant.instagramUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  >
                    <a
                      href={restaurant.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="h-5 w-5" />
                    </a>
                  </Button>
                ) : null}

                {restaurant.tiktokUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  >
                    <a href={restaurant.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok">
                      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M23.6 7.7c-1.4-1-2.3-2.6-2.5-4.4h-3.6v17.2c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .7.1 1 .2v-3.7c-.3-.1-.7-.1-1-.1-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5V13.2c1.5 1.1 3.3 1.7 5.2 1.7V11c-1.5 0-2.9-.5-3.8-1.3z" />
                      </svg>
                    </a>
                  </Button>
                ) : null}

                {restaurant.locationUrl ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
                  >
                    <a href={restaurant.locationUrl} target="_blank" rel="noreferrer" aria-label="Ubicación">
                      <MapPinIcon className="h-5 w-5" />
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5">
          <RestaurantStories
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            avatarImageUrl={restaurant.avatarImageUrl}
            isActive={restaurant.storyIsActive}
            imageUrls={restaurant.storyImageUrls}
            durationMs={15_000}
          />
        </div>

        <div className="mt-[100px] rounded-3xl border bg-background/90 p-5 shadow-lg backdrop-blur">
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
