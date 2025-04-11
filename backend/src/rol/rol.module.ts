import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CasbinModule } from '../rbac/casbin.module';
import { EmailService } from './email.service';

@Module({
  imports: [PrismaModule,AuthModule,CasbinModule],
  controllers: [RolController],
  providers: [RolService, EmailService],
  exports: [EmailService],
})
export class RolModule {}
