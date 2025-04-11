/*
  Warnings:

  - You are about to drop the column `nombre` on the `Eventos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Eventos` table. All the data in the column will be lost.
  - You are about to drop the `Multimedia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recursos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hora_fin` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hora_inicio` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ubicacion` to the `Eventos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Historial_Actividades" DROP CONSTRAINT "Historial_Actividades_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Multimedia" DROP CONSTRAINT "Multimedia_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Preferencias_Usuario" DROP CONSTRAINT "Preferencias_Usuario_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Recursos" DROP CONSTRAINT "Recursos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Cultura" DROP CONSTRAINT "Usuarios_Cultura_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Historia" DROP CONSTRAINT "Usuarios_Historia_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Eventos" DROP COLUMN "nombre",
DROP COLUMN "tipo",
ADD COLUMN     "costo" TEXT,
ADD COLUMN     "hora_fin" VARCHAR(50) NOT NULL,
ADD COLUMN     "hora_inicio" VARCHAR(50) NOT NULL,
ADD COLUMN     "imagen" VARCHAR(255) NOT NULL,
ADD COLUMN     "modalidad" TEXT,
ADD COLUMN     "titulo" VARCHAR(255) NOT NULL,
ADD COLUMN     "ubicacion" TEXT NOT NULL;

-- DropTable
DROP TABLE "Multimedia";

-- DropTable
DROP TABLE "Recursos";

-- CreateTable
CREATE TABLE "Telefonos" (
    "id_telefono" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Telefonos_pkey" PRIMARY KEY ("id_telefono")
);

-- CreateTable
CREATE TABLE "Categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Eventos_Categorias" (
    "id_evento_categoria" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,

    CONSTRAINT "Eventos_Categorias_pkey" PRIMARY KEY ("id_evento_categoria")
);

-- AddForeignKey
ALTER TABLE "Preferencias_Usuario" ADD CONSTRAINT "Preferencias_Usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historial_Actividades" ADD CONSTRAINT "Historial_Actividades_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefonos" ADD CONSTRAINT "Telefonos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categorias"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Historia" ADD CONSTRAINT "Usuarios_Historia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Cultura" ADD CONSTRAINT "Usuarios_Cultura_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
