-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "maxPrice" INTEGER,
ADD COLUMN     "minPrice" INTEGER,
ADD COLUMN     "ourRecommendation" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Product_minPrice_idx" ON "Product"("minPrice");
