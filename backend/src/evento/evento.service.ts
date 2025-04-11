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
      ubicacion,
      departamento,
      costo,
      modalidad,
      estado,
      categoria,
      patrocinador,
      telefonos_contacto,
      expositor,
    } = body;

    const contacto = typeof body.telefonos_contacto === 'string'
      ? JSON.parse(body.telefonos_contacto as any)
      : body.telefonos_contacto;

    const expositores = typeof body.expositor === 'string'
      ? JSON.parse(body.expositor as any)
      : body.expositor;


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
        ubicacion,
        departamento,
        costo: parseFloat(costo),
        modalidad,
        foto_evento: url,
      },
    });
    
    const id_evento = evento.id_evento;

    if (Array.isArray(telefonos_contacto)) {
      const telefonosFormateados = telefonos_contacto.map((t, index) => ({
        id_evento,
        nombre: `Teléfono ${index + 1}`,
        numero: t.telefono,
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

    

    if (Array.isArray(expositor)) {
      const expositoresFormateados = expositor.map((exp) => ({
        id_evento,
        ...exp,
      }));

      await this.prisma.expositores.createMany({
        data: expositoresFormateados,
      });
    }

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
    return await this.prisma.eventos.findMany({
      include: {
        Telefonos: true,
        CategoriasEvento: { include: { categoria: true } },
        Expositores: true,
        Eventos_Patrocinadores: { include: { Patrocinadores: true } },
      },
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
