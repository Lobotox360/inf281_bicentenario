/*
  Warnings:

  - A unique constraint covering the columns `[id_expositor,id_evento]` on the table `Expositores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expositores_id_expositor_id_evento_key" ON "Expositores"("id_expositor", "id_evento");
