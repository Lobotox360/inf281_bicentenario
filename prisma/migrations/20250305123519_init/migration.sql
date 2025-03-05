/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `genero` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "genero" VARCHAR(10) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Usuario_id_seq";
