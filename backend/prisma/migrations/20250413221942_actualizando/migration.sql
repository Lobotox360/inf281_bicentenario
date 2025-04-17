/*
  Warnings:

  - The primary key for the `Agenda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_agenda` on the `Agenda` table. All the data in the column will be lost.
  - You are about to drop the `Participantes_Eventos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_usuario` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_pkey",
DROP COLUMN "id_agenda",
ADD COLUMN     "id_usuario" TEXT NOT NULL,
ADD CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id_usuario", "id_evento");

-- DropTable
DROP TABLE "Participantes_Eventos";

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;
