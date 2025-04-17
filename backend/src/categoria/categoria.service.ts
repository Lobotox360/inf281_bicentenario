import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async getCategoriasByEvento(id_evento: number) {
    const categorias = await this.prisma.eventos_Categorias.findMany({
      where: {
        id_evento: id_evento,
      },
      include: {
        categoria: true,
      },
    });

    if (categorias.length > 0) {
      return categorias.map(c => c.categoria);
    } else {
      return { message: 'No se encontraron categorías para este evento.' };
    }
  }

  async updateCategoriasDeEvento(id_evento: number, categorias: { id_categoria: number }[]) {
    // Obtener las relaciones existentes entre evento y categorías
    const relacionesExistentes = await this.prisma.eventos_Categorias.findMany({
      where: { id_evento },
      select: { id_categoria: true },
    });
  
    // Convertir las relaciones existentes en un set de id_categoria
    const id_categoriasExistentes = relacionesExistentes.map(r => r.id_categoria);
  
    // Convertir el array recibido a un array de id_categoria
    const id_categoriasNuevas = categorias.map(c => c.id_categoria);
  
    // Encontrar las categorías que deben ser eliminadas (las existentes que no están en el array)
    const categoriasAEliminar = id_categoriasExistentes.filter(id => !id_categoriasNuevas.includes(id));
  
    // Eliminar las categorías que ya no están en el array
    await this.prisma.eventos_Categorias.deleteMany({
      where: {
        id_evento,
        id_categoria: { in: categoriasAEliminar },
      },
    });
  
    // Agregar las categorías nuevas que no existían en la relación
    for (const id_categoria of id_categoriasNuevas) {
      // Verificamos si la relación ya existe para no agregarla nuevamente
      const existeRelacion = await this.prisma.eventos_Categorias.findFirst({
        where: { id_evento, id_categoria },
      });
  
      // Si no existe la relación, la agregamos
      if (!existeRelacion) {
        await this.prisma.eventos_Categorias.create({
          data: {
            id_evento,
            id_categoria,
          },
        });
      }
    }
  
    // Devolver la relación actualizada
    return { message: 'Categorías actualizadas correctamente.' };
  }
  
  
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
