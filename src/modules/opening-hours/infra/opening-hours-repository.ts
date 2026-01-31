import type {
  OpeningHour,
  UpsertOpeningHourInput,
} from "@/modules/opening-hours/domain/opening-hour";

export interface OpeningHoursRepository {
  listByRestaurant(restaurantId: string): Promise<OpeningHour[]>;
  upsertWeek(restaurantId: string, week: UpsertOpeningHourInput[]): Promise<OpeningHour[]>;
}

