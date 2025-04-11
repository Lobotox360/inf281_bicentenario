/*
  Warnings:

  - You are about to drop the column `nombre` on the `Permisos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_rol,objeto,accion]` on the table `Permisos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accion` to the `Permisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objeto` to the `Permisos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Permisos" DROP COLUMN "nombre",
ADD COLUMN     "accion" VARCHAR(50) NOT NULL,
ADD COLUMN     "objeto" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permisos_id_rol_objeto_accion_key" ON "Permisos"("id_rol", "objeto", "accion");
