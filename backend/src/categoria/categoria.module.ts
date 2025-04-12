import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService,PrismaService],
})
export class CategoriaModule {}
