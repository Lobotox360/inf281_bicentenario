-- DropForeignKey
ALTER TABLE "Telefonos" DROP CONSTRAINT "Telefonos_id_evento_fkey";

-- AddForeignKey
ALTER TABLE "Telefonos" ADD CONSTRAINT "Telefonos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;
