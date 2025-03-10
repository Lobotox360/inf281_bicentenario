/*
  Warnings:

  - You are about to drop the column `codigoVerificacion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `expiracionToken` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tokenRecuperacion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `verificado` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Usuario_codigoVerificacion_key";

-- DropIndex
DROP INDEX "Usuario_tokenRecuperacion_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "codigoVerificacion",
DROP COLUMN "expiracionToken",
DROP COLUMN "tokenRecuperacion",
DROP COLUMN "verificado",
ADD COLUMN     "permiso" BOOLEAN NOT NULL DEFAULT false;
