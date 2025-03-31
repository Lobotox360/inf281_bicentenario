import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from './email.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'

@Module({
  imports: [PrismaModule,AuthModule,CloudinaryModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, EmailService],
  exports: [UsuarioService, EmailService],
})
export class UsuarioModule {}
