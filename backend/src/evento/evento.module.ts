import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [EventoController],
  providers: [EventoService, PrismaService, CloudinaryService],
})
export class EventoModule {}
