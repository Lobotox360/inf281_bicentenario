-- DropForeignKey
ALTER TABLE "Eventos_Categorias" DROP CONSTRAINT "Eventos_Categorias_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "Eventos_Categorias" DROP CONSTRAINT "Eventos_Categorias_id_evento_fkey";

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Categorias" ADD CONSTRAINT "Eventos_Categorias_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categorias"("id_categoria") ON DELETE CASCADE ON UPDATE CASCADE;
