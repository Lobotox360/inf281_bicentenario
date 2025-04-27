import { Module } from '@nestjs/common';
import { AgenteVirtualService } from './agente-virtual.service';
import { AgenteVirtualController } from './agente-virtual.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AgenteVirtualController],
  providers: [AgenteVirtualService,PrismaService],
})
export class AgenteVirtualModule {}
