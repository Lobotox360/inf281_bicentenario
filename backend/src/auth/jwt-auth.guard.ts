import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) { // ✅ Quitar `@Inject()`
    super();
  }
  
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado o mal formateado');
    }

    const token = authHeader.split(' ')[1];
    try {

      if (!this.jwtService) {
        console.error("❌ jwtService sigue siendo undefined");
        throw new UnauthorizedException('jwtService no está definido');
      }

      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = decoded;
      return true;
    } catch (error) {
      //console.error("❌ Error al verificar el token:", error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
