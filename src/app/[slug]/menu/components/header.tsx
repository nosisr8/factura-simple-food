"use client";

import type { Restaurant } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface RestaurantHeaderProps {
  restaurant: Pick<Restaurant, "name" | "coverImageUrl" | "catalogOnly">;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const handleBackClick = () => router.back();
  const handleOrdersClick = () => router.push(`/${slug}/orders`);
  return (
    <div className="relative h-[280px] w-full overflow-hidden">
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-4 z-50 rounded-full bg-white/80 backdrop-blur hover:bg-white"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>
      <Image
        src={restaurant.coverImageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background" />
      {!restaurant.catalogOnly ? (
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-white/80 backdrop-blur hover:bg-white"
          onClick={handleOrdersClick}
        >
          <ScrollTextIcon />
        </Button>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
        <h1 className="text-xl font-semibold text-white drop-shadow-sm">{restaurant.name}</h1>
        <p className="mt-0.5 text-sm text-white/80">
          {restaurant.catalogOnly ? "Catálogo" : "Menú & pedidos"}
        </p>
      </div>
    </div>
  );
};

export default RestaurantHeader;