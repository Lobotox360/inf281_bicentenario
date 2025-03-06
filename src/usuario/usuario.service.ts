import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.usuario.findMany();
  }

  async createUser(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    return await this.prisma.usuario.create({
      data: {
        nombre: createUsuarioDto.nombre,
        apellidoPaterno: createUsuarioDto.apellidoPaterno,
        apellidoMaterno: createUsuarioDto.apellidoMaterno,
        email: createUsuarioDto.email,
        contrasena: hashedPassword,
        telefono: createUsuarioDto.telefono,
        pais: createUsuarioDto.pais,
        ciudad: createUsuarioDto.ciudad,
        genero: createUsuarioDto.genero,
      }
    });
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async remove(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.prisma.usuario.delete({ where: { id } });
  }
}
