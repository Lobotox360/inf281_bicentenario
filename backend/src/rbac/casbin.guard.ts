import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { CasbinService } from './casbin.service';

@Injectable()
export class CasbinGuard implements CanActivate {
  private readonly logger = new Logger(CasbinGuard.name);

  constructor(private readonly casbinService: CasbinService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const controller = context.getClass();
    const obj = controller.name.replace('Controller', '').toLowerCase(); // 'usuario'
    const act = req.method.toLowerCase(); // 'get', 'post', etc.
    const sub = user.rol; // 'usuario_casual', etc.

    this.logger.debug(`🔐 Verificando acceso → sub="${sub}", obj="${obj}", act="${act}"`);

    const hasAccess = await this.casbinService.checkPermission(sub, obj, act);

    if (!hasAccess) {
      this.logger.warn(`⛔ Acceso denegado → sub="${sub}", obj="${obj}", act="${act}"`);
      throw new ForbiddenException('No tienes permisos suficientes.');
    }

    this.logger.log(`✅ Acceso permitido → sub="${sub}", obj="${obj}", act="${act}"`);
    return true;
  }
}
