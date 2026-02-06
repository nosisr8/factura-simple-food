-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "storyImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "storyIsActive" BOOLEAN NOT NULL DEFAULT false;
