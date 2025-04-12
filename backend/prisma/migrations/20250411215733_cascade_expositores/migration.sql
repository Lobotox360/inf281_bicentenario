-- DropForeignKey
ALTER TABLE "Participantes_Eventos" DROP CONSTRAINT "Participantes_Eventos_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Permisos" DROP CONSTRAINT "Permisos_id_rol_fkey";

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;
