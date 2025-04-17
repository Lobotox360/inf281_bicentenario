import { Injectable } from '@nestjs/common';
import { CreateTelefonoDto } from './dto/create-telefono.dto';
import { UpdateTelefonoDto } from './dto/update-telefono.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TelefonoService {
  constructor(private prisma: PrismaService) {}

  async updateTelefonosDeEvento(id_evento: number, telefonos_contacto: { telefono: string }[]) {
    // Eliminar todos los teléfonos asociados al evento
    await this.prisma.telefonos.deleteMany({
      where: {
        id_evento: id_evento,
      },
    });
  
    // Formatear los nuevos teléfonos para agregarles un nombre automáticamente
    const telefonosFormateados = telefonos_contacto.map((tel, index) => ({
      id_evento,
      nombre: `Teléfono ${index + 1}`,
      numero: tel.telefono,
    }));
  
    // Crear los nuevos teléfonos
    await this.prisma.telefonos.createMany({
      data: telefonosFormateados,
    });
  
    // Devolver los teléfonos creados
    const telefonosActualizados = await this.prisma.telefonos.findMany({
      where: { id_evento },
    });
  
    return {
      message: 'Teléfonos actualizados correctamente.'
    };
  }
  
  
  
  
  async findAllByEvent(id_evento: number) {
    const telefonos = await this.prisma.telefonos.findMany({
      where: {
        evento: {
          id_evento: id_evento,
        },
      },
    });
  
    if (telefonos.length > 0) {
      return telefonos;
    } else {
      return { message: 'No se encontraron teléfonos para este evento.' };
    }
  }
  
    
}
