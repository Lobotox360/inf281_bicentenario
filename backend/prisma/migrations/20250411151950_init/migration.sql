/*
  Warnings:

  - You are about to drop the column `imagen` on the `Eventos` table. All the data in the column will be lost.
  - You are about to alter the column `modalidad` on the `Eventos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `ubicacion` on the `Eventos` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the `Eventos_Expositores` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `departamento` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costo` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Made the column `modalidad` on table `Eventos` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id_evento` to the `Expositores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Eventos_Expositores" DROP CONSTRAINT "Eventos_Expositores_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Expositores" DROP CONSTRAINT "Eventos_Expositores_id_expositor_fkey";

-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "imagen",
ADD COLUMN     "departamento" VARCHAR(50) NOT NULL,
ADD COLUMN     "foto_evento" VARCHAR(255),
DROP COLUMN "costo",
ADD COLUMN     "costo" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "modalidad" SET NOT NULL,
ALTER COLUMN "modalidad" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "ubicacion" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Expositores" ADD COLUMN     "id_evento" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Eventos_Expositores";

-- AddForeignKey
ALTER TABLE "Expositores" ADD CONSTRAINT "Expositores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
