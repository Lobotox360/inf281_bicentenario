import { Injectable } from '@nestjs/common';
import { CreateExpositorDto } from './dto/create-expositor.dto';
import { UpdateExpositorDto } from './dto/update-expositor.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExpositorService {
  constructor(private prisma: PrismaService) {}

  async updateExpositoresDeEvento(id_evento: number, expositores: CreateExpositorDto[]) {
    // Eliminar todos los expositores existentes para el evento
    await this.prisma.expositores.deleteMany({
      where: { id_evento },
    });

    // Insertar los nuevos expositores
    const nuevosExpositores = expositores.map((expositor) => ({
      id_evento,
      nombre: expositor.nombre,
      especialidad: expositor.especialidad,
      institucion: expositor.institucion,
      contacto: expositor.contacto,
    }));

    await this.prisma.expositores.createMany({
      data: nuevosExpositores,
    });


    return {
      message: 'Expositores actualizados correctamente.'
    };
  }
  
  
  async findAllByEvent(id_evento: number) {
    const expositores = await this.prisma.expositores.findMany({
      where: {
        id_evento: id_evento,
      },
    });
  
    if (expositores.length > 0) {
      return expositores;
    } else {
      return { message: 'No se encontraron expositores para este evento.' };
    }
  }
  

  
  
  
  
  
}
