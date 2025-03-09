import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email.recuperar';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private emailService: EmailService,
  ) {}
  async login(email: string, contrasena: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token, id: usuario.id };
  }

  async sendPasswordResetEmail(email: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('El correo no existe');
    }

    const newPassword = Math.random().toString(36).slice(-8); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Guardar la nueva contraseña en la base de datos
    await this.prisma.usuario.update({
      where: { email },
      data: { contrasena: hashedPassword },
    });

    // 4️⃣ Enviar la nueva contraseña por correo electrónico
    await this.emailService.sendPasswordResetEmail(email, newPassword);

    return { message: 'Correo de recuperación enviado correctamente' };
  }
}
