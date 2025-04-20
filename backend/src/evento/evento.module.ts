import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CasbinModule } from 'src/rbac/casbin.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { EmailService } from './email.service';

@Module({
  imports: [CasbinModule,AuthModule,PrismaModule],
  controllers: [EventoController],
  providers: [EventoService, PrismaService, CloudinaryService,EmailService],
  exports: [EmailService],
})
export class EventoModule {}
