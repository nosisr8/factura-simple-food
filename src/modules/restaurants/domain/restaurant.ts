export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  whatsappNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRestaurantInput = {
  name: string;
  slug: string;
  description: string;
  avatarImageUrl: string;
  coverImageUrl: string;
  whatsappNumber?: string | null;
};

export type UpdateRestaurantInput = Partial<CreateRestaurantInput>;

