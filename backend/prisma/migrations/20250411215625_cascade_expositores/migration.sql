-- DropForeignKey
ALTER TABLE "Eventos_Patrocinadores" DROP CONSTRAINT "Eventos_Patrocinadores_id_auspiciador_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Patrocinadores" DROP CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey";

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_auspiciador_fkey" FOREIGN KEY ("id_auspiciador") REFERENCES "Patrocinadores"("id_patrocinador") ON DELETE CASCADE ON UPDATE CASCADE;
