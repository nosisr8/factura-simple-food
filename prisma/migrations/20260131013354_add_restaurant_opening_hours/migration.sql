-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Asuncion';

-- CreateTable
CREATE TABLE "RestaurantOpeningHour" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "opensAt" TEXT NOT NULL DEFAULT '09:00',
    "closesAt" TEXT NOT NULL DEFAULT '18:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantOpeningHour_restaurantId_dayOfWeek_idx" ON "RestaurantOpeningHour"("restaurantId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantOpeningHour_restaurantId_dayOfWeek_key" ON "RestaurantOpeningHour"("restaurantId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "RestaurantOpeningHour" ADD CONSTRAINT "RestaurantOpeningHour_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
