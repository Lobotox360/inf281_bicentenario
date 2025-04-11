import { Injectable, OnModuleInit } from '@nestjs/common';
import { newEnforcer } from 'casbin';
import { join } from 'path';
import { CustomPrismaAdapter } from './custom-prisma-adapter';

@Injectable()
export class CasbinService implements OnModuleInit {
  private enforcer;

  async onModuleInit() {
    const adapter = new CustomPrismaAdapter();
    this.enforcer = await newEnforcer(
      join(process.cwd(), 'src/config/casbin-model.conf'),
      adapter,
    );
    await this.enforcer.loadPolicy(); // Carga las políticas al iniciar el módulo
  }

  // Verifica si el usuario tiene acceso
  async checkPermission(sub: string, obj: string, act: string): Promise<boolean> {
    return this.enforcer.enforce(sub, obj, act);
  }

  getEnforcer() {
    return this.enforcer;
  }
}
