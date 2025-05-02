import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CasbinModule } from 'src/rbac/casbin.module';

@Module({
  imports: [PrismaModule,AuthModule,CasbinModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
