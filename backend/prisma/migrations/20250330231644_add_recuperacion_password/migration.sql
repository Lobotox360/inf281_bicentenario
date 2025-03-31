-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "expiracionTokenRecuperacion" TIMESTAMP(3),
ADD COLUMN     "tokenRecuperacion" VARCHAR(100);
