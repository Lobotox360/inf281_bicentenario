/*
  Warnings:

  - You are about to alter the column `email` on the `Usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(80)` to `VarChar(50)`.
  - Made the column `telefono` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genero` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "email" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "genero" SET NOT NULL;
