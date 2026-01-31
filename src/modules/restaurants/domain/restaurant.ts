export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  catalogOnly: boolean;
  whatsappUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  locationUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRestaurantInput = {
  name: string;
  slug: string;
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  catalogOnly?: boolean;
  whatsappUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  locationUrl?: string | null;
};

export type UpdateRestaurantInput = Partial<CreateRestaurantInput>;

