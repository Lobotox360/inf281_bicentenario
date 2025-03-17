import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Registro y envío de código de verificación
  @Post('registrar')
  async registerUser(@Body() userData: CreateUsuarioDto) {
    return await this.usuarioService.registerUser(userData);
  }

  // Verificar el código y creación del usuario
  @Post('verificar')
  async verifyEmail(@Body() { email, code }: { email: string; code: string }) {
    return await this.usuarioService.verifyAndCreateUser(email, code);
  }

  // Reenvia el código si ha expirado
  @Post('reenviar')
  async resendCode(@Body('email') email: string) {
    console.log("📩 Recibiendo solicitud de reenvío para:", email);
    return this.usuarioService.resendVerificationCode(email);
  }

  // Obtener todos los usuarios
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usuarioService.getUsers();
  }

  // Obtener un usuario por ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  // Eliminar un usuario
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
  
  // Editar usuario por ID
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioService.updateUser(id, updateUsuarioDto);
  }
  
}
