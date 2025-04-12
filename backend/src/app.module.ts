import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { CasbinModule } from './rbac/casbin.module';
import { RolModule } from './rol/rol.module';
import { EventoModule } from './evento/evento.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PatrocinadorModule } from './patrocinador/patrocinador.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsuarioModule,
    AuthModule,
    CloudinaryModule,
    MulterModule.register({}),
    CasbinModule,
    RolModule,
    EventoModule,
    CategoriaModule,
    PatrocinadorModule, 
  ],
})
export class AppModule {}
