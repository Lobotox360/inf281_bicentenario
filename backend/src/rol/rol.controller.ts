import { Controller, Get, Put, UseGuards, Param, Body } from '@nestjs/common';
import { RolService } from './rol.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CasbinGuard } from '../rbac/casbin.guard';


@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('roles')
  async obtenerTodosLosRoles() {
    return await this.rolService.obtenerTodos();
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Get('usuarios')
  findAll() {
    return this.rolService.findAll();
  }

  @UseGuards(JwtAuthGuard, CasbinGuard)
  @Put('cambiar-rol')
  async cambiarRolUsuario(
    @Body() body: { email: string; nuevoRol: number },
  ) {
    const { email, nuevoRol } = body;
    return await this.rolService.cambiarRol(email, nuevoRol);
  }

}
