import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PuntuacionService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtener los top N usuarios por puntaje
  async getTopUsuarios(limit: number) {
    return await this.prisma.usuarios.findMany({
      orderBy: {
        puntaje: 'desc',
      },
      take: limit,
      select: {
        id_usuario: true,
        nombre: true,
        apellidopaterno: true,
        apellidomaterno: true,
        foto: true,
        puntaje: true,
      },
    });
  }

  // Obtener datos de un solo usuario por ID
  async getUsuarioData(id_usuario: string) {
    return await this.prisma.usuarios.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        nombre: true,
        apellidopaterno: true,
        apellidomaterno: true,
        foto: true,
        puntaje: true,
      },
    });
  }
}
