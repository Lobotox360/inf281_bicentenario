import { Module } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { PatrocinadorController } from './patrocinador.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CasbinModule } from '../rbac/casbin.module';
import { PrismaModule } from 'prisma/prisma.module';


@Module({
  imports: [AuthModule,CasbinModule,PrismaModule],
  controllers: [PatrocinadorController],
  providers: [PatrocinadorService, PrismaService],
})
export class PatrocinadorModule {}
