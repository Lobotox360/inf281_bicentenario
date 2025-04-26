import { Module } from '@nestjs/common';
import { PuntuacionService } from './puntuacion.service';
import { PuntuacionController } from './puntuacion.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PuntuacionController],
  providers: [PuntuacionService, PrismaService],
})
export class PuntuacionModule {}
