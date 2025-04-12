/*
  Warnings:

  - You are about to drop the column `departamento` on the `Eventos` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `Eventos` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Ubicacion` table. All the data in the column will be lost.
  - You are about to drop the `Batallas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Costumbres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cultura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Etnias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Historia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Idiomas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Personajes_Historicos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Presidentes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios_Cultura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios_Historia` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_evento]` on the table `Ubicacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ubicacion` to the `Ubicacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Batallas" DROP CONSTRAINT "Batallas_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Costumbres" DROP CONSTRAINT "Costumbres_id_etnia_fkey";

-- DropForeignKey
ALTER TABLE "Etnias" DROP CONSTRAINT "Etnias_id_cultura_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Categorias" DROP CONSTRAINT "Eventos_Categorias_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Patrocinadores" DROP CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Expositores" DROP CONSTRAINT "Expositores_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Idiomas" DROP CONSTRAINT "Idiomas_id_etnia_fkey";

-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Personajes_Historicos" DROP CONSTRAINT "Personajes_Historicos_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Presidentes" DROP CONSTRAINT "Presidentes_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Telefonos" DROP CONSTRAINT "Telefonos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Cultura" DROP CONSTRAINT "Usuarios_Cultura_id_cultura_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Cultura" DROP CONSTRAINT "Usuarios_Cultura_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Historia" DROP CONSTRAINT "Usuarios_Historia_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Historia" DROP CONSTRAINT "Usuarios_Historia_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "departamento",
DROP COLUMN "ubicacion";

-- AlterTable
ALTER TABLE "Ubicacion" DROP COLUMN "direccion",
ADD COLUMN     "ubicacion" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "Batallas";

-- DropTable
DROP TABLE "Costumbres";

-- DropTable
DROP TABLE "Cultura";

-- DropTable
DROP TABLE "Etnias";

-- DropTable
DROP TABLE "Historia";

-- DropTable
DROP TABLE "Idiomas";

-- DropTable
DROP TABLE "Personajes_Historicos";

-- DropTable
DROP TABLE "Presidentes";

-- DropTable
DROP TABLE "Usuarios_Cultura";

-- DropTable
DROP TABLE "Usuarios_Historia";

-- CreateIndex
CREATE UNIQUE INDEX "Ubicacion_id_evento_key" ON "Ubicacion"("id_evento");

-- AddForeignKey
ALTER TABLE "Expositores" ADD CONSTRAINT "Expositores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefonos" ADD CONSTRAINT "Telefonos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
