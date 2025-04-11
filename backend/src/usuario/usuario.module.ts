import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailService } from './email.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { CasbinModule } from '../rbac/casbin.module';

@Module({
  imports: [PrismaModule,AuthModule,CloudinaryModule,CasbinModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, EmailService],
  exports: [UsuarioService, EmailService],
})
export class UsuarioModule {}
