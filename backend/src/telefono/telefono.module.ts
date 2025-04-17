import { Module } from '@nestjs/common';
import { TelefonoService } from './telefono.service';
import { TelefonoController } from './telefono.controller';
import { CasbinModule } from 'src/rbac/casbin.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'src/prisma.service';
import { CasbinGuard } from 'src/rbac/casbin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [CasbinModule,AuthModule,PrismaModule],
  controllers: [TelefonoController],
  providers: [TelefonoService,PrismaService,CasbinGuard,JwtAuthGuard],
})
export class TelefonoModule {}
