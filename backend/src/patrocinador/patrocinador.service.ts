import { Injectable, NotFoundException} from '@nestjs/common';
import { CreatePatrocinadorDto } from './dto/create-patrocinador.dto';
import { UpdatePatrocinadorDto } from './dto/update-patrocinador.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PatrocinadorService {
  constructor(private prisma: PrismaService) {}

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
    const patrocinador = await this.prisma.patrocinadores.findUnique({
      where: { id_patrocinador: id },
    });

    if (!patrocinador) {
      throw new NotFoundException(`⛔ Patrocinador con ID ${id} no encontrado.`);
    }

    return {
      data: patrocinador,
    };
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
