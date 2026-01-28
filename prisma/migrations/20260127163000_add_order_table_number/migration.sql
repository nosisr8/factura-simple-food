-- Add table number for dine-in orders

ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "tableNumber" INTEGER;

