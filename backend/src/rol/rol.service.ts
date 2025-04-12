import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class RolService {

    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) {}
    async obtenerTodos() {
        return await this.prisma.roles.findMany({
          select: {
            id_rol: true,
            nombre: true,
            descripcion_rol: true,
          },
        });
    }
      
    async findAll() {
        return await this.prisma.usuarios.findMany({
            select: {
            nombre: true,
            email: true,
            telefono: true,
            pais: true,
            Roles: {
                select: {
                    nombre: true,
                },
            },
            },
        });
    }

    async cambiarRol(email: string, nuevoRol: number) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { email },
      });
    
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado con ese email.');
      }
    
      if (usuario.id_rol === nuevoRol) {
        throw new BadRequestException('El nuevo rol debe ser diferente al actual.');
      }
    
      const nuevoRolData = await this.prisma.roles.findUnique({
        where: { id_rol: nuevoRol },
      });
    
      if (!nuevoRolData) {
        throw new BadRequestException('El nuevo rol especificado no existe.');
      }
    
      await this.prisma.usuarios.update({
        where: { email },
        data: { id_rol: nuevoRol },
      });
    
      // ✍️ Registrar actividad del usuario cuyo rol fue cambiado
      await this.registrarActividad(
        usuario.id_usuario,
        'Cambio de rol',
        `🔄 Su rol fue cambiado por un administrador.\n📧 Correo: ${usuario.email}\n🆔 Nuevo Rol (ID): ${nuevoRol} - ${nuevoRolData.nombre}`
      );
      
    
      await this.emailService.sendRoleChangedEmail(email, nuevoRolData.nombre);
      return {
        message: `✅ Rol actualizado correctamente para ${email}`,
      };
    }
    

  async registrarActividad(id_usuario: string, tipo: string, descripcion: string) {
    await this.prisma.historial_Actividades.create({
      data: {
        id_usuario,
        fecha_actividad: new Date(),
        tipo_actividad: tipo,
        descripcion,
      },
    });
  }
    
}
