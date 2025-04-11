/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Categorias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razon_social]` on the table `Patrocinadores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patrocinadores" ALTER COLUMN "razon_social" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Categorias_nombre_key" ON "Categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Patrocinadores_razon_social_key" ON "Patrocinadores"("razon_social");
