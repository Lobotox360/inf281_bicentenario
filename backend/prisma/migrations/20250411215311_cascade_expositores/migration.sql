-- DropForeignKey
ALTER TABLE "Expositores" DROP CONSTRAINT "Expositores_id_evento_fkey";

-- AddForeignKey
ALTER TABLE "Expositores" ADD CONSTRAINT "Expositores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;
