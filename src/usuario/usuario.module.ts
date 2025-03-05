import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Importar PrismaService

@Module({
  providers: [UsuarioService, PrismaService], // Agregar PrismaService
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
