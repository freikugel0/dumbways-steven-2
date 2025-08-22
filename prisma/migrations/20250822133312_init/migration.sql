/*
  Warnings:

  - A unique constraint covering the columns `[supplierId,productId]` on the table `SupplierStock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupplierStock_supplierId_productId_key" ON "public"."SupplierStock"("supplierId", "productId");
