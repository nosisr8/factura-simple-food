
"use client";

import type { Prisma } from "@prisma/client";
import { ClockIcon, SearchIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useContext, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  openStatus: { isOpen: boolean; label: "Abierto" | "Cerrado" };
}

type MenuCategoriesWithProducts = Prisma.MenuCategoryGetPayload<{
  include: { products: true };
}>;

const RestaurantCategories = ({ restaurant, openStatus }: RestaurantCategoriesProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategoriesWithProducts | null>(
    restaurant.menuCategories[0] ?? null
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { products, total, toggleCart, totalQuantity } = useContext(CartContext);
  const orderingEnabled = !restaurant.catalogOnly;
  const handleCategoryClick = (category: MenuCategoriesWithProducts) => {
    setSelectedCategory(category);
  };
  const getCategoryButtonVariant = (category: MenuCategoriesWithProducts) => {
    return selectedCategory?.id === category.id ? "default" : "secondary";
  };

  const allProducts = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryName: string;
    }> = [];

    for (const c of restaurant.menuCategories) {
      for (const p of c.products) {
        list.push({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          categoryName: c.name,
        });
      }
    }
    return list;
  }, [restaurant.menuCategories]);

  const filteredProducts = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return allProducts.slice(0, 20);
    return allProducts
      .filter((p) => {
        const haystack = `${p.name} ${p.description} ${p.categoryName}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 30);
  }, [allProducts, searchValue]);

  const goToProduct = (productId: string) => {
    const params = new URLSearchParams(searchParams);
    const qs = params.toString();
    setSearchOpen(false);
    router.push(`/${slug}/menu/${productId}${qs ? `?${qs}` : ""}`);
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
        <div className="mt-3 flex items-center justify-between gap-3">
          <div
            className={`flex items-center gap-1 text-xs ${openStatus.isOpen ? "text-green-600" : "text-muted-foreground"}`}
          >
            <ClockIcon size={12} />
            <p>{openStatus.isOpen ? "¡Abierto!" : "Cerrado"}</p>
          </div>

          <div className="flex items-center gap-2">
            {restaurant.whatsappUrl ? (
              <Button asChild variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <a
                  href={restaurant.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                >
                  <svg
                    viewBox="0 0 32 32"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.11 17.29c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.67.14-.2.29-.77.95-.95 1.14-.17.2-.35.22-.64.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.35.43-.52.14-.17.2-.29.29-.48.1-.2.05-.36-.02-.5-.07-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.5.07-.77.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.14.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.62.69.22 1.32.19 1.81.12.55-.08 1.72-.7 1.96-1.38.24-.67.24-1.24.17-1.38-.07-.14-.27-.22-.56-.36z" />
                    <path d="M16.02 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.25.59 4.45 1.71 6.38L3.2 28.8l6.58-1.72c1.86 1.01 3.95 1.54 6.25 1.54h.01c7.06 0 12.8-5.74 12.8-12.8S23.08 3.2 16.02 3.2zm0 23.22h-.01c-2.08 0-4-.56-5.67-1.61l-.41-.25-3.9 1.02 1.04-3.8-.27-.39a10.63 10.63 0 0 1-1.72-5.77c0-5.88 4.78-10.66 10.66-10.66 5.88 0 10.66 4.78 10.66 10.66 0 5.88-4.78 10.66-10.66 10.66z" />
                  </svg>
                </a>
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar productos"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="p-0">
          <div className="p-5">
            <DialogHeader>
              <DialogTitle>Buscar productos</DialogTitle>
              <DialogDescription>
                Buscá por nombre, descripción o categoría.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="Escribí para buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />

              <ScrollArea className="max-h-[50vh] pr-2">
                <div className="space-y-2">
                  {filteredProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin resultados.</p>
                  ) : (
                    filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goToProduct(p.id)}
                        className="flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition hover:bg-muted"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
                            <span className="shrink-0 text-sm font-semibold">
                              {formatCurrency(p.price)}
                            </span>
                          </div>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {p.categoryName}
                            {p.description ? ` · ${p.description}` : ""}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
