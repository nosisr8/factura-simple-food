import type { Metadata } from "next";

import { db } from "@/lib/prisma";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      avatarImageUrl: true,
      coverImageUrl: true,
    },
  });

  if (!restaurant) {
    return {
      title: "Factura Simple Food",
      description: "Catálogo y pedidos para restaurantes.",
    };
  }

  const title = restaurant.name;
  const description = restaurant.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: restaurant.coverImageUrl || restaurant.avatarImageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [restaurant.coverImageUrl || restaurant.avatarImageUrl],
    },
  };
}

export default function RestaurantLayout(props: { children: React.ReactNode }) {
  return props.children;
}

