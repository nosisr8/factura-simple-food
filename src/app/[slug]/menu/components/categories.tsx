
"use client";

import type { Prisma } from "@prisma/client";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/helpers/format-currency";

import { CartContext } from "../contexts/cart";
import CartSheet from "./cart-sheet";
import Products from "./products";

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: { products: true };
      };
    };
  }>;
}

type MenuCategoriesWithProducts = Prisma.MenuCategoryGetPayload<{
  include: { products: true };
}>;

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoriesWithProducts | null>(
    restaurant.menuCategories[0] ?? null
  );

  const { products, total, toggleCart, totalQuantity } = useContext(CartContext);
  const orderingEnabled = !restaurant.catalogOnly;
  const handleCategoryClick = (category: MenuCategoriesWithProducts) => {
    setSelectedCategory(category);
  };
  const getCategoryButtonVariant = (category: MenuCategoriesWithProducts) => {
    return selectedCategory?.id === category.id ? "default" : "secondary";
  };
  return (
    <div className="relative z-50 mt-[-2rem] rounded-t-3xl bg-background">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            height={45}
            width={45}
            className="rounded-xl"
          />
          <div>
            <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            <p className="text-xs text-muted-foreground">{restaurant.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
          <ClockIcon size={12} />
          <p>¡Abierto!</p>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="flex w-max space-x-3 px-5 pb-2">
          {restaurant.menuCategories.map((category) => (
            <Button
              onClick={() => handleCategoryClick(category)}
              key={category.id}
              variant={getCategoryButtonVariant(category)}
              size="sm"
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedCategory ? (
        <>
          <h3 className="px-5 pt-2 text-base font-semibold">{selectedCategory.name}</h3>
          <Products products={selectedCategory.products} />
        </>
      ) : (
        <p className="px-5 pt-2 text-sm text-muted-foreground">No hay categorías.</p>
      )}
      {orderingEnabled && products.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex w-full items-center justify-between border-t bg-background/95 px-5 py-3 backdrop-blur">
          <div>
            <p className="text-xs text-muted-foreground">Total del pedido</p>
            <p className="text-sm font-semibold">
              {formatCurrency(total)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / {totalQuantity} {totalQuantity > 1 ? "ítems" : "ítem"}
              </span>
            </p>
          </div>
          <Button onClick={toggleCart}>Ver carrito</Button>
          <CartSheet />
        </div>
      )}
    </div>
  );
};

export default RestaurantCategories;
