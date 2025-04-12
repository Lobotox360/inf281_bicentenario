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

  async getCategorias() {
    return this.prisma.categorias.findMany();
  }

  async getPatrocinadores() {
    return this.prisma.patrocinadores.findMany();
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

    let url = '';
    if (foto_evento) {
      const subida = await this.subirFoto(foto_evento);
      url = subida.secure_url;
    }

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


    
    // ✅ Guardar expositores
    if (Array.isArray(expositor)) {
      const expositoresFormateados = expositor.map((exp) => ({
        id_evento,
        ...exp,
      }));
    
      await this.prisma.expositores.createMany({
        data: expositoresFormateados,
      });
    }
    
    
    if (Array.isArray(telefonos_contacto)) {
      const telefonosFormateados = telefonos_contacto.map((tel, index) => ({
        id_evento,
        nombre: `Teléfono ${index + 1}`,
        numero: tel.telefono, // ✅ Aquí accede directamente a la propiedad 'telefono'
      }));
    
      await this.prisma.telefonos.createMany({
        data: telefonosFormateados,
      });
    }
    

    // ✅ Guardar categoría
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
    
    

    // ✅ Guardar patrocinador
    await this.prisma.eventos_Patrocinadores.create({
      data: {
        id_evento,
        id_auspiciador: parseInt(patrocinador),
        fecha: new Date(),
        monto: 0,
      },
    });

    return { mensaje: '✅ Evento creado correctamente', evento };
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
  

  findOne(id: number) {
    return `This action returns a #${id} evento`;
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return `This action updates a #${id} evento`;
  }

  remove(id: number) {
    return `This action removes a #${id} evento`;
  }
}
