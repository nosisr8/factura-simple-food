export type OpeningHour = {
  id: string;
  restaurantId: string;
  // 0=Domingo ... 6=Sábado
  dayOfWeek: number;
  isClosed: boolean;
  // "HH:mm"
  opensAt: string;
  closesAt: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertOpeningHourInput = {
  restaurantId: string;
  dayOfWeek: number;
  isClosed: boolean;
  opensAt: string;
  closesAt: string;
};

