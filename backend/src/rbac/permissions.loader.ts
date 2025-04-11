import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CasbinService } from './casbin.service';

@Injectable()
export class PermissionsLoader {
  private prisma = new PrismaClient();

  constructor(private readonly casbinService: CasbinService) {}

  // Carga permisos de la base de datos al enforcer de Casbin
  async loadPermissions() {
    const enforcer = this.casbinService.getEnforcer();
    await enforcer.clearPolicy(); // Limpia las políticas anteriores

    const permisos = await this.prisma.permisos.findMany({
      include: { Roles: true },
    });

    for (const permiso of permisos) {
      await enforcer.addPolicy(
        permiso.Roles.nombre, // rol
        permiso.objeto,       // recurso
        permiso.accion,       // acción
      );
    }

    await enforcer.savePolicy(); // Guarda las políticas en Casbin
    console.log('🔐 Permisos Casbin cargados desde la base de datos');
  }
}
