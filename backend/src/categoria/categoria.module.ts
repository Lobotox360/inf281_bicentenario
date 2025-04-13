import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CasbinModule } from 'src/rbac/casbin.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [CasbinModule,AuthModule,PrismaModule],
  controllers: [CategoriaController],
  providers: [CategoriaService,PrismaService,CasbinGuard,JwtAuthGuard],
})
export class CategoriaModule {}
