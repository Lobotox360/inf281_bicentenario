import { Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class EventoService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

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
    
    await this.prisma.eventos_Categorias.create({
      data: {
        id_evento,
        id_categoria: parseInt(categoria),
      },
    });
    
    if (ubicacion) {
      await this.prisma.ubicacion.create({
        data: {
          id_evento,
          ...ubicacion,
        },
      });
    }
    
    await this.prisma.eventos_Patrocinadores.create({
      data: {
        id_evento,
        id_auspiciador: parseInt(patrocinador),
        fecha: new Date(),
      },
    });

    return { mensaje: '✅ Evento creado correctamente' };
  }

  async obtenerEventos() {
    const eventos = await this.prisma.eventos.findMany({
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Ubicacion: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } },
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

  async actualizarEvento(id: number, data: any, nuevaFoto?: Express.Multer.File) {
    const eventoExistente = await this.prisma.eventos.findUnique({
      where: { id_evento: id },
    });
  
    if (!eventoExistente) {
      return { mensaje: `❌ No se encontró el evento con ID ${id}` };
    }
  
    let url = eventoExistente.foto_evento;
  
    // ✅ Si llega una nueva imagen, súbela y actualiza la URL
    if (nuevaFoto) {
      const subida = await this.subirFoto(nuevaFoto);
      url = subida.secure_url;
    }
  
    // ✅ Actualizar campos principales si están definidos
    await this.prisma.eventos.update({
      where: { id_evento: id },
      data: {
        titulo: data.titulo || undefined,
        descripcion: data.descripcion || undefined,
        hora_inicio: data.hora_inicio || undefined,
        hora_fin: data.hora_fin || undefined,
        costo: data.costo ? parseFloat(data.costo) : undefined,
        modalidad: data.modalidad || undefined,
        foto_evento: url,
      },
    });
  
    // ✅ Actualizar expositores si se envían
    if (data.expositor) {
      await this.prisma.expositores.deleteMany({ where: { id_evento: id } });
      const nuevosExpositores = Array.isArray(data.expositor)
        ? data.expositor
        : [data.expositor];
  
      await this.prisma.expositores.createMany({
        data: nuevosExpositores.map((exp) => ({
          id_evento: id,
          ...exp,
        })),
      });
    }
  
    // ✅ Actualizar teléfonos si se envían
    if (data.telefonos_contacto) {
      await this.prisma.telefonos.deleteMany({ where: { id_evento: id } });
      const nuevosTelefonos = data.telefonos_contacto.map((tel, index) => ({
        id_evento: id,
        nombre: `Teléfono ${index + 1}`,
        numero: tel.telefono,
      }));
  
      await this.prisma.telefonos.createMany({ data: nuevosTelefonos });
    }
  
    // ✅ Actualizar ubicación si se envía
    if (data.ubicacion) {
      await this.prisma.ubicacion.deleteMany({ where: { id_evento: id } });
      await this.prisma.ubicacion.create({
        data: { id_evento: id, ...data.ubicacion },
      });
    }
  
    // ✅ Actualizar categoría si se envía
    if (data.categoria) {
      await this.prisma.eventos_Categorias.deleteMany({ where: { id_evento: id } });
      await this.prisma.eventos_Categorias.create({
        data: {
          id_evento: id,
          id_categoria: parseInt(data.categoria),
        },
      });
    }
  
    // ✅ Actualizar patrocinador si se envía
    if (data.patrocinador) {
      await this.prisma.eventos_Patrocinadores.deleteMany({ where: { id_evento: id } });
      await this.prisma.eventos_Patrocinadores.create({
        data: {
          id_evento: id,
          id_auspiciador: parseInt(data.patrocinador),
          fecha: new Date(),
        },
      });
    }
  
    return { mensaje: '✅ Evento actualizado correctamente' };
  }
  

}
