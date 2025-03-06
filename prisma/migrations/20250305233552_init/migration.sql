-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellidoPaterno" VARCHAR(50) NOT NULL,
    "apellidoMaterno" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "telefono" VARCHAR(15),
    "pais" VARCHAR(50) NOT NULL,
    "ciudad" VARCHAR(50) NOT NULL,
    "genero" VARCHAR(10),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "codigoVerificacion" TEXT,
    "tokenRecuperacion" TEXT,
    "expiracionToken" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_codigoVerificacion_key" ON "Usuario"("codigoVerificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_tokenRecuperacion_key" ON "Usuario"("tokenRecuperacion");
