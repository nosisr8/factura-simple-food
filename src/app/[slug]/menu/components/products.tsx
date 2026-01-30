"use client";

import type { Product } from "@prisma/client";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/format-currency";

interface ProductsProps {
  products: Product[];
}

const Products = ({ products }: ProductsProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const consumptionMethod = searchParams.get("consumptionMethod");
  const viewParam = (searchParams.get("view") ?? "grid").toLowerCase();
  const view = viewParam === "list" ? "list" : "grid";

  const productHref = (productId: string) => {
    const base = `/${slug}/menu/${productId}`;
    const params = new URLSearchParams(searchParams);
    // Aseguramos mantener los params actuales (incluyendo view)
    if (consumptionMethod) params.set("consumptionMethod", consumptionMethod);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const setView = (nextView: "grid" | "list") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", nextView);
    router.replace(`/${slug}/menu?${params.toString()}`);
  };

  return (
    <div className="px-5 pb-28">
      <div className="mb-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setView("grid")}
          aria-label="Ver en cuadrícula"
        >
          <LayoutGridIcon />
        </Button>
        <Button
          type="button"
          variant={view === "list" ? "default" : "outline"}
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setView("list")}
          aria-label="Ver en lista"
        >
          <ListIcon />
        </Button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link key={product.id} href={productHref(product.id)} className="block">
              <Card className="group overflow-hidden border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, 320px"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-background/85 px-2 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="text-sm font-semibold leading-snug">{product.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={productHref(product.id)}
              className="block"
            >
              <Card className="flex items-center gap-3 border bg-background p-3 shadow-sm transition hover:shadow-md">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;