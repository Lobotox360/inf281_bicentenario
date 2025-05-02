import { Controller, UseGuards, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CasbinGuard } from 'src/rbac/casbin.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}


  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('general')
  async ObtenerGeneral() {
    return await this.dashboardService.ObtenerGeneral();
  }

  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('departamento')
  async obtenerPorDepartamento() {
    return await this.dashboardService.obtenerPorDepartamento();
  }

  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('eventos')
  async eventosResumen() {
    return await this.dashboardService.eventosResumen();
  }
  
  //@UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('rol')
  async rol() {
    return await this.dashboardService.rol();
  }
}
