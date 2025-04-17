import { Injectable, NotFoundException} from '@nestjs/common';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatrocinadorService {
  constructor(private prisma: PrismaService) {}

  async updatePatrocinadoresDeEvento(id_evento: number, patrocinadores: { id_patrocinador: number }[]) {
    // Obtener las relaciones existentes entre evento y patrocinadores
    const relacionesExistentes = await this.prisma.eventos_Patrocinadores.findMany({
      where: { id_evento },
      select: { id_auspiciador: true },  // id_auspiciador es el id del patrocinador
    });

    // Convertir las relaciones existentes en un set de id_auspiciador
    const id_patrocinadoresExistentes = relacionesExistentes.map(r => r.id_auspiciador);

    // Convertir el array recibido a un array de id_patrocinador
    const id_patrocinadoresNuevos = patrocinadores.map(p => p.id_patrocinador);

    // Encontrar los patrocinadores que deben ser eliminados (los existentes que no están en el array)
    const patrocinadoresAEliminar = id_patrocinadoresExistentes.filter(id => !id_patrocinadoresNuevos.includes(id));

    // Eliminar los patrocinadores que ya no están en el array
    await this.prisma.eventos_Patrocinadores.deleteMany({
      where: {
        id_evento,
        id_auspiciador: { in: patrocinadoresAEliminar },
      },
    });

    // Agregar los patrocinadores nuevos que no existían en la relación
    for (const id_patrocinador of id_patrocinadoresNuevos) {
      // Verificamos si la relación ya existe para no agregarla nuevamente
      const existeRelacion = await this.prisma.eventos_Patrocinadores.findFirst({
        where: { id_evento, id_auspiciador: id_patrocinador },
      });

      // Si no existe la relación, la agregamos
      if (!existeRelacion) {
        await this.prisma.eventos_Patrocinadores.create({
          data: {
            id_evento,
            id_auspiciador: id_patrocinador,
          },
        });
      }
    }

    // Devolver las relaciones actualizadas
    const patrocinadoresActualizados = await this.prisma.eventos_Patrocinadores.findMany({
      where: { id_evento },
    });

    // Retornar un mensaje indicando que los patrocinadores fueron actualizados correctamente
    return {
      message: 'Patrocinadores actualizados correctamente.'
    };
  }

  // Método para obtener los patrocinadores de un evento
  async getPatrocinadoresByEvento(id_evento: number) {
    const patrocinadores = await this.prisma.eventos_Patrocinadores.findMany({
      where: { id_evento },
      include: {
        Patrocinadores: true,
      },
    });

    if (patrocinadores.length > 0) {
      return patrocinadores.map(p => p.Patrocinadores);
    } else {
      return { message: 'No se encontraron patrocinadores para este evento.' };
    }
  }

  async create(data: CreatePatrocinadorDto) {
    const existe = await this.prisma.patrocinadores.findUnique({
      where: { razon_social: data.razon_social },
    });

    if (existe) {
      return { mensaje: `⚠️ El patrocinador "${data.razon_social}" ya existe.` };
    }

    await this.prisma.patrocinadores.create({ data });
    return { mensaje: '✅ Patrocinador creado exitosamente.' };
  }

  findAll() {
    return this.prisma.patrocinadores.findMany();
  }

  async findOne(id: number) {
    return this.prisma.patrocinadores.findUnique({where: { id_patrocinador: id },});
  }

  async update(id: number, data: UpdatePatrocinadorDto) {
    const patrocinador = await this.prisma.patrocinadores.findUnique({
      where: { id_patrocinador: id },
    });

    await this.prisma.patrocinadores.update({
      where: { id_patrocinador: id },
      data,
    });

    return { mensaje: '✅ Patrocinador actualizado correctamente.' };
  }

  async remove(id: number) {
    const patrocinador = await this.prisma.patrocinadores.findUnique({
      where: { id_patrocinador: id },
    });

    await this.prisma.patrocinadores.delete({
      where: { id_patrocinador: id },
    });

    return { mensaje: '✅ Patrocinador eliminado correctamente.' };
  }
}
