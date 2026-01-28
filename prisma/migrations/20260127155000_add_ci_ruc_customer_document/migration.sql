-- Rename CPF column to a generic document field and add document type (CI/RUC) for Paraguay.
-- NOTE: This assumes the table name is "Order" (Prisma default for model Order with PostgreSQL).

-- 1) Rename column
ALTER TABLE "Order" RENAME COLUMN "customerCpf" TO "customerDocument";

-- 2) Create enum type for document type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CustomerDocumentType') THEN
    CREATE TYPE "CustomerDocumentType" AS ENUM ('CI', 'RUC');
  END IF;
END$$;

-- 3) Add new column with default for existing rows
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "documentType" "CustomerDocumentType" NOT NULL DEFAULT 'CI';

-- 4) Optional: remove default after backfill (keeps schema stricter)
ALTER TABLE "Order" ALTER COLUMN "documentType" DROP DEFAULT;

