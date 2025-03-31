/*
  Warnings:

  - You are about to alter the column `nombre` on the `Cultura` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion` on the `Cultura` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `tipo` on the `Cultura` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `puntuacion` on the `Cultura` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `titulo` on the `Historia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion` on the `Historia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `fuentes` on the `Historia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `tipo_archivo` on the `Multimedia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `ruta_archivo` on the `Multimedia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion_archivo` on the `Multimedia` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `descripcion` on the `Ubicacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `direccion` on the `Ubicacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `departamento` on the `Ubicacion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `Batalla` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Costumbre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Etnia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventoPatrocinador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventosExpositor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Expositor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistorialActividad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Idioma` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipanteEvento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patrocinador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonajeHistorico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreferenciaUsuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Presidente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recurso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsuarioCultura` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Batalla" DROP CONSTRAINT "Batalla_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Costumbre" DROP CONSTRAINT "Costumbre_id_etnia_fkey";

-- DropForeignKey
ALTER TABLE "Etnia" DROP CONSTRAINT "Etnia_id_cultura_fkey";

-- DropForeignKey
ALTER TABLE "EventoPatrocinador" DROP CONSTRAINT "EventoPatrocinador_id_auspiciador_fkey";

-- DropForeignKey
ALTER TABLE "EventoPatrocinador" DROP CONSTRAINT "EventoPatrocinador_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "EventosExpositor" DROP CONSTRAINT "EventosExpositor_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "EventosExpositor" DROP CONSTRAINT "EventosExpositor_id_expositor_fkey";

-- DropForeignKey
ALTER TABLE "HistorialActividad" DROP CONSTRAINT "HistorialActividad_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Idioma" DROP CONSTRAINT "Idioma_id_etnia_fkey";

-- DropForeignKey
ALTER TABLE "Multimedia" DROP CONSTRAINT "Multimedia_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "ParticipanteEvento" DROP CONSTRAINT "ParticipanteEvento_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "ParticipanteEvento" DROP CONSTRAINT "ParticipanteEvento_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Permiso" DROP CONSTRAINT "Permiso_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "PersonajeHistorico" DROP CONSTRAINT "PersonajeHistorico_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "PreferenciaUsuario" DROP CONSTRAINT "PreferenciaUsuario_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Presidente" DROP CONSTRAINT "Presidente_id_historia_fkey";

-- DropForeignKey
ALTER TABLE "Recurso" DROP CONSTRAINT "Recurso_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Ubicacion" DROP CONSTRAINT "Ubicacion_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioCultura" DROP CONSTRAINT "UsuarioCultura_id_cultura_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioCultura" DROP CONSTRAINT "UsuarioCultura_id_usuario_fkey";

-- AlterTable
ALTER TABLE "Cultura" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "tipo" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "puntuacion" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Historia" ALTER COLUMN "titulo" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "fuentes" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Multimedia" ALTER COLUMN "tipo_archivo" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "ruta_archivo" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "descripcion_archivo" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Ubicacion" ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "departamento" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "Batalla";

-- DropTable
DROP TABLE "Costumbre";

-- DropTable
DROP TABLE "Etnia";

-- DropTable
DROP TABLE "Evento";

-- DropTable
DROP TABLE "EventoPatrocinador";

-- DropTable
DROP TABLE "EventosExpositor";

-- DropTable
DROP TABLE "Expositor";

-- DropTable
DROP TABLE "HistorialActividad";

-- DropTable
DROP TABLE "Idioma";

-- DropTable
DROP TABLE "ParticipanteEvento";

-- DropTable
DROP TABLE "Patrocinador";

-- DropTable
DROP TABLE "Permiso";

-- DropTable
DROP TABLE "PersonajeHistorico";

-- DropTable
DROP TABLE "PreferenciaUsuario";

-- DropTable
DROP TABLE "Presidente";

-- DropTable
DROP TABLE "Recurso";

-- DropTable
DROP TABLE "Rol";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "UsuarioCultura";

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" TEXT NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellidopaterno" VARCHAR(30) NOT NULL,
    "apellidomaterno" VARCHAR(30) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,
    "foto" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "pais" VARCHAR(50) NOT NULL,
    "ciudad" VARCHAR(50) NOT NULL,
    "genero" VARCHAR(20),
    "fechacreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaactualizacion" TIMESTAMP(3) NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion_rol" VARCHAR(255) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Permisos" (
    "id_permiso" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion_permiso" VARCHAR(255) NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "Preferencias_Usuario" (
    "id_preferencia" SERIAL NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,

    CONSTRAINT "Preferencias_Usuario_pkey" PRIMARY KEY ("id_preferencia")
);

-- CreateTable
CREATE TABLE "Historial_Actividades" (
    "id_historial" SERIAL NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "fecha_actividad" TIMESTAMP(3) NOT NULL,
    "tipo_actividad" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(1000) NOT NULL,

    CONSTRAINT "Historial_Actividades_pkey" PRIMARY KEY ("id_historial")
);

-- CreateTable
CREATE TABLE "Eventos" (
    "id_evento" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" VARCHAR(1000) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,

    CONSTRAINT "Eventos_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "Expositores" (
    "id_expositor" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "institucion" VARCHAR(100) NOT NULL,
    "contacto" VARCHAR(100) NOT NULL,

    CONSTRAINT "Expositores_pkey" PRIMARY KEY ("id_expositor")
);

-- CreateTable
CREATE TABLE "Eventos_Expositores" (
    "id_evento_expositor" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_expositor" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tema" VARCHAR(255) NOT NULL,

    CONSTRAINT "Eventos_Expositores_pkey" PRIMARY KEY ("id_evento_expositor")
);

-- CreateTable
CREATE TABLE "Participantes_Eventos" (
    "id_usuario" TEXT NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Participantes_Eventos_pkey" PRIMARY KEY ("id_usuario","id_evento")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id_agenda" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "actividades" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id_agenda")
);

-- CreateTable
CREATE TABLE "Recursos" (
    "id_recurso" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,

    CONSTRAINT "Recursos_pkey" PRIMARY KEY ("id_recurso")
);

-- CreateTable
CREATE TABLE "Patrocinadores" (
    "id_patrocinador" SERIAL NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "institucion" VARCHAR(255) NOT NULL,

    CONSTRAINT "Patrocinadores_pkey" PRIMARY KEY ("id_patrocinador")
);

-- CreateTable
CREATE TABLE "Eventos_Patrocinadores" (
    "id_patrocina" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_auspiciador" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" INTEGER NOT NULL,

    CONSTRAINT "Eventos_Patrocinadores_pkey" PRIMARY KEY ("id_patrocina")
);

-- CreateTable
CREATE TABLE "Usuarios_Historia" (
    "id_usuario" TEXT NOT NULL,
    "id_historia" INTEGER NOT NULL,
    "comentario" VARCHAR(100) NOT NULL,

    CONSTRAINT "Usuarios_Historia_pkey" PRIMARY KEY ("id_usuario","id_historia")
);

-- CreateTable
CREATE TABLE "Batallas" (
    "id_batalla" SERIAL NOT NULL,
    "id_historia" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "ubicacion" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(1000) NOT NULL,

    CONSTRAINT "Batallas_pkey" PRIMARY KEY ("id_batalla")
);

-- CreateTable
CREATE TABLE "Presidentes" (
    "id_presidente" SERIAL NOT NULL,
    "id_historia" INTEGER NOT NULL,
    "periodo_inicio" TIMESTAMP(3) NOT NULL,
    "periodo_fin" TIMESTAMP(3) NOT NULL,
    "partido_politico" VARCHAR(100) NOT NULL,

    CONSTRAINT "Presidentes_pkey" PRIMARY KEY ("id_presidente")
);

-- CreateTable
CREATE TABLE "Personajes_Historicos" (
    "id_personaje" SERIAL NOT NULL,
    "id_historia" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "apodo" VARCHAR(100) NOT NULL,
    "biografia" VARCHAR(1000) NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "fecha_fallecimiento" TIMESTAMP(3) NOT NULL,
    "logros" VARCHAR(1000) NOT NULL,

    CONSTRAINT "Personajes_Historicos_pkey" PRIMARY KEY ("id_personaje")
);

-- CreateTable
CREATE TABLE "Etnias" (
    "id_etnia" SERIAL NOT NULL,
    "id_cultura" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "ubicacion" VARCHAR(255) NOT NULL,
    "poblacion" INTEGER NOT NULL,

    CONSTRAINT "Etnias_pkey" PRIMARY KEY ("id_etnia")
);

-- CreateTable
CREATE TABLE "Idiomas" (
    "id_idioma" SERIAL NOT NULL,
    "id_etnia" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,

    CONSTRAINT "Idiomas_pkey" PRIMARY KEY ("id_idioma")
);

-- CreateTable
CREATE TABLE "Costumbres" (
    "id_costumbre" SERIAL NOT NULL,
    "id_etnia" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "vestimenta" VARCHAR(100) NOT NULL,

    CONSTRAINT "Costumbres_pkey" PRIMARY KEY ("id_costumbre")
);

-- CreateTable
CREATE TABLE "Usuarios_Cultura" (
    "id_usuario" TEXT NOT NULL,
    "id_cultura" INTEGER NOT NULL,
    "comentario" VARCHAR(100) NOT NULL,

    CONSTRAINT "Usuarios_Cultura_pkey" PRIMARY KEY ("id_usuario","id_cultura")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_nombre_key" ON "Roles"("nombre");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferencias_Usuario" ADD CONSTRAINT "Preferencias_Usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historial_Actividades" ADD CONSTRAINT "Historial_Actividades_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Expositores" ADD CONSTRAINT "Eventos_Expositores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Expositores" ADD CONSTRAINT "Eventos_Expositores_id_expositor_fkey" FOREIGN KEY ("id_expositor") REFERENCES "Expositores"("id_expositor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participantes_Eventos" ADD CONSTRAINT "Participantes_Eventos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos" ADD CONSTRAINT "Recursos_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Multimedia" ADD CONSTRAINT "Multimedia_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Eventos"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eventos_Patrocinadores" ADD CONSTRAINT "Eventos_Patrocinadores_id_auspiciador_fkey" FOREIGN KEY ("id_auspiciador") REFERENCES "Patrocinadores"("id_patrocinador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Historia" ADD CONSTRAINT "Usuarios_Historia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Historia" ADD CONSTRAINT "Usuarios_Historia_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batallas" ADD CONSTRAINT "Batallas_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presidentes" ADD CONSTRAINT "Presidentes_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personajes_Historicos" ADD CONSTRAINT "Personajes_Historicos_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etnias" ADD CONSTRAINT "Etnias_id_cultura_fkey" FOREIGN KEY ("id_cultura") REFERENCES "Cultura"("id_cultura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idiomas" ADD CONSTRAINT "Idiomas_id_etnia_fkey" FOREIGN KEY ("id_etnia") REFERENCES "Etnias"("id_etnia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Costumbres" ADD CONSTRAINT "Costumbres_id_etnia_fkey" FOREIGN KEY ("id_etnia") REFERENCES "Etnias"("id_etnia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Cultura" ADD CONSTRAINT "Usuarios_Cultura_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Cultura" ADD CONSTRAINT "Usuarios_Cultura_id_cultura_fkey" FOREIGN KEY ("id_cultura") REFERENCES "Cultura"("id_cultura") ON DELETE RESTRICT ON UPDATE CASCADE;
