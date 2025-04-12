import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoriaDto) {
    const existe = await this.prisma.categorias.findUnique({
      where: { nombre: data.nombre },
    });
  
    if (existe) {
      return { mensaje: `⚠️ La categoría "${data.nombre}" ya existe.` };
    }
  
    const nuevaCategoria = await this.prisma.categorias.create({ data });
  
    return { mensaje: '✅ Categoría agregada exitosamente.'};
  }  

  async findAll() {
    return this.prisma.categorias.findMany();
  }

  async findOne(id: number) {
    return this.prisma.categorias.findUnique({ where: { id_categoria: id } });
  }

  async update(id: number, data: UpdateCategoriaDto) {
    const categoria = await this.prisma.categorias.findUnique({
      where: { id_categoria: id },
    });
  
    if (!categoria) {
      return { mensaje: `❌ No se encontró la categoría con ID ${id}.` };
    }
  
    const actualizada = await this.prisma.categorias.update({
      where: { id_categoria: id },
      data,
    });
  
    return { mensaje: `✅ Categoría actualizada exitosamente.` };
  }
  

  async remove(id: number) {
    const categoria = await this.prisma.categorias.findUnique({
      where: { id_categoria: id },
    });
  
    await this.prisma.categorias.delete({
      where: { id_categoria: id },
    });
  
    return { mensaje: `✅ Categoría eliminada correctamente.` };
  }
  
}
