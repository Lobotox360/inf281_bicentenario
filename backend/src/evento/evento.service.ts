import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Injectable()
export class EventoService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getTop10Eventos() {
    const eventos = await this.prisma.eventos.findMany({
      orderBy: {
        puntuacion: 'desc', // Ordenar por puntuación en orden descendente
      },
      take: 10, // Limitar a los primeros 10 eventos
    });

    return eventos;
  }
  async getUbicacionByEvento(id_evento: number) {
    const ubicacion = await this.prisma.ubicacion.findUnique({
      where: {
        id_evento: id_evento,
      },
    });

    if (!ubicacion) {
      return { message: 'Ubicación no encontrada para este evento.' };
    }
    return { ubicacion };
  }

  async updateUbicacion(id_ubicacion: number, updateUbicacionDto: any) {
    const ubicacionExistente = await this.prisma.ubicacion.findUnique({
      where: { id_ubicacion: id_ubicacion },
    });

    if (!ubicacionExistente) {
      return {
        message: 'La ubicación con el id_ubicacion proporcionado no fue encontrada.',
      };
    }

    const updatedUbicacion = await this.prisma.ubicacion.update({
      where: {
        id_ubicacion: id_ubicacion,
      },
      data: updateUbicacionDto,
    });

    return {
      message: 'Ubicación actualizada con éxito.'
    };
  }


  async subirFoto(file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(file, 'eventos');
  }

  async procesarYCrearEvento(body: any, foto_evento: Express.Multer.File) {
    const {
      titulo,
      descripcion,
      hora_inicio,
      hora_fin,
      costo,
      modalidad,
      categoria,
      patrocinador,
      telefonos_contacto,
      expositor,
      ubicacion,
    } = body;

    const url = body.foto_evento;


    const evento = await this.prisma.eventos.create({
      data: {
        titulo,
        descripcion,
        hora_inicio,
        hora_fin,
        fecha: new Date(),
        costo: parseFloat(costo),
        modalidad,
        foto_evento: url,
      },
    });

    const id_evento = evento.id_evento;


    
    // Guardar expositores
    if (Array.isArray(expositor)) {
      const expositoresFormateados = expositor.map((exp) => ({
        id_evento,
        ...exp,
      }));
    
      await this.prisma.expositores.createMany({
        data: expositoresFormateados,
      });
    }
    
    // Guardar Telefonos
    if (Array.isArray(telefonos_contacto)) {
      const telefonosFormateados = telefonos_contacto.map((tel, index) => ({
        id_evento,
        nombre: `Teléfono ${index + 1}`,
        numero: tel.telefono,
      }));
    
      await this.prisma.telefonos.createMany({
        data: telefonosFormateados,
      });
    }

    if (ubicacion) {
      await this.prisma.ubicacion.create({
        data: {
          id_evento,
          ...ubicacion,
        },
      });
    }   

  for (const cat of categoria) {
    await this.prisma.eventos_Categorias.create({
      data: {
        id_evento: evento.id_evento,
        id_categoria: cat.id_categoria,
      },
    });
  }

  // Crear los patrocinadores asociados al evento
  for (const patro of patrocinador) {
    await this.prisma.eventos_Patrocinadores.create({
      data: {
        id_evento: evento.id_evento,
        id_auspiciador: patro.id_auspiciador,
      },
    });
  }
    return { mensaje: '✅ Evento creado correctamente' };
  }

  async obtenerEventos() {
    const eventos = await this.prisma.eventos.findMany({
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Ubicacion: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } }
      },
    });
  
    const ahora = new Date();
  
    return eventos.map(evento => {
      const inicio = new Date(evento.hora_inicio);
      const fin = new Date(evento.hora_fin);
  
      let estado = '';
      if (ahora < inicio) {
        estado = 'Próximo';
      } else if (ahora > fin) {
        estado = 'Finalizado';
      } else {
        estado = 'En curso';
      }
  
      return {
        ...evento,
        estado,
      };
    });
  }
  
  async eliminarEvento(id: number) {
    const eventoExistente = await this.prisma.eventos.findUnique({
      where: { id_evento: id },
    });
  
    if (!eventoExistente) {
      return { mensaje: `❌ El evento con ID ${id} no existe.` };
    }
  
    await this.prisma.eventos.delete({
      where: { id_evento: id },
    });
  
    return { mensaje: `🗑️ Evento con ID ${id} eliminado correctamente.` };
  }

  
  
  async obtenerEventoPorId(id: number) {
    const evento = await this.prisma.eventos.findUnique({
      where: { id_evento: id },
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Ubicacion: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } },
      },
    });
  
    if (!evento) {
      return { mensaje: `❌ No se encontró el evento con ID ${id}` };
    }
  
    const ahora = new Date();
    const inicio = new Date(evento.hora_inicio);
    const fin = new Date(evento.hora_fin);
  
    let estado = '';
    if (ahora < inicio) {
      estado = 'Próximo';
    } else if (ahora > fin) {
      estado = 'Finalizado';
    } else {
      estado = 'En curso';
    }
  
    return { ...evento, estado };
  }

  async updateEvento(id_evento: number, updateEventoDto: UpdateEventoDto) {
    const now = new Date().toISOString();
  
    const updatedEvento = await this.prisma.eventos.update({
      where: { id_evento: id_evento },
      data: {
        ...updateEventoDto,
        fecha: now,
      },
    });
  
    return { mensaje: '✅ Evento actualizado correctamente'};
  }

  async actualizarFotoEvento(id_evento: number, foto_evento: Express.Multer.File) {
    const subida = await this.subirFoto(foto_evento);
    const url = subida.secure_url;
  
    const eventoId = parseInt(id_evento.toString(), 10); 
  
    if (isNaN(eventoId)) {
      throw new Error('El id_evento debe ser un número válido');
    }
  
    const eventoActualizado = await this.prisma.eventos.update({
      where: {
        id_evento: eventoId,
      },
      data: {
        foto_evento: url,
      },
    });
  
    return { mensaje: '✅ Foto actualizado correctamente'};
  }
  
}
