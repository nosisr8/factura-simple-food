"use client";

import type { Product } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Zoom from "react-medium-image-zoom";

import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  product: Pick<Product, "name" | "imageUrl">;
  catalogOnly?: boolean;
}

const ProductHeader = ({ product, catalogOnly }: ProductHeaderProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const handleBackClick = () => router.back();
  const handleOrdersClick = () => router.push(`/${slug}/orders`);
  return (
    <div className="relative min-h-[320px] w-full overflow-hidden">
      <Button
        variant="secondary"
        size="icon"
        className="absolute left-4 top-4 z-50 rounded-full bg-white/80 backdrop-blur hover:bg-white"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <Zoom
        a11yNameButtonZoom="Ampliar imagen"
        a11yNameButtonUnzoom="Cerrar imagen"
        zoomMargin={24}
      >
        <div
          role="img"
          aria-label={product.name}
          className="absolute inset-0 cursor-zoom-in"
          style={{
            backgroundImage: `url(${product.imageUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
      </Zoom>
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-background" />

      {!catalogOnly ? (
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
        <h1 className="text-xl font-semibold text-white drop-shadow-sm">{product.name}</h1>
      </div>
    </div>
  );
};

export default ProductHeader;