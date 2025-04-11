import { PrismaClient } from '@prisma/client';
import type { Adapter } from 'casbin';

export class CustomPrismaAdapter implements Adapter {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async loadPolicy(model: any): Promise<void> {
    const permisos = await this.prisma.permisos.findMany({
      include: { Roles: true },
    });

    for (const permiso of permisos) {
      const line = `${permiso.Roles.nombre}, ${permiso.objeto}, ${permiso.accion}`;
      this.loadPolicyLine(line, model);
    }
  }

  async savePolicy(): Promise<boolean> {
    // no se esta  guardando políticas desde código
    return true;
  }

  async addPolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void> {
    // Añadir desde código
  }

  async removePolicy(_sec: string, _ptype: string, _rule: string[]): Promise<void> {
    // Añadir desde código
  }

  async removeFilteredPolicy(
    _sec: string,
    _ptype: string,
    _fieldIndex: number,
    ..._fieldValues: string[]
  ): Promise<void> {
    // Añadir desde código
  }

  private loadPolicyLine(line: string, model: any): void {
    const tokens = line.trim().split(',').map((token) => token.trim());
    const policy = model.model.get('p')?.get('p');
    policy?.policy.push(tokens);
  }
}
