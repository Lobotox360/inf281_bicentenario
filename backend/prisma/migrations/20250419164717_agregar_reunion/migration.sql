-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "asistio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hora_ingreso" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Eventos" ADD COLUMN     "link_reunion" VARCHAR(255),
ADD COLUMN     "reunion_iniciada" BOOLEAN NOT NULL DEFAULT false;
