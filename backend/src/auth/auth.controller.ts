import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() { email, contrasena }: { email: string; contrasena: string }) {
    return this.authService.login(email, contrasena);
  }

  @Post('recuperar')
  async recuperar_password(@Body() { email }: { email: string }) {
    return this.authService.sendPasswordResetEmail(email);
  }

  @Post('cambiar-password')
  async cambiarPasswordConToken(
    @Body() data: { token: string; nuevaContrasena: string }
  ) {
    return this.authService.cambiarPasswordConToken(data);
  }
}
