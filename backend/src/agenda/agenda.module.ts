import { Module } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { CasbinModule } from 'src/rbac/casbin.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';

@Module({
  imports: [CasbinModule, AuthModule, PrismaModule],
  controllers: [AgendaController],
  providers: [AgendaService, PrismaService, JwtService,EmailService],
  exports: [EmailService],
})
export class AgendaModule {}