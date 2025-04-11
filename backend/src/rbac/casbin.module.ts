import { Module, OnModuleInit } from '@nestjs/common';
import { CasbinService } from './casbin.service';
import { PermissionsLoader } from './permissions.loader';

@Module({
  providers: [CasbinService, PermissionsLoader],
  exports: [CasbinService],
})
export class CasbinModule implements OnModuleInit {
  constructor(private readonly permissionsLoader: PermissionsLoader) {}

  async onModuleInit() {
    await this.permissionsLoader.loadPermissions(); // ⬅️ Aquí se imprime el console.log
  }
}
