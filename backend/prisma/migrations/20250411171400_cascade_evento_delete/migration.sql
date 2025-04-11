-- DropForeignKey
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Categorias" DROP CONSTRAINT "Eventos_Categorias_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Patrocinadores" DROP CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Expositores" DROP CONSTRAINT "Expositores_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Telefonos" DROP CONSTRAINT "Telefonos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Ubicacion" DROP CONSTRAINT "Ubicacion_id_evento_fkey";

-- AddForeignKey
ALTER TABLE "Expositores" ADD CONSTRAINT "Expositores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefonos" ADD CONSTRAINT "Telefonos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;
