import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany();
  }

  async create(data: any) {
    return this.prisma.usuario.create({ data });
  }

  async findOne(id: string) {  // Cambiado a string
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {  // Cambiado a string
    return this.prisma.usuario.update({ where: { id }, data });
  }

  async delete(id: string) {  // Cambiado a string
    return this.prisma.usuario.delete({ where: { id } });
  }
}
