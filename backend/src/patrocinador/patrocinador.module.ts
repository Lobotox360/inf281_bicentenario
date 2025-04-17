import { Module } from '@nestjs/common';
import { PatrocinadorService } from './patrocinador.service';
import { PatrocinadorController } from './patrocinador.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CasbinModule } from '../rbac/casbin.module';
import { PrismaModule } from 'prisma/prisma.module';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Module({
  imports: [CasbinModule,AuthModule,PrismaModule],
  controllers: [PatrocinadorController],
  providers: [PatrocinadorService, PrismaService,CasbinGuard,JwtAuthGuard],
})
export class PatrocinadorModule {}
