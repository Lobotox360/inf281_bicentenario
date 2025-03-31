/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apellidoMaterno` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `apellidoPaterno` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `fechaCreacion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `permiso` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `ultimaActualizacion` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `apellidomaterno` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellidopaterno` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechacreacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ultimaactualizacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `genero` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "apellidoMaterno",
DROP COLUMN "apellidoPaterno",
DROP COLUMN "fechaCreacion",
DROP COLUMN "id",
DROP COLUMN "permiso",
DROP COLUMN "ultimaActualizacion",
ADD COLUMN     "apellidomaterno" TEXT NOT NULL,
ADD COLUMN     "apellidopaterno" TEXT NOT NULL,
ADD COLUMN     "fechacreacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "id_rol" INTEGER NOT NULL,
ADD COLUMN     "id_usuario" SERIAL NOT NULL,
ADD COLUMN     "ultimaactualizacion" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE TEXT,
DROP COLUMN "telefono",
ADD COLUMN     "telefono" INTEGER NOT NULL,
ALTER COLUMN "pais" SET DATA TYPE TEXT,
ALTER COLUMN "ciudad" SET DATA TYPE TEXT,
ALTER COLUMN "genero" SET NOT NULL,
ALTER COLUMN "genero" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario");

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion_rol" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id_permiso" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion_permiso" TEXT NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "PreferenciaUsuario" (
    "id_preferencia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "PreferenciaUsuario_pkey" PRIMARY KEY ("id_preferencia")
);

-- CreateTable
CREATE TABLE "HistorialActividad" (
    "id_historial" SERIAL NOT NULL,
    "fecha_actividad" TIMESTAMP(3) NOT NULL,
    "tipo_actividad" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "HistorialActividad_pkey" PRIMARY KEY ("id_historial")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id_evento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "Expositor" (
    "id_expositor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,

    CONSTRAINT "Expositor_pkey" PRIMARY KEY ("id_expositor")
);

-- CreateTable
CREATE TABLE "EventosExpositor" (
    "id_evento_expositor" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_expositor" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tema" TEXT NOT NULL,

    CONSTRAINT "EventosExpositor_pkey" PRIMARY KEY ("id_evento_expositor")
);

-- CreateTable
CREATE TABLE "ParticipanteEvento" (
    "id_usuario" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "ParticipanteEvento_pkey" PRIMARY KEY ("id_usuario","id_evento")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id_ubicacion" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id_ubicacion")
);

-- CreateTable
CREATE TABLE "Recurso" (
    "id_recurso" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Recurso_pkey" PRIMARY KEY ("id_recurso")
);

-- CreateTable
CREATE TABLE "Multimedia" (
    "id_multimedia" SERIAL NOT NULL,
    "tipo_archivo" TEXT NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "descripcion_archivo" TEXT NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Multimedia_pkey" PRIMARY KEY ("id_multimedia")
);

-- CreateTable
CREATE TABLE "Patrocinador" (
    "id_patrocinador" SERIAL NOT NULL,
    "razon_social" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,

    CONSTRAINT "Patrocinador_pkey" PRIMARY KEY ("id_patrocinador")
);

-- CreateTable
CREATE TABLE "EventoPatrocinador" (
    "id_patrocina" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_auspiciador" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" INTEGER NOT NULL,

    CONSTRAINT "EventoPatrocinador_pkey" PRIMARY KEY ("id_patrocina")
);

-- CreateTable
CREATE TABLE "Historia" (
    "id_historia" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fuentes" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,

    CONSTRAINT "Historia_pkey" PRIMARY KEY ("id_historia")
);

-- CreateTable
CREATE TABLE "Batalla" (
    "id_batalla" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_historia" INTEGER NOT NULL,

    CONSTRAINT "Batalla_pkey" PRIMARY KEY ("id_batalla")
);

-- CreateTable
CREATE TABLE "Presidente" (
    "id_presidente" SERIAL NOT NULL,
    "periodo_inicio" TIMESTAMP(3) NOT NULL,
    "periodo_fin" TIMESTAMP(3) NOT NULL,
    "partido_politico" TEXT NOT NULL,
    "id_historia" INTEGER NOT NULL,

    CONSTRAINT "Presidente_pkey" PRIMARY KEY ("id_presidente")
);

-- CreateTable
CREATE TABLE "PersonajeHistorico" (
    "id_personaje" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apodo" TEXT NOT NULL,
    "biografia" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "fecha_fallecimiento" TIMESTAMP(3) NOT NULL,
    "logros" TEXT NOT NULL,
    "id_historia" INTEGER NOT NULL,

    CONSTRAINT "PersonajeHistorico_pkey" PRIMARY KEY ("id_personaje")
);

-- CreateTable
CREATE TABLE "Cultura" (
    "id_cultura" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "puntuacion" TEXT NOT NULL,

    CONSTRAINT "Cultura_pkey" PRIMARY KEY ("id_cultura")
);

-- CreateTable
CREATE TABLE "Etnia" (
    "id_etnia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "poblacion" INTEGER NOT NULL,
    "id_cultura" INTEGER NOT NULL,

    CONSTRAINT "Etnia_pkey" PRIMARY KEY ("id_etnia")
);

-- CreateTable
CREATE TABLE "Idioma" (
    "id_idioma" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_etnia" INTEGER NOT NULL,

    CONSTRAINT "Idioma_pkey" PRIMARY KEY ("id_idioma")
);

-- CreateTable
CREATE TABLE "Costumbre" (
    "id_costumbre" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "vestimenta" TEXT NOT NULL,
    "id_etnia" INTEGER NOT NULL,

    CONSTRAINT "Costumbre_pkey" PRIMARY KEY ("id_costumbre")
);

-- CreateTable
CREATE TABLE "UsuarioCultura" (
    "id_usuario" INTEGER NOT NULL,
    "id_cultura" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "UsuarioCultura_pkey" PRIMARY KEY ("id_usuario","id_cultura")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenciaUsuario" ADD CONSTRAINT "PreferenciaUsuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialActividad" ADD CONSTRAINT "HistorialActividad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosExpositor" ADD CONSTRAINT "EventosExpositor_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventosExpositor" ADD CONSTRAINT "EventosExpositor_id_expositor_fkey" FOREIGN KEY ("id_expositor") REFERENCES "Expositor"("id_expositor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteEvento" ADD CONSTRAINT "ParticipanteEvento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteEvento" ADD CONSTRAINT "ParticipanteEvento_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurso" ADD CONSTRAINT "Recurso_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Multimedia" ADD CONSTRAINT "Multimedia_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPatrocinador" ADD CONSTRAINT "EventoPatrocinador_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoPatrocinador" ADD CONSTRAINT "EventoPatrocinador_id_auspiciador_fkey" FOREIGN KEY ("id_auspiciador") REFERENCES "Patrocinador"("id_patrocinador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batalla" ADD CONSTRAINT "Batalla_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presidente" ADD CONSTRAINT "Presidente_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonajeHistorico" ADD CONSTRAINT "PersonajeHistorico_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etnia" ADD CONSTRAINT "Etnia_id_cultura_fkey" FOREIGN KEY ("id_cultura") REFERENCES "Cultura"("id_cultura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idioma" ADD CONSTRAINT "Idioma_id_etnia_fkey" FOREIGN KEY ("id_etnia") REFERENCES "Etnia"("id_etnia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Costumbre" ADD CONSTRAINT "Costumbre_id_etnia_fkey" FOREIGN KEY ("id_etnia") REFERENCES "Etnia"("id_etnia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioCultura" ADD CONSTRAINT "UsuarioCultura_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioCultura" ADD CONSTRAINT "UsuarioCultura_id_cultura_fkey" FOREIGN KEY ("id_cultura") REFERENCES "Cultura"("id_cultura") ON DELETE RESTRICT ON UPDATE CASCADE;
