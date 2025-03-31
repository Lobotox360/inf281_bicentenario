import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email.recuperar';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // 🔐 Inicio de sesión
  async login(email: string, contrasena: string) {
    const usuario = await this.prisma.usuarios.findFirst({
      where: {
        email,
        verificado: true,
      },
    });
    

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = { sub: usuario.id_usuario, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token, id: usuario.id_usuario };
  }

  // 📤 Enviar enlace de recuperación por correo
  async sendPasswordResetEmail(email: string) {
    const usuario = await this.prisma.usuarios.findUnique({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('El correo no existe');
    }

    const token = randomBytes(32).toString('hex');
    const expiracion = addMinutes(new Date(), 15); // Token válido por 15 minutos

    await this.prisma.usuarios.update({
      where: { email },
      data: {
        tokenRecuperacion: token,
        expiracionTokenRecuperacion: expiracion,
      },
    });

    const link = `http://localhost:3000/restablecer?token=${token}`;

    await this.emailService.sendPasswordResetEmail(email, link);

    return { message: '📩 Correo de recuperación enviado correctamente' };
  }

  // 🔁 Cambiar contraseña con token
  async cambiarPasswordConToken({ token, nuevaContrasena }: { token: string; nuevaContrasena: string }) {
    const usuario = await this.prisma.usuarios.findFirst({
      where: { tokenRecuperacion: token },
    });

    if (!usuario) {
      throw new BadRequestException('Token inválido');
    }

    if (usuario.expiracionTokenRecuperacion! < new Date()) {
      throw new BadRequestException('El enlace ha expirado');
    }

    const nuevaHash = await bcrypt.hash(nuevaContrasena, 10);

    await this.prisma.usuarios.update({
      where: { email: usuario.email },
      data: {
        contrasena: nuevaHash,
        tokenRecuperacion: null,
        expiracionTokenRecuperacion: null,
      },
    });

    return { message: '✅ Contraseña actualizada correctamente' };
  }
}
