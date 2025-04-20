/*
  Warnings:

  - Added the required column `latitud` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitud` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ubicacion" ADD COLUMN     "latitud" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitud" DOUBLE PRECISION NOT NULL;
