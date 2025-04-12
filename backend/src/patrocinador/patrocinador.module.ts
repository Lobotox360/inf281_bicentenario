import { Module } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { PatrocinadorController } from './patrocinador.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PatrocinadorController],
  providers: [PatrocinadorService, PrismaService],
})
export class PatrocinadorModule {}
