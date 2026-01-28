-- Add Restaurant WhatsApp number and Order confirmation token/date.

ALTER TABLE "Restaurant"
  ADD COLUMN IF NOT EXISTS "whatsappNumber" TEXT;

ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "confirmationToken" TEXT,
  ADD COLUMN IF NOT EXISTS "confirmedAt" TIMESTAMP(3);

-- Unique index for confirmation token (nullable values allowed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'Order_confirmationToken_key'
  ) THEN
    CREATE UNIQUE INDEX "Order_confirmationToken_key" ON "Order"("confirmationToken");
  END IF;
END$$;

