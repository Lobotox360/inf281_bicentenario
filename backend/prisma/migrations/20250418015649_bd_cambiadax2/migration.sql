/*
  Warnings:

  - You are about to drop the column `calificacion` on the `Agenda` table. All the data in the column will be lost.
  - You are about to drop the column `comentario` on the `Agenda` table. All the data in the column will be lost.
  - You are about to drop the column `puntuacion` on the `Eventos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agenda" DROP COLUMN "calificacion",
DROP COLUMN "comentario";

-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "puntuacion";
