-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "calificacion" INTEGER DEFAULT -1,
ADD COLUMN     "comentario" TEXT;

-- AlterTable
ALTER TABLE "Eventos" ADD COLUMN     "puntuacion" DOUBLE PRECISION NOT NULL DEFAULT 0;
